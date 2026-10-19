import { IMessage } from './IMessage';
export declare class Message implements IMessage {
    id: string;
    chat_jid: string;
    sender_jid: string;
    content: string | null;
    timestamp: string;
    is_from_me: boolean;
    media_type: string;
    filename: string;
    url: string;
    file_length: number;
    created_at: string;
    updated_at: string;
    replied_to_message_id?: string | undefined;
    quoted_message_text?: string | undefined;
    sender_display_name?: string | undefined;
    /**
     * Creates an instance of Message.
     * @param id Unique identifier for the message.
     * @param chat_jid JID of the chat.
     * @param sender_jid JID of the sender.
     * @param content Text content of the message.
     * @param timestamp Message timestamp.
     * @param is_from_me Whether the message was sent by me.
     * @param media_type Type of media if applicable.
     * @param filename Filename if applicable.
     * @param url URL if applicable.
     * @param file_length Length of the file if applicable.
     * @param created_at Creation timestamp.
     * @param updated_at Last update timestamp.
   * @param replied_to_message_id Optional ID of the message being replied to.
   * @param quoted_message_text Optional text of the quoted message.
   * @param sender_display_name Optional resolved sender display name (gateway v9.0.1+).
   */
    constructor(id: string, chat_jid: string, sender_jid: string, content: string | null, timestamp: string, is_from_me: boolean, media_type: string, filename: string, url: string, file_length: number, created_at: string, updated_at: string, replied_to_message_id?: string | undefined, quoted_message_text?: string | undefined, sender_display_name?: string | undefined);
}
