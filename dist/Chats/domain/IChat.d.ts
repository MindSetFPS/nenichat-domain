import { IMessage } from "../../Messages/domain/IMessage";
interface IChat {
    /**********************************************************************************/
    jid: string;
    /**********************************************************************************/
    name: string;
    /** Null when the gateway has no recorded message for this chat yet. */
    last_message_time: Date | null;
    ephemeral_expiration: number;
    is_group: boolean;
    created_at: Date;
    updated_at: Date;
}
interface GoWappChatResponse {
    chat_info: IChat;
    pagination: {
        offset: number;
        limit: number;
        total: number;
    };
    data: IMessage[];
}
export type { IChat, GoWappChatResponse };
