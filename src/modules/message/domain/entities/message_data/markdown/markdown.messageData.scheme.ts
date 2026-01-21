import { MessageDataTypeEnum } from "@modules/message/domain/enums/message_data.enum";
import { Prop, Schema } from "@nestjs/mongoose";
import { BaseMessageData } from "../baseData.scheme";

export class MarkdownMessageData extends BaseMessageData {
    @Prop({ type: String, default: null })
    content: string;

    constructor() {
        super(MessageDataTypeEnum.MARKDOWN);
        this.content = null;
    }
}