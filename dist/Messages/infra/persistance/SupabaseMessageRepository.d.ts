import { SupabaseClient } from "@supabase/supabase-js";
import { IMessage } from "../../domain/IMessage";
import { IMessageRepository } from "../../domain/IMessageRepository";
import { IMessageWithSender } from "../../domain/IMessageWithSender";
import { IMessagesReport } from "../../domain/IMessagesReport";
/**
 * Repository implementation for managing messages using Supabase.
 */
export declare class SupabaseMessageRepository implements IMessageRepository {
    private _supabase;
    /**
     * Initializes a new instance of the SupabaseMessageRepository.
     * @param supabase Supabase client instance.
     */
    constructor(supabase: SupabaseClient);
    /**
     * Gets the Supabase client instance.
     */
    get supabase(): SupabaseClient;
    /**
     * Maps database message data to a Message domain object.
     * @param data The raw message data from the database.
     * @returns A Message domain object.
     * @private
     */
    private mapToMessage;
    /**
     * Finds a message by its ID.
     * @param id The message ID.
     * @returns A promise that resolves to the message if found, or null otherwise.
     */
    findById(id: string): Promise<IMessage | null>;
    /**
     * Saves a message to the database (updates if ID exists, inserts otherwise).
     * @param message The message data to save.
     * @returns A promise that resolves to the saved message.
     */
    save(message: Partial<IMessage>): Promise<IMessage>;
    /**
     * Lists messages with pagination.
     * @param offset The number of records to skip.
     * @param limit The maximum number of records to return.
     * @returns A promise that resolves to an array of messages.
     */
    list(offset: number, limit: number): Promise<IMessage[]>;
    /**
     * Lists messages with their senders. Not implemented for Supabase yet.
     * @param offset The number of records to skip.
     * @param limit The maximum number of records to return.
     */
    listWithSender(offset: number, limit: number): Promise<IMessageWithSender[]>;
    /**
     * Finds messages by chat ID with pagination.
     * @param chat_id The chat ID.
     * @param offset The number of records to skip.
     * @param limit The maximum number of records to return.
     * @returns A promise that resolves to an array of messages.
     */
    findByChatId(chat_id: string, offset: number, limit: number): Promise<IMessage[]>;
    /**
     * Finds messages by chat ID with their senders. Not implemented for Supabase yet.
     * @param chat_id The chat ID.
     * @param offset The number of records to skip.
     * @param limit The maximum number of records to return.
     */
    findByChatIdWithSender(chat_id: string, offset: number, limit: number): Promise<IMessageWithSender[]>;
    /**
     * Counts the total number of messages.
     * @returns A promise that resolves to the total count.
     */
    count(): Promise<number>;
    /**
     * Reports message counts per day. Not implemented for Supabase yet.
     * @param interval The number of days to look back.
     */
    getMessageCountPerDay(interval: number): Promise<IMessagesReport[]>;
    /**
     * Gets the last message for a specific chat.
     * @param chat_id The chat ID.
     * @returns A promise that resolves to the last message if found, or null otherwise.
     */
    getLastContactMessage(chat_id: number): Promise<IMessage | null>;
    getLastContactMessageByPhone(phone_number: string): Promise<IMessage | null>;
    getLastContactMessageByLid(lid: string): Promise<IMessage | null>;
}
