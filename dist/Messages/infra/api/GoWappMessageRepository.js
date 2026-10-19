"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoWappMessageRepository = void 0;
const Message_1 = require("../../domain/Message");
const Wapp_1 = require("../../../Wapp");
const parse_gateway_date_1 = require("../../../Shared/app/parse-gateway-date");
/**
 * Implementation of IMessageRepository using Go-Whatsapp-Web-Multidevice API.
 * This repository interacts with an external WhatsApp gateway to send and retrieve messages.
 *
 * @see https://github.com/aldinokemal/go-whatsapp-web-multidevice
 */
class GoWappMessageRepository {
    /**
     * Creates an instance of GoWappMessageRepository.
     * Base URL and Basic auth credentials default to the NEXT_PUBLIC_GOWAPP_HOST_URL
     * and GOWAPP_USER / GOWAPP_PASSWORD environment variables.
     */
    constructor(config = {}) {
        this.wapp = new Wapp_1.Wapp(config);
        this.deviceId = config.deviceId !== undefined ? String(config.deviceId) : undefined;
    }
    /**
     * Scopes a GoWapp endpoint to this business's Traefik route
     * (/api/user/{deviceId}), which is how requests reach the right container.
     */
    scopedPath(path) {
        return this.deviceId ? `/api/user/${this.deviceId}${path}` : path;
    }
    /**
     * Helper to map an integer chat_id to a JID.
     * Assumes individual chat if not specified.
     * @param {number} id - The numeric ID.
     * @param {boolean} [isGroup=false] - Whether it is a group JID.
     * @returns {string} The formatted JID.
     * @private
     */
    integerToJid(id, isGroup = false) {
        const suffix = isGroup ? '@g.us' : '@s.whatsapp.net';
        return `${id}${suffix}`;
    }
    /**
     * Maps partial API ChatMessage to IMessage domain object.
     * @param {any} apiMsg - The message object from the API.
     * @returns {IMessage} The mapped domain message.
     * @private
     */
    mapToDomain(apiMsg) {
        const rawUrl = apiMsg.url || '';
        const mediaUrl = this.deviceId ? (0, Wapp_1.normalizeGatewayUrl)(rawUrl, this.deviceId) : rawUrl;
        const sentAt = ((0, parse_gateway_date_1.parseGatewayDate)(apiMsg.timestamp) ??
            (0, parse_gateway_date_1.parseGatewayDate)(apiMsg.created_at) ??
            new Date()).toISOString();
        const updatedAt = (0, parse_gateway_date_1.parseGatewayDate)(apiMsg.updated_at)?.toISOString() ?? sentAt;
        return new Message_1.Message(apiMsg.id ?? '', apiMsg.chat_jid || apiMsg.phone || '', apiMsg.sender_jid || '', apiMsg.content || apiMsg.message || null, sentAt, apiMsg.is_from_me || false, apiMsg.media_type || '', apiMsg.filename || '', mediaUrl, apiMsg.file_length || 0, sentAt, updatedAt, undefined, undefined, apiMsg.sender_display_name);
    }
    /**
     * Finds a message by its unique ID.
     * Note: This is not explicitly supported by the GoWapp API without chat context.
     * @param {string} id - The message ID.
     * @returns {Promise<IMessage | null>} The message or null if not found.
     */
    async findById(id) {
        // API doesn't support global search by message ID.
        return null;
    }
    /**
     * Saves (sends) a message.
     * @param {Partial<IMessage>} message - The message data to save/send.
     * @returns {Promise<IMessage>} The created message.
     * @throws {Error} if chat_id is missing or sending fails.
     */
    async save(message) {
        if (!message.chat_jid) {
            throw new Error('chat_jid is required to send a message');
        }
        const jid = message.chat_jid.includes('@') ? message.chat_jid : this.integerToJid(Number(message.chat_jid));
        const payload = {
            phone: jid,
            message: message.content || '',
            reply_message_id: message.replied_to_message_id,
        };
        const response = await this.wapp.request(this.scopedPath('/send/message'), {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        if (response.code !== 'SUCCESS') {
            throw new Error(`Failed to send message: ${response.message}`);
        }
        const now = new Date().toISOString();
        return new Message_1.Message(response.results.message_id, message.chat_jid, message.sender_jid || '0', message.content || null, now, true, '', '', '', 0, now, now, message.replied_to_message_id, message.quoted_message_text);
    }
    /**
     * Lists messages with pagination.
     * Note: Global list is not supported by GoWapp API.
     * @param {number} offset - The number of records to skip.
     * @param {number} limit - The maximum number of records to return.
     * @returns {Promise<IMessage[]>} An empty array or list of messages.
     */
    async list(offset, limit) {
        return [];
    }
    /**
     * Lists messages including sender information.
     * @param {number} offset - The number of records to skip.
     * @param {number} limit - The maximum number of records to return.
     * @returns {Promise<IMessageWithSender[]>} An empty array.
     */
    async listWithSender(offset, limit) {
        const messages = await this.list(offset, limit);
        return messages.map(m => ({ ...m, sender: undefined }));
    }
    /**
     * Finds messages in a specific chat.
     * @param {string} chat_id - The chat JID or phone number.
     * @param {number} offset - The number of records to skip.
     * @param {number} limit - The maximum number of records to return.
     * @returns {Promise<IMessage[]>} List of messages in the chat.
     */
    async findByChatId(chat_id, offset, limit) {
        const response = await this.wapp.request(this.scopedPath(`/chat/${chat_id}/messages?limit=${limit}&offset=${offset}`));
        if (response.code !== 'SUCCESS') {
            return [];
        }
        const data = response.results?.data || [];
        return data.map((m) => this.mapToDomain(m));
    }
    /**
     * Finds messages in a specific chat including sender information.
     * @param {string} chat_id - The chat JID or phone number.
     * @param {number} offset - The number of records to skip.
     * @param {number} limit - The maximum number of records to return.
     * @returns {Promise<IMessageWithSender[]>} List of messages with sender data.
     */
    async findByChatIdWithSender(chat_id, offset, limit) {
        const messages = await this.findByChatId(chat_id, offset, limit);
        return messages.map(m => ({ ...m, sender: undefined }));
    }
    /**
     * Returns the total count of messages.
     * @returns {Promise<number>} Always returns 0 as not supported.
     */
    async count() {
        return 0;
    }
    /**
     * Returns a report of message counts per day.
     * @param {number} interval - The interval in days.
     * @returns {Promise<IMessagesReport[]>} An empty array.
     */
    async getMessageCountPerDay(interval) {
        return [];
    }
    /**
     * Retrieves the last message sent in a specific chat.
     * @param {number} chat_id - The chat ID.
     * @returns {Promise<IMessage | null>} The last message or null.
     */
    async getLastContactMessage(chat_id) {
        // The GoWapp API does not support querying by internal database ID.
        // It only supports phone numbers (JIDs) or LIDs.
        return null;
    }
    /**
     * Retrieves the last message sent by phone number.
     * @param {string} phone_number - The phone number or JID.
     * @returns {Promise<IMessage | null>} The last message or null.
     */
    async getLastContactMessageByPhone(phone_number) {
        try {
            const jid = phone_number.includes('@') ? phone_number : `${phone_number}@s.whatsapp.net`;
            const messages = await this.findByChatId(jid, 0, 1);
            return messages.length > 0 ? messages[0] : null;
        }
        catch {
            return null;
        }
    }
    /**
     * Retrieves the last message sent by LID.
     * @param {string} lid - The LID.
     * @returns {Promise<IMessage | null>} The last message or null.
     */
    async getLastContactMessageByLid(lid) {
        try {
            const jid = lid.includes('@') ? lid : `${lid}@lid`;
            const messages = await this.findByChatId(jid, 0, 1);
            return messages.length > 0 ? messages[0] : null;
        }
        catch {
            return null;
        }
    }
}
exports.GoWappMessageRepository = GoWappMessageRepository;
