import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';
import { MessageRoleEnum } from '../enums/message_role.enum';
import { BaseMessageData } from './message_data/baseData.scheme';
import { MessageTokens } from './messageTokens.scheme';

@Schema({ collection: 'message' })
export class Message extends IdentifiableEntity {
    @Prop({ required: true, type: String })
    conversation_id: string;

    @Prop({ type: String, default: null })
    parent_message_id: string | null;

    @Prop({ required: true, type: String, enum: Object.values(MessageRoleEnum) })
    role: MessageRoleEnum;

    @Prop({ required: true, type: [BaseMessageData], default: [] })
    message_data: BaseMessageData[] = [];
    
    @Prop({ type: String, default: null })
    model: string | null;

    @Prop({ type: MessageTokens, default: null })
    tokens: MessageTokens | null = null;

    @Prop({ type: String, default: null })
    run_id: string | null;

    @Prop({ type: Number, default: null })
    sequence: number | null;

    @Prop({ type: Object, default: null })
    metadata: Record<string, any> | null;

    @Prop({ required: true, type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ required: true, type: Date, default: () => new Date() })
    updated_at: Date;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
