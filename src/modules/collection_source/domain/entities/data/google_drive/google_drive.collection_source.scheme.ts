import { Prop, Schema } from "@nestjs/mongoose";
import { BaseCollectionSourceData } from "../baseData";
import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";

export class GoogleDriveCollectionSourceData extends BaseCollectionSourceData {
    @Prop({ required: true, type: String })
    client_id: string;
    @Prop({ required: true, type: String })
    client_secret: string;

    @Prop({ required: true, type: String })
    access_token: string | null;
    @Prop({ required: true, type: String })
    refresh_token: string | null;

    constructor() {
        super();
        this.type = SourceTypeEnum.GOOGLE_DRIVE;
    }
}