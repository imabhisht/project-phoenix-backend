import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";
import { Injectable } from "@nestjs/common";
import { ManualUploadCollectionMediaService } from "./manual_upload/manualUpload.collectionMedia.service";
import { IBaseCollectionMediaDataService } from "./baseService";

@Injectable()
export class CollectionMediaDataServiceFactory {
    constructor(
        private readonly mediaUploadCollectionMediaDataService: ManualUploadCollectionMediaService,
    ) { }

    getService(type: SourceTypeEnum): IBaseCollectionMediaDataService {
        switch (type) {
            case SourceTypeEnum.MEDIA_UPLOAD:
                return this.mediaUploadCollectionMediaDataService;
            default:
                throw new Error(`Unsupported source type: ${type}`);
        }
    }   
}