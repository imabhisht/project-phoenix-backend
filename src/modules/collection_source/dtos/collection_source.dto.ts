import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsBoolean, ValidateNested } from 'class-validator';
import { CollectionSource } from '../domain/entities/collection_source.scheme';
import { BaseCollectionSourceData } from '../domain/entities/data/baseData';
import { CollectionSourceStatusEnum } from '../domain/enums/status';
import { Type } from 'class-transformer';
import { BaseCollectionSourceDataDTO } from './data/baseData.collection_source';
import { AWS_S3CollectionSourceDataDTO } from './data/aws_s3/aws_s3.collection_source.dto';
import { SourceTypeEnum } from '../domain/enums/source_types';
import { CollectionSourceDataFactory } from './data/dataFactory.collection_source';

export class CollectionSourceDTO {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    collection_id: string;

    @ValidateNested({ each: true })
    @IsNotEmpty()
    @Type(() => BaseCollectionSourceDataDTO, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'type',
            subTypes: [
                { value: AWS_S3CollectionSourceDataDTO, name: SourceTypeEnum.AWS_S3 },
            ],
        },
    })
    data: BaseCollectionSourceDataDTO;

    @IsEnum(CollectionSourceStatusEnum)
    @IsOptional()
    status?: CollectionSourceStatusEnum;

    @IsDate()
    @IsOptional()
    last_synced_at?: Date | null;

    @IsBoolean()
    @IsOptional()
    is_deleted?: boolean;

    @IsDate()
    @IsOptional()
    created_at?: Date;

    @IsDate()
    @IsOptional()
    updated_at?: Date;

    toSchema(): CollectionSource {
        return {
            _id: this.id,
            collection_id: this.collection_id,
            data: this.data,
            status: CollectionSourceStatusEnum.NOT_STARTED,
            last_synced_at: null,
            is_deleted: false,
            created_at: new Date(),
            updated_at: new Date(),
        };
    }

    static fromSchema(collectionSource: CollectionSource): CollectionSourceDTO {
        const dto = new CollectionSourceDTO();
        dto.id = collectionSource._id;
        dto.collection_id = collectionSource.collection_id;
        dto.data = CollectionSourceDataFactory.getCollectionSourceDataDTO(collectionSource.data);
        dto.status = collectionSource.status;
        dto.last_synced_at = collectionSource.last_synced_at;
        dto.is_deleted = collectionSource.is_deleted;
        dto.created_at = collectionSource.created_at;
        dto.updated_at = collectionSource.updated_at;
        return dto;
    }
}