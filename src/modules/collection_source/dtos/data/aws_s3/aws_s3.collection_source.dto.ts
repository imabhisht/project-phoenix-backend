import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";
import { BaseCollectionSourceDataDTO } from "../baseData.collection_source";
import { IsString, IsNotEmpty } from "class-validator";
import { AWS_S3CollectionSourceData } from "@modules/collection_source/domain/entities/data/aws_s3/aws_s3.collection_source.scheme";
import { BaseCollectionSourceData } from "@modules/collection_source/domain/entities/data/baseData";

export class AWS_S3CollectionSourceDataDTO extends BaseCollectionSourceDataDTO {
    @IsString()
    @IsNotEmpty()
    access_key: string;
    
    @IsString()
    @IsNotEmpty()
    secret_key: string;

    @IsString()
    @IsNotEmpty()
    region: string;

    @IsString()
    @IsNotEmpty()
    bucket_name: string;

    constructor() {
        super();
        this.type = SourceTypeEnum.AWS_S3;
    }

    toSchema(): AWS_S3CollectionSourceData {
        const schema = new AWS_S3CollectionSourceData();
        schema.access_key = this.access_key;
        schema.secret_key = this.secret_key;
        schema.region = this.region;
        schema.bucket_name = this.bucket_name;
        return schema;
    }

    fromSchema(baseCollectionSourceData: BaseCollectionSourceData): AWS_S3CollectionSourceDataDTO {
        this.setSchemaData(baseCollectionSourceData);
        const aws_s3_collection_source_data = baseCollectionSourceData as AWS_S3CollectionSourceData;
        this.access_key = aws_s3_collection_source_data.access_key;
        this.secret_key = aws_s3_collection_source_data.secret_key;
        this.region = aws_s3_collection_source_data.region;
        this.bucket_name = aws_s3_collection_source_data.bucket_name;
        return this;
    }
}