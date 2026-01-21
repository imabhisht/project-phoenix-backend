import { Prop } from "@nestjs/mongoose";
import { BaseConversationData } from "../baseData";
import { ConversationTypeEnum } from "@modules/conversation/domain/enums/conversation_types";
import { ChatModeEnum } from "@modules/conversation/domain/enums/chat_mode";

export class ChatConversationData extends BaseConversationData {
    @Prop({ required: true, type: String, enum: Object.values(ChatModeEnum) })
    mode: ChatModeEnum;

    @Prop({ type: String, default: null })
    system_prompt: string | null;

    @Prop({ type: String, default: null })
    default_model: string | null;

    @Prop({ type: Number, default: null })
    temperature: number | null;

    @Prop({ type: Number, default: null })
    max_context_tokens: number | null;

    constructor() {
        super(ConversationTypeEnum.CHAT);
    }
}
