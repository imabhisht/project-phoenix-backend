import { ConversationTypeEnum } from "../../enums/conversation_types";

export abstract class BaseConversationData {
    type: ConversationTypeEnum;

    constructor(type: ConversationTypeEnum) {
        this.type = type;
    }
}
