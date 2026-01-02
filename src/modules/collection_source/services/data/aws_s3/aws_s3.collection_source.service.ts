import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CollectionSourceRepository } from '@modules/collection_source/repository/collection_source.repository';
import { CollectionSourceDTO } from '@modules/collection_source/dtos/collection_source.dto';
import { BaseCollectionSourceData } from '@modules/collection_source/domain/entities/data/baseData';
import { BaseCollectionSourceDataDTO } from '@modules/collection_source/dtos/data/baseData.collection_source';
import { AWS_S3CollectionSourceDataDTO } from '@modules/collection_source/dtos/data/aws_s3/aws_s3.collection_source.dto';
import { IBaseCollectionSourceDataService } from '../baseService';

@Injectable()
export class AWS_S3CollectionSourceService implements IBaseCollectionSourceDataService {
    private readonly logger = new Logger(AWS_S3CollectionSourceService.name);

    async create(data: BaseCollectionSourceDataDTO): Promise<BaseCollectionSourceData> {
        var aws_s3CollectionSourceDataDTO = data as AWS_S3CollectionSourceDataDTO;
        return aws_s3CollectionSourceDataDTO.toSchema();
    }
}
