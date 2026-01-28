import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";
import { BaseCollectionMediaData } from "@modules/collection_media/domain/entities/data/baseData";
import { BaseCollectionMediaDataDTO } from "./baseCollectionMediaData";
import { MediaUploadCollectionMediaDataDTO } from "./media_upload/media_upload.collection_media.dto";

export abstract class CollectionMediaDataFactory {
    static getCollectionMediaDataDTO(data: BaseCollectionMediaData): BaseCollectionMediaDataDTO {
        switch (data.type) {
            case SourceTypeEnum.MEDIA_UPLOAD:
                return new MediaUploadCollectionMediaDataDTO().fromSchema(data);
            default:
                throw new Error(`Unsupported media type: ${data.type}`);
        }
    }
}