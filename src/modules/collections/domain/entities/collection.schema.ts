import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';
import { CollectionAIConfig } from './colletion_ai_config';

@Schema({ collection: 'collections' })
export class Collection extends IdentifiableEntity {
    @Prop({ required: true, type: String })
    org_id: string;

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ type: String, default: null })
    description: string | null;

    @Prop({ required: true, type: String })
    user_id: string;

    @Prop({ required: false, type: CollectionAIConfig, default: null })
    ai_config: CollectionAIConfig | null = null;

    @Prop({ type: Boolean, default: false })
    is_deleted: boolean;

    @Prop({ type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ type: Date, default: () => new Date() })
    updated_at: Date;

    constructor(partial: Partial<Collection>) {
        super();
        Object.assign(this, partial);
    }
}

export type CollectionDocument = Collection & Document;
export const CollectionSchema = SchemaFactory.createForClass(Collection);