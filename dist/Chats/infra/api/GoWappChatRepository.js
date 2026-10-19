"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoWappChatRepository = void 0;
const Jid_1 = require("../../domain/Jid");
const Chat_1 = require("../../domain/Chat");
const Wapp_1 = require("../../../Wapp");
const parse_gateway_date_1 = require("../../../Shared/app/parse-gateway-date");
/**
 * Implementation of IChatRepository using Go-Whatsapp-Web-Multidevice API.
 * This repository interacts with an external WhatsApp gateway to manage chats.
 *
 * @see https://github.com/aldinokemal/go-whatsapp-web-multidevice
 */
class GoWappChatRepository {
    /**
     * Creates an instance of GoWappChatRepository.
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
     * Maps an API Chat object to a domain Chat object.
     * @param {any} apiChat - The chat object from the API.
     * @returns {IChat} The mapped domain chat.
     * @private
     */
    mapToDomain(apiChat) {
        const isGroup = apiChat.jid ? (0, Jid_1.getJidKind)(apiChat.jid) === 'group' : false;
        return new Chat_1.Chat(apiChat.jid || '', apiChat.name || apiChat.jid || 'Unknown', (0, parse_gateway_date_1.parseGatewayDate)(apiChat.last_message_time), apiChat.ephemeral_expiration || 0, isGroup, (0, parse_gateway_date_1.parseGatewayDate)(apiChat.created_at) ?? new Date(), (0, parse_gateway_date_1.parseGatewayDate)(apiChat.updated_at) ?? new Date());
    }
    /**
     * Finds a chat by its ID.
     * Note: This implementation searches through the recent chat list.
     * @param {string} id - The chat ID.
     * @returns {Promise<IChat | null>} The chat or null if not found.
     */
    async findById(id) {
        // Since there isn't a direct "get chat by ID" endpoint that works for both users and groups
        // in the same way, we search the chat list. We use a generous limit for the initial search.
        const response = await this.wapp.request(this.scopedPath('/chats?limit=100&offset=0'));
        if (response.code === 'SUCCESS' && response.results?.data) {
            const found = response.results.data.find((c) => c.jid === id);
            if (found) {
                // Determine group status from JID if available
                return this.mapToDomain(found);
            }
        }
        return null;
    }
    /**
     * Checks if a phone number/JID exists on WhatsApp.
     * @param {string} jid - The JID to check.
     * @returns {Promise<boolean>} True if it exists on WhatsApp.
     */
    async checkPhone(jid) {
        try {
            const phone = jid.split('@')[0];
            const response = await this.wapp.request(this.scopedPath(`/user/check?phone=${phone}`));
            return response.code === 'SUCCESS' && response.results?.is_on_whatsapp === true;
        }
        catch (e) {
            console.error(`Error checking phone ${jid}:`, e);
            return false;
        }
    }
    async getDevices() {
        const response = await this.wapp.request(this.scopedPath('/devices'));
        if (response.code === 'SUCCESS' && response.results?.data) {
            return response.results.data;
        }
        return [];
    }
    /**
     * Saves or updates a chat.
     * Note: GoWapp API manages chats automatically; this method primarily
     * constructs a local representation.
     * @param {Partial<IChat>} chat - The chat data to save.
     * @returns {Promise<IChat>} The saved chat.
     * @throws {Error} if JID is missing.
     */
    async save(chat) {
        if (chat.jid === undefined) {
            throw new Error('Chat JID must be provided to save a chat.');
        }
        // Mutations like creating groups would use different endpoints.
        // For a general save, we return the constructed object.
        return new Chat_1.Chat(chat.jid, chat.name || 'Unknown', chat.last_message_time ?? null, chat.ephemeral_expiration || 0, chat.is_group || false, chat.created_at || new Date(), chat.updated_at || new Date());
    }
    /**
     * Lists most recent chats with pagination. Consider this a timeline of recent conversations.
     * @param {number} offset - The number of records to skip.
     * @param {number} limit - The maximum number of records to return.
     * @returns {Promise<IChat[]>} List of chats.
     */
    async list(offset, limit) {
        const response = await this.wapp.request(this.scopedPath(`/chats?limit=${limit}&offset=${offset}`));
        if (response.code !== 'SUCCESS') {
            return [];
        }
        const data = response.results?.data || [];
        return data.map((c) => this.mapToDomain(c));
    }
}
exports.GoWappChatRepository = GoWappChatRepository;
