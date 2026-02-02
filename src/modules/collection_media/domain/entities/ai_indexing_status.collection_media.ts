import { Prop } from "@nestjs/mongoose";
import { IdentifiableEntity } from "@shared/scheme/IdentifiableEntity.scheme";
import { CollectionMediaStatusEnum } from "../enums/collection_media_status.enum";

export class AIIndexingStatus {
    @Prop({ required: true, enum: CollectionMediaStatusEnum, default: CollectionMediaStatusEnum.NOT_STARTED })
    status: CollectionMediaStatusEnum = CollectionMediaStatusEnum.NOT_STARTED;

    @Prop({ type: Object, default: null })
    error: Record<any, any> | null = null;

    @Prop({ type: [Number], default: [] })
    vector_ids: number[] = [];

    @Prop({ type: Date, default: null})
    indexing_start_at: Date | null = null;

    @Prop({ type: Date, default: null })
    indexing_end_at: Date | null = null;

    @Prop({ type: Number, default: null })
    total_chunks: number | null = null;

    @Prop({ type: String, default: null })
    es_index_name: string | null = null;
    
    @Prop({ type: String, default: null })
    qdrant_collection_name: string | null = null;
}