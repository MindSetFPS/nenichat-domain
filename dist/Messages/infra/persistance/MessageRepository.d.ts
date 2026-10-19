import { Pool } from 'pg';
import { IMessage } from '../../domain/IMessage';
import { IMessageRepository } from '../../domain/IMessageRepository';
import { IMessageWithSender } from '../../domain/IMessageWithSender';
import { IMessagesReport } from '../../domain/IMessagesReport';
export declare class MessageRepository implements IMessageRepository {
    private pool;
    constructor(pool: Pool);
    private toMessage;
    findById(id: string): Promise<IMessage | null>;
    save(message: Partial<IMessage>): Promise<IMessage>;
    list(offset: number, limit: number): Promise<IMessage[]>;
    listWithSender(offset: number, limit: number): Promise<IMessageWithSender[]>;
    findByChatId(chat_id: string, offset: number, limit: number): Promise<IMessage[]>;
    findByChatIdWithSender(chat_id: string, offset: number, limit: number): Promise<IMessageWithSender[]>;
    count(): Promise<number>;
    getMessageCountPerDay(interval: number): Promise<IMessagesReport[]>;
    /**
     * A function that searches for the last message sent by the contact
     * @param chat_id
     * @returns IMessage
     */
    getLastContactMessage(chat_id: number): Promise<IMessage | null>;
    getLastContactMessageByPhone(phone_number: string): Promise<IMessage | null>;
    getLastContactMessageByLid(lid: string): Promise<IMessage | null>;
}
export declare const messageRepository: MessageRepository;
