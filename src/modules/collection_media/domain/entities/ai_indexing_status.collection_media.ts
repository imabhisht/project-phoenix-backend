import { Prop } from "@nestjs/mongoose";
import { IdentifiableEntity } from "@shared/scheme/IdentifiableEntity.scheme";
import { CollectionMediaStatusEnum } from "../enums/collection_media_status.enum";

export class AIIndexingStatus {
    @Prop({ required: true, enum: CollectionMediaStatusEnum, default: CollectionMediaStatusEnum.NOT_STARTED })
    status: CollectionMediaStatusEnum;

    @Prop({ type: Object, default: null })
    error: Record<any, any> | null;

    @Prop({ type: [Number], default: [] })
    vector_ids: number[];

    @Prop({ type: Date, default: null})
    indexed_start_at: Date | null;

    @Prop({ type: Date, default: null })
    indexed_end_at: Date | null;

    @Prop({ type: Number, default: null })
    total_chunks: number | null;

    @Prop({ type: String, default: null })
    es_index_name: string | null;
    
    @Prop({ type: String, default: null })
    qdrant_collection_name: string | null;
}