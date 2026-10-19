import { Pool } from 'pg';
import { IChat } from '../../domain/IChat';
import { IChatRepository } from '../../domain/IChatRepository';
export declare class ChatRepository implements IChatRepository {
    private pool;
    constructor(pool: Pool);
    private toChat;
    findById(id: string): Promise<IChat | null>;
    save(chat: Partial<IChat>): Promise<IChat>;
    list(offset: number, limit: number): Promise<IChat[]>;
    checkPhone(phone: string): Promise<boolean>;
}
export declare const chatRepository: ChatRepository;
