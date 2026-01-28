import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";

export abstract class BaseCollectionMediaData {
    type: SourceTypeEnum;

    constructor(type: SourceTypeEnum) {
        this.type = type;
    }
}