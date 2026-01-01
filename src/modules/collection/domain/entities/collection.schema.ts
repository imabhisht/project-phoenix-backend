import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';

@Schema({ collection: 'collection' })
export class Collection extends IdentifiableEntity {
    @Prop({ required: true, type: String })
    org_id: string;

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ type: String, default: null })
    description: string | null;

    @Prop({ required: true, type: String })
    user_id: string;

    @Prop({ type: Boolean, default: false })
    is_deleted: boolean;

    @Prop({ type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ type: Date, default: () => new Date() })
    updated_at: Date;
}

export type CollectionDocument = Collection & Document;
export const CollectionSchema = SchemaFactory.createForClass(Collection);