import { SourceTypeEnum } from '@modules/collection_source/domain/enums/source_types';
import { BaseCollectionMediaDataDTO } from './data/baseCollectionMediaData';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsBoolean, ValidateNested } from 'class-validator';
import { MediaUploadCollectionMediaDataDTO } from './data/media_upload/media_upload.collection_media.dto';

export class CollectionMediaDTO {
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
}