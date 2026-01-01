import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';
import { CollectionSourceStatusEnum } from './enums/status';
import { BaseCollectionSourceData } from './data/baseData';

@Schema({ collection: 'collection_source' })
export class CollectionSource extends IdentifiableEntity {
    @Prop({ required: true, type: String, ref: 'Collection' })
    collection_id: string;

    @Prop({ required: true, type: BaseCollectionSourceData })
    data: BaseCollectionSourceData;

    @Prop({ required: true, type: CollectionSourceStatusEnum, default: CollectionSourceStatusEnum.NOT_STARTED })
    status: CollectionSourceStatusEnum;

    @Prop({ type: Date, default: null })
    last_synced_at: Date | null;

    @Prop({ type: Boolean, default: false })
    is_deleted: boolean;

    @Prop({ required: true, type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ required: true, type: Date, default: () => new Date() })
    updated_at: Date;
}

export type CollectionSourceDocument = CollectionSource & Document;
export const CollectionSourceSchema = SchemaFactory.createForClass(CollectionSource);