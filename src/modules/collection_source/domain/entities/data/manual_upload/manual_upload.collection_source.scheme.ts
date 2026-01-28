import { Prop, Schema } from "@nestjs/mongoose";
import { BaseCollectionSourceData } from "../baseData";
import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";

export class ManualUploadCollectionSourceData extends BaseCollectionSourceData {

    constructor() {
        super();
        this.type = SourceTypeEnum.MEDIA_UPLOAD;
    }
}