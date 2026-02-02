import { BaseCollectionSourceDataDTO } from "./baseData.collection_source";
import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";
import { AWS_S3CollectionSourceDataDTO } from "./aws_s3/aws_s3.collection_source.dto";
import { BaseCollectionSourceData } from "@modules/collection_source/domain/entities/data/baseData";
import { GoogleDriveCollectionSourceDataDTO } from "./google_drive/google_drive.collection_source.dto";
import { MediaUploadCollectionSourceDataDTO } from "./media_upload/media_upload.collection_source.dto";

export abstract class CollectionSourceDataFactory {
    static getCollectionSourceDataDTO(data: BaseCollectionSourceData): BaseCollectionSourceDataDTO {
        switch (data.type) {
            case SourceTypeEnum.AWS_S3:
                return new AWS_S3CollectionSourceDataDTO().fromSchema(data);
            case SourceTypeEnum.GOOGLE_DRIVE:
                return new GoogleDriveCollectionSourceDataDTO().fromSchema(data);
            case SourceTypeEnum.MEDIA_UPLOAD:
                return new MediaUploadCollectionSourceDataDTO().fromSchema(data);
            default:
                throw new Error(`Unsupported source type: ${data.type}`);
        }
    }
}