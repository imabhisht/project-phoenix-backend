import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';

export class CollectionAIConfig {
    @Prop({ required: false, type: String , default: null})
    embedding_model: string | null = null;

    @Prop({ required: false, type: Object, default: null })
    embedding_dimensions: number | null = null;

    @Prop({ required: false, type: Object, default: null })
    rerank_model: string | null = null;
}