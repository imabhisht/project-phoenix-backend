import { Prop, Schema } from "@nestjs/mongoose";
import { BaseCollectionMediaData } from "@modules/collection_media/domain/entities/data/baseData";
import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";
import { Media } from "@modules/media/domain/entities/media.scheme";

export class MediaUploadCollectionMediaData extends BaseCollectionMediaData {

    @Prop({ required: true, type: String, ref: Media.name })
    media_id: string;

    constructor(media_id: string) {
        super(SourceTypeEnum.MEDIA_UPLOAD);
        this.media_id = media_id;
    }
}