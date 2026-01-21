import { MessageDataTypeEnum } from "@modules/message/domain/enums/message_data.enum";

export abstract class BaseMessageData {
    type: MessageDataTypeEnum;

    constructor(type: MessageDataTypeEnum) {
        this.type = type;
    }
}