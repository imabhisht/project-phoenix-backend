import { BaseCollectionSourceData } from '@modules/collection_source/domain/entities/data/baseData';
import { SourceTypeEnum } from '../../domain/enums/source_types';

export abstract class BaseCollectionSourceDataDTO {
    type: SourceTypeEnum;

    setSchemaData(data: BaseCollectionSourceData): void {
        this.type = data.type;
    }
}