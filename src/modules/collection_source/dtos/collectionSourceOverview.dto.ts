import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsBoolean, ValidateNested } from 'class-validator';
import { CollectionSource } from '../domain/entities/collection_source.scheme';
import { Type } from 'class-transformer';
import { BaseCollectionSourceDataDTO } from './data/baseData.collection_source';
import { SourceTypeEnum } from '../domain/enums/source_types';
import { CollectionSourceDataFactory } from './data/dataFactory.collection_source';
import { MediaUploadCollectionSourceDataDTO } from './data/media_upload/media_upload.collection_source.dto';

export class CollectionSourceOverviewDTO {
    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

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
                // { value: AWS_S3CollectionSourceDataDTO, name: SourceTypeEnum.AWS_S3 },
                // { value: GoogleDriveCollectionSourceDataDTO, name: SourceTypeEnum.GOOGLE_DRIVE },
                { value: MediaUploadCollectionSourceDataDTO, name: SourceTypeEnum.MEDIA_UPLOAD },
            ],
        },
    })
    data: BaseCollectionSourceDataDTO;

    @IsBoolean()
    @IsOptional()
    is_deleted?: boolean;

    @IsDate()
    @IsOptional()
    created_at?: Date;

    @IsDate()
    @IsOptional()
    updated_at?: Date;

    static fromSchema(collectionSource: CollectionSource): CollectionSourceOverviewDTO {
        const dto = new CollectionSourceOverviewDTO();
        dto.id = collectionSource._id;
        dto.collection_id = collectionSource.collection_id;
        dto.name = collectionSource.name;
        dto.data = CollectionSourceDataFactory.getCollectionSourceDataDTO(collectionSource.data);
        dto.is_deleted = collectionSource.is_deleted;
        dto.created_at = collectionSource.created_at;
        dto.updated_at = collectionSource.updated_at;
        return dto;
    }
}