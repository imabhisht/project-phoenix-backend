import { BaseCollectionSourceData } from '@modules/collection_source/domain/entities/data/baseData';
import { SourceTypeEnum } from '../../domain/enums/source_types';
import { IsEnum, IsNotEmpty } from 'class-validator';

export abstract class BaseCollectionSourceDataDTO {
    @IsEnum(SourceTypeEnum)
    @IsNotEmpty()
    type: SourceTypeEnum;

    setSchemaData(data: BaseCollectionSourceData): void {
        this.type = data.type;
    }
}