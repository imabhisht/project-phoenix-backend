import { BaseCollectionMediaData } from '@modules/collection_media/domain/entities/data/baseData';
import { SourceTypeEnum } from '@modules/collection_source/domain/enums/source_types';
import { IsEnum, IsNotEmpty } from 'class-validator';

export abstract class BaseCollectionMediaDataDTO {
    @IsEnum(SourceTypeEnum)
    @IsNotEmpty()
    type: SourceTypeEnum;

    setSchemaData(data: BaseCollectionMediaData): void {
        this.type = data.type;
    }
}