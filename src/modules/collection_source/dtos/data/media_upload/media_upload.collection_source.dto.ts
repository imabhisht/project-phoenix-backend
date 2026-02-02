import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";
import { BaseCollectionSourceDataDTO } from "../baseData.collection_source";
import { BaseCollectionSourceData } from "@modules/collection_source/domain/entities/data/baseData";
import { MediaUploadCollectionSourceData } from "@modules/collection_source/domain/entities/data/media_upload/media_upload.collection_source.scheme";

export class MediaUploadCollectionSourceDataDTO extends BaseCollectionSourceDataDTO {

    constructor() {
        super();
        this.type = SourceTypeEnum.MEDIA_UPLOAD;
    }

    toSchema(): MediaUploadCollectionSourceData {
        const schema = new MediaUploadCollectionSourceData();
        return schema;
    }

    fromSchema(baseCollectionSourceData: BaseCollectionSourceData): MediaUploadCollectionSourceDataDTO {
        this.setSchemaData(baseCollectionSourceData);
        return this;
    }
}