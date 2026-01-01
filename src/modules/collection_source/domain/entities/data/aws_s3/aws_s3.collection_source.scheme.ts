import { Prop, Schema } from "@nestjs/mongoose";
import { BaseCollectionSourceData } from "../baseData";
import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";

export class AWS_S3CollectionSourceData extends BaseCollectionSourceData {
    @Prop({ required: true, type: String })
    access_key: string;
    @Prop({ required: true, type: String })
    secret_key: string;
    @Prop({ required: true, type: String })
    region: string;
    @Prop({ required: true, type: String })
    bucket_name: string;

    constructor() {
        super();
        this.type = SourceTypeEnum.AWS_S3;
    }
}