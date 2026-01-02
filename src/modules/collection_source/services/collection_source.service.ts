import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CollectionSourceRepository } from '@modules/collection_source/repository/collection_source.repository';
import { CollectionSourceDTO } from '../dtos/collection_source.dto';
import { CollectionSourceDataServiceFactory } from './data/serviceFactory';
import { IGoogleDriveCollectionSourceService } from './data/baseService';
import { SourceTypeEnum } from '../domain/enums/source_types';

@Injectable()
export class CollectionSourceService {
    private readonly logger = new Logger(CollectionSourceService.name);

    constructor(
        private readonly collectionSourceRepository: CollectionSourceRepository,
        private readonly collectionSourceDataServiceFactory: CollectionSourceDataServiceFactory,
    ) { }

    async create(createCollectionSourceDTO: CollectionSourceDTO): Promise<CollectionSourceDTO> {
        const collectionSourceDataService = this.collectionSourceDataServiceFactory.getService(createCollectionSourceDTO.data.type);
        const newCollectionSourceData = await collectionSourceDataService.create(createCollectionSourceDTO.data);
        const ifSameNameExists = await this.collectionSourceRepository.findByCollectionIdAndName(createCollectionSourceDTO.collection_id, createCollectionSourceDTO.name);
        if (ifSameNameExists) {
            throw new BadRequestException('Collection source with the same name already exists in the collection');
        }
        const newCollectionSource = await this.collectionSourceRepository.create({
            ...createCollectionSourceDTO.toSchema(),
            data: newCollectionSourceData,
        });
        return CollectionSourceDTO.fromSchema(newCollectionSource);
    }

    async findById(id: string): Promise<CollectionSourceDTO> {
        const collection = await this.collectionSourceRepository.findById(id);
        return CollectionSourceDTO.fromSchema(collection);
    }

    async update(id: string, updateCollectionSourceDTO: CollectionSourceDTO): Promise<CollectionSourceDTO> {
        await this.findById(id);
        const updateData = updateCollectionSourceDTO.toSchema();
        const updatedCollectionSource = await this.collectionSourceRepository.update(id, updateData);
        return CollectionSourceDTO.fromSchema(updatedCollectionSource);
    }

    async delete(id: string): Promise<CollectionSourceDTO> {
        await this.findById(id);
        const deletedCollectionSource = await this.collectionSourceRepository.delete(id);
        return CollectionSourceDTO.fromSchema(deletedCollectionSource);
    }

    // Google Drive OAuth specific methods
    async initiateGoogleOAuth(collectionSourceId: string): Promise<string> {
        const collectionSource = await this.findById(collectionSourceId);

        if (collectionSource.data.type !== SourceTypeEnum.GOOGLE_DRIVE) {
            throw new BadRequestException(
                `OAuth is not supported for source type: ${collectionSource.data.type}`
            );
        }

        const service = this.collectionSourceDataServiceFactory.getService(
            collectionSource.data.type
        ) as IGoogleDriveCollectionSourceService;

        return service.googleOAuth2GenerateAuthUrl(collectionSourceId);
    }

    async handleGoogleOAuthCallback(code: string, state: string): Promise<void> {
        const service = this.collectionSourceDataServiceFactory.getService(
            SourceTypeEnum.GOOGLE_DRIVE
        ) as IGoogleDriveCollectionSourceService;

        return service.googleOAuth2Callback(code, state);
    }
}
