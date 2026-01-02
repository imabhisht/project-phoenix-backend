import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";
import { IBaseCollectionSourceDataService } from "./baseService";
import { AWS_S3CollectionSourceService } from "./aws_s3/aws_s3.collection_source.service";
import { Injectable } from "@nestjs/common";
import { GoogleDriveCollectionSourceService } from "./google_drive/google_drive.collection_source.service";

@Injectable()
export class CollectionSourceDataServiceFactory {
    constructor(
        private readonly aws_s3CollectionSourceService: AWS_S3CollectionSourceService,
        private readonly googleDriveCollectionSourceService: GoogleDriveCollectionSourceService,
    ) { }

    getService(type: SourceTypeEnum): IBaseCollectionSourceDataService {
        switch (type) {
            case SourceTypeEnum.AWS_S3:
                return this.aws_s3CollectionSourceService;
            case SourceTypeEnum.GOOGLE_DRIVE:
                return this.googleDriveCollectionSourceService;
            default:
                throw new Error(`Unsupported source type: ${type}`);
        }
    }   
}