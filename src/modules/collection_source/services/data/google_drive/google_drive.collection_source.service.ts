import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CollectionSourceRepository } from '@modules/collection_source/repository/collection_source.repository';
import { CollectionSourceDTO } from '@modules/collection_source/dtos/collection_source.dto';
import { BaseCollectionSourceData } from '@modules/collection_source/domain/entities/data/baseData';
import { BaseCollectionSourceDataDTO } from '@modules/collection_source/dtos/data/baseData.collection_source';
import { IGoogleDriveCollectionSourceService } from '../baseService';
import { GoogleDriveCollectionSourceDataDTO } from '@modules/collection_source/dtos/data/google_drive/google_drive.collection_source.dto';
import { google } from 'googleapis';
import * as crypto from 'crypto';
import { GoogleDriveCollectionSourceData } from '@modules/collection_source/domain/entities/data/google_drive/google_drive.collection_source.scheme';
import { SourceTypeEnum } from '@modules/collection_source/domain/enums/source_types';
import { AppException } from '@core/exceptions/appException';
import { CommonErrorModels } from '@core/exceptions/commonErrorModels';

@Injectable()
export class GoogleDriveCollectionSourceService implements IGoogleDriveCollectionSourceService {
    private readonly logger = new Logger(GoogleDriveCollectionSourceService.name);
    private oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_APP_CLIENT_ID,
        process.env.GOOGLE_APP_CLIENT_SECRET,
        process.env.GOOGLE_APP_REDIRECT_URI,
    );
    constructor(
        private readonly collectionSourceRepository: CollectionSourceRepository,
    ) { }

    async create(data: BaseCollectionSourceDataDTO): Promise<BaseCollectionSourceData> {
        var googleDriveCollectionSourceDataDTO = data as GoogleDriveCollectionSourceDataDTO;
        return googleDriveCollectionSourceDataDTO.toSchema();
    }

    async googleOAuth2GenerateAuthUrl(collectionSourceId: string): Promise<string> {
        const state = Buffer.from(
            JSON.stringify({
                collection_source_id: collectionSourceId,
            }),
        ).toString('base64');

        const url = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive.readonly'],
            prompt: 'consent',
            state: state,
        });
        return url;
    }

    async googleOAuth2Callback(code: string, state: string): Promise<void> {
        try {
            const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
            const collectionSourceId = decodedState.collection_source_id;
            const { tokens } = await this.oauth2Client.getToken(code);
            const collectionSource = await this.collectionSourceRepository.findById(collectionSourceId);
            if (!collectionSource) {
                throw new NotFoundException('Collection source not found');
            }
            const googleDriveCollectionSourceData = collectionSource.data as GoogleDriveCollectionSourceData;
            googleDriveCollectionSourceData.access_token = tokens.access_token;
            googleDriveCollectionSourceData.refresh_token = tokens.refresh_token;
            await this.collectionSourceRepository.update(collectionSourceId, { data: googleDriveCollectionSourceData });
        } catch (error) {
            this.logger.error(error);
            throw new AppException(CommonErrorModels.INTERNAL_SERVER_ERROR);
        }
    }
}
