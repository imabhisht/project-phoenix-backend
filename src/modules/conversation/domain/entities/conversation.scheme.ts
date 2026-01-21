import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';
import { ConversationStatusEnum } from '../enums/status';
import { ConversationVisibilityEnum } from '../enums/visibility';
import { BaseConversationData } from './conversation_data/baseData';

@Schema({ collection: 'conversations' })
export class Conversation extends IdentifiableEntity {
    @Prop({ required: true, type: BaseConversationData })
    conversation_data: BaseConversationData;

    @Prop({ required: true, type: String, default: '' })
    title: string;

    @Prop({ type: String, default: null })
    description: string | null;

    @Prop({ required: true, type: String })
    user_id: string;

    @Prop({ type: String, default: null })
    project_id: string | null;

    @Prop({ required: true, type: String, enum: Object.values(ConversationStatusEnum), default: ConversationStatusEnum.ACTIVE })
    status: ConversationStatusEnum;

    @Prop({ required: true, type: String, enum: Object.values(ConversationVisibilityEnum), default: ConversationVisibilityEnum.PRIVATE })
    visibility: ConversationVisibilityEnum;

    @Prop({ type: Object, default: null })
    metadata: Record<string, any> | null;

    @Prop({ required: true, type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ required: true, type: Date, default: () => new Date() })
    updated_at: Date;
}

export type ConversationDocument = Conversation & Document;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
