import { IChat } from '../../domain/IChat';
import { IChatRepository } from '../../domain/IChatRepository';
import { WappConfig } from '../../../Wapp';
/**
 * Implementation of IChatRepository using Go-Whatsapp-Web-Multidevice API.
 * This repository interacts with an external WhatsApp gateway to manage chats.
 *
 * @see https://github.com/aldinokemal/go-whatsapp-web-multidevice
 */
export declare class GoWappChatRepository implements IChatRepository {
    private wapp;
    private deviceId?;
    /**
     * Creates an instance of GoWappChatRepository.
     * Base URL and Basic auth credentials default to the NEXT_PUBLIC_GOWAPP_HOST_URL
     * and GOWAPP_USER / GOWAPP_PASSWORD environment variables.
     */
    constructor(config?: WappConfig);
    /**
     * Scopes a GoWapp endpoint to this business's Traefik route
     * (/api/user/{deviceId}), which is how requests reach the right container.
     */
    private scopedPath;
    /**
     * Maps an API Chat object to a domain Chat object.
     * @param {any} apiChat - The chat object from the API.
     * @returns {IChat} The mapped domain chat.
     * @private
     */
    private mapToDomain;
    /**
     * Finds a chat by its ID.
     * Note: This implementation searches through the recent chat list.
     * @param {string} id - The chat ID.
     * @returns {Promise<IChat | null>} The chat or null if not found.
     */
    findById(id: string): Promise<IChat | null>;
    /**
     * Checks if a phone number/JID exists on WhatsApp.
     * @param {string} jid - The JID to check.
     * @returns {Promise<boolean>} True if it exists on WhatsApp.
     */
    checkPhone(jid: string): Promise<boolean>;
    getDevices(): Promise<Record<string, unknown>[]>;
    /**
     * Saves or updates a chat.
     * Note: GoWapp API manages chats automatically; this method primarily
     * constructs a local representation.
     * @param {Partial<IChat>} chat - The chat data to save.
     * @returns {Promise<IChat>} The saved chat.
     * @throws {Error} if JID is missing.
     */
    save(chat: Partial<IChat>): Promise<IChat>;
    /**
     * Lists most recent chats with pagination. Consider this a timeline of recent conversations.
     * @param {number} offset - The number of records to skip.
     * @param {number} limit - The maximum number of records to return.
     * @returns {Promise<IChat[]>} List of chats.
     */
    list(offset: number, limit: number): Promise<IChat[]>;
}
