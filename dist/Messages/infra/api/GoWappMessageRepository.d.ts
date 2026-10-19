import { IMessage } from '../../domain/IMessage';
import { IMessageRepository } from '../../domain/IMessageRepository';
import { IMessagesReport } from '../../domain/IMessagesReport';
import { IMessageWithSender } from '../../domain/IMessageWithSender';
import { WappConfig } from '../../../Wapp';
/**
 * Implementation of IMessageRepository using Go-Whatsapp-Web-Multidevice API.
 * This repository interacts with an external WhatsApp gateway to send and retrieve messages.
 *
 * @see https://github.com/aldinokemal/go-whatsapp-web-multidevice
 */
export declare class GoWappMessageRepository implements IMessageRepository {
    private wapp;
    private deviceId?;
    /**
     * Creates an instance of GoWappMessageRepository.
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
     * Helper to map an integer chat_id to a JID.
     * Assumes individual chat if not specified.
     * @param {number} id - The numeric ID.
     * @param {boolean} [isGroup=false] - Whether it is a group JID.
     * @returns {string} The formatted JID.
     * @private
     */
    private integerToJid;
    /**
     * Maps partial API ChatMessage to IMessage domain object.
     * @param {any} apiMsg - The message object from the API.
     * @returns {IMessage} The mapped domain message.
     * @private
     */
    private mapToDomain;
    /**
     * Finds a message by its unique ID.
     * Note: This is not explicitly supported by the GoWapp API without chat context.
     * @param {string} id - The message ID.
     * @returns {Promise<IMessage | null>} The message or null if not found.
     */
    findById(id: string): Promise<IMessage | null>;
    /**
     * Saves (sends) a message.
     * @param {Partial<IMessage>} message - The message data to save/send.
     * @returns {Promise<IMessage>} The created message.
     * @throws {Error} if chat_id is missing or sending fails.
     */
    save(message: Partial<IMessage>): Promise<IMessage>;
    /**
     * Lists messages with pagination.
     * Note: Global list is not supported by GoWapp API.
     * @param {number} offset - The number of records to skip.
     * @param {number} limit - The maximum number of records to return.
     * @returns {Promise<IMessage[]>} An empty array or list of messages.
     */
    list(offset: number, limit: number): Promise<IMessage[]>;
    /**
     * Lists messages including sender information.
     * @param {number} offset - The number of records to skip.
     * @param {number} limit - The maximum number of records to return.
     * @returns {Promise<IMessageWithSender[]>} An empty array.
     */
    listWithSender(offset: number, limit: number): Promise<IMessageWithSender[]>;
    /**
     * Finds messages in a specific chat.
     * @param {string} chat_id - The chat JID or phone number.
     * @param {number} offset - The number of records to skip.
     * @param {number} limit - The maximum number of records to return.
     * @returns {Promise<IMessage[]>} List of messages in the chat.
     */
    findByChatId(chat_id: string, offset: number, limit: number): Promise<IMessage[]>;
    /**
     * Finds messages in a specific chat including sender information.
     * @param {string} chat_id - The chat JID or phone number.
     * @param {number} offset - The number of records to skip.
     * @param {number} limit - The maximum number of records to return.
     * @returns {Promise<IMessageWithSender[]>} List of messages with sender data.
     */
    findByChatIdWithSender(chat_id: string, offset: number, limit: number): Promise<IMessageWithSender[]>;
    /**
     * Returns the total count of messages.
     * @returns {Promise<number>} Always returns 0 as not supported.
     */
    count(): Promise<number>;
    /**
     * Returns a report of message counts per day.
     * @param {number} interval - The interval in days.
     * @returns {Promise<IMessagesReport[]>} An empty array.
     */
    getMessageCountPerDay(interval: number): Promise<IMessagesReport[]>;
    /**
     * Retrieves the last message sent in a specific chat.
     * @param {number} chat_id - The chat ID.
     * @returns {Promise<IMessage | null>} The last message or null.
     */
    getLastContactMessage(chat_id: number): Promise<IMessage | null>;
    /**
     * Retrieves the last message sent by phone number.
     * @param {string} phone_number - The phone number or JID.
     * @returns {Promise<IMessage | null>} The last message or null.
     */
    getLastContactMessageByPhone(phone_number: string): Promise<IMessage | null>;
    /**
     * Retrieves the last message sent by LID.
     * @param {string} lid - The LID.
     * @returns {Promise<IMessage | null>} The last message or null.
     */
    getLastContactMessageByLid(lid: string): Promise<IMessage | null>;
}
