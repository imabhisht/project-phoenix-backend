import { SourceTypeEnum } from '@modules/collection_source/domain/enums/source_types';
import { BaseCollectionMediaDataDTO } from './data/baseCollectionMediaData';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsBoolean, ValidateNested } from 'class-validator';
import { MediaUploadCollectionMediaDataDTO } from './data/media_upload/media_upload.collection_media.dto';
import { CollectionMedia } from '../domain/entities/collection_media.scheme';
import { CollectionMediaStatusEnum } from '../domain/enums/collection_media_status.enum';
import { AIIndexingStatus } from '../domain/entities/ai_indexing_status.collection_media';

export class AIIndexingStatusDTO {
    @IsEnum(CollectionMediaStatusEnum)
    @IsNotEmpty()
    status: CollectionMediaStatusEnum;

    @IsOptional()
    total_time: number | null;

    @IsOptional()
    total_chunks: number | null;

    static fromSchema(ai_indexing_status: AIIndexingStatus): AIIndexingStatusDTO {
        return {
            status: ai_indexing_status.status,
            total_time: ai_indexing_status.indexing_end_at ? ai_indexing_status.indexing_end_at.getTime() - ai_indexing_status.indexing_start_at.getTime() : null,
            total_chunks: ai_indexing_status.total_chunks,
        };
    }
}

export class CollectionMediaDTO {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsNotEmpty()
    collection_id: string;

    @IsString()
    @IsNotEmpty()
    collection_source_id: string;

    @ValidateNested({ each: true })
    @IsNotEmpty()
    @Type(() => BaseCollectionMediaDataDTO, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'type',
            subTypes: [
                { value: MediaUploadCollectionMediaDataDTO, name: SourceTypeEnum.MEDIA_UPLOAD },
            ],
        },
    })
    data: BaseCollectionMediaDataDTO;

    @ValidateNested()
    @IsOptional()
    @Type(() => AIIndexingStatusDTO)
    ai_indexing_status: AIIndexingStatusDTO;

    @IsDate()
    @IsOptional()
    created_at: Date;

    @IsDate()
    @IsOptional()
    updated_at: Date;

    static fromSchema(collectionMedia: CollectionMedia, data: BaseCollectionMediaDataDTO): CollectionMediaDTO {
        return {
            id: collectionMedia._id,
            collection_id: collectionMedia.collection_id,
            collection_source_id: collectionMedia.collection_source_id,
            data: data,
            ai_indexing_status: AIIndexingStatusDTO.fromSchema(collectionMedia.ai_indexing_status),
            created_at: collectionMedia.created_at,
            updated_at: collectionMedia.updated_at,
        };
    }
}