"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
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
    constructor(id, chat_jid, sender_jid, content, timestamp, is_from_me, media_type, filename, url, file_length, created_at, updated_at, replied_to_message_id, quoted_message_text, sender_display_name) {
        this.id = id;
        this.chat_jid = chat_jid;
        this.sender_jid = sender_jid;
        this.content = content;
        this.timestamp = timestamp;
        this.is_from_me = is_from_me;
        this.media_type = media_type;
        this.filename = filename;
        this.url = url;
        this.file_length = file_length;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.replied_to_message_id = replied_to_message_id;
        this.quoted_message_text = quoted_message_text;
        this.sender_display_name = sender_display_name;
    }
}
exports.Message = Message;
