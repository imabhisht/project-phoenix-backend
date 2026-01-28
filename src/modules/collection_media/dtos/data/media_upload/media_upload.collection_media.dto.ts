import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";
import { BaseCollectionMediaDataDTO } from "../baseCollectionMediaData";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { BaseCollectionMediaData } from "@modules/collection_media/domain/entities/data/baseData";
import { MediaUploadCollectionMediaData } from "@modules/collection_media/domain/entities/data/media_upload/media_upload.collection_data.scheme";


export class MediaUploadCollectionMediaDataDTO extends BaseCollectionMediaDataDTO {
    @IsString()
    @IsNotEmpty()
    media_id: string;
    
    constructor() {
        super();
        this.type = SourceTypeEnum.MEDIA_UPLOAD;
    }

    toSchema(): MediaUploadCollectionMediaData {
        const schema = new MediaUploadCollectionMediaData(this.media_id);
        schema.media_id = this.media_id;
        return schema;
    }

    fromSchema(baseCollectionMediaData: BaseCollectionMediaData): MediaUploadCollectionMediaDataDTO {
        this.setSchemaData(baseCollectionMediaData);
        const mediaUploadCollectionMediaData = baseCollectionMediaData as MediaUploadCollectionMediaData;
        this.media_id = mediaUploadCollectionMediaData.media_id;
        return this;
    }
}