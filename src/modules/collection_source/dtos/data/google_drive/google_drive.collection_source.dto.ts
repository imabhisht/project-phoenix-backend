import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";
import { BaseCollectionSourceDataDTO } from "../baseData.collection_source";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { AWS_S3CollectionSourceData } from "@modules/collection_source/domain/entities/data/aws_s3/aws_s3.collection_source.scheme";
import { BaseCollectionSourceData } from "@modules/collection_source/domain/entities/data/baseData";
import { GoogleDriveCollectionSourceData } from "@modules/collection_source/domain/entities/data/google_drive/google_drive.collection_source.scheme";

export class GoogleDriveCollectionSourceDataDTO extends BaseCollectionSourceDataDTO {
    @IsString()
    @IsOptional()
    client_id: string;
    
    @IsString()
    @IsOptional()
    client_secret: string;

    @IsString()
    @IsOptional()
    access_token: string;

    @IsString()
    @IsOptional()
    refresh_token: string;

    constructor() {
        super();
        this.type = SourceTypeEnum.GOOGLE_DRIVE;
    }

    toSchema(): GoogleDriveCollectionSourceData {
        const schema = new GoogleDriveCollectionSourceData();
        schema.client_id = process.env.GOOGLE_APP_CLIENT_ID;
        schema.client_secret = process.env.GOOGLE_APP_CLIENT_SECRET;
        schema.access_token = null;
        schema.refresh_token = null;
        return schema;
    }

    fromSchema(baseCollectionSourceData: BaseCollectionSourceData): GoogleDriveCollectionSourceDataDTO {
        this.setSchemaData(baseCollectionSourceData);
        const google_drive_collection_source_data = baseCollectionSourceData as GoogleDriveCollectionSourceData;
        this.client_id = google_drive_collection_source_data.client_id;
        this.client_secret = google_drive_collection_source_data.client_secret;
        this.access_token = google_drive_collection_source_data.access_token;
        this.refresh_token = google_drive_collection_source_data.refresh_token;
        return this;
    }
}