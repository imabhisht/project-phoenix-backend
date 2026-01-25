import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Collection, Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';
import { FileTypeEnum } from '../enums/fileTypes.enum';

export enum MediaBucketType {
    AWS_S3 = 'aws_s3',
    FIREBASE_STORAGE = 'firebase_storage'
}

@Schema({ collection: 'media' })
export class Media extends IdentifiableEntity {
    @Prop({ required: true, type: String })
    org_id: string;

    @Prop({ required: true, type: String, enum: Object.values(MediaBucketType) })
    bucket_type: MediaBucketType;

    @Prop({ required: true, type: String })
    file_key: string;

    @Prop({ required: true, type: String })
    file_name: string;

    @Prop({ required: true, type: String, enum: Object.values(FileTypeEnum) })
    file_type: FileTypeEnum;

    @Prop({ required: true, type: Number })
    file_size: number;

    @Prop({ type: Boolean, default: false })
    is_deleted: boolean;

    @Prop({ type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ type: Date, default: () => new Date() })
    updated_at: Date;
}

export type MediaDocument = Media & Document;
export const MediaSchema = SchemaFactory.createForClass(Media);