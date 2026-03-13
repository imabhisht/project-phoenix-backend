import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';
import { Collection } from '@modules/collections/domain/entities/collection.schema';
import { CollectionSource } from '@modules/collection_source/domain/entities/collection_source.scheme';
import { BaseCollectionMediaData } from './data/baseData';
import { AIIndexingStatus } from './ai_indexing_status.collection_media';

@Schema({ collection: 'collection_media' })
export class CollectionMedia extends IdentifiableEntity {
    @Prop({ required: true, type: String, ref: Collection.name })
    collection_id: string;

    @Prop({ required: true, type: String, ref: CollectionSource.name })
    collection_source_id: string;

    @Prop({ required: true })
    data: BaseCollectionMediaData;

    @Prop({ required: true, type: AIIndexingStatus })
    ai_indexing_status: AIIndexingStatus;

    @Prop({ required: true })
    user_id: string;

    @Prop({ type: Boolean, default: false })
    is_deleted: boolean;

    @Prop({ type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ type: Date, default: () => new Date() })
    updated_at: Date;
}

export type CollectionMediaDocument = CollectionMedia & Document;
export const CollectionMediaSchema = SchemaFactory.createForClass(CollectionMedia);