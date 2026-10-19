import { IChat } from './IChat';
export declare class Chat implements IChat {
    jid: string;
    name: string;
    last_message_time: Date | null;
    ephemeral_expiration: number;
    is_group: boolean;
    created_at: Date;
    updated_at: Date;
    constructor(jid: string, name: string, last_message_time: Date | null, ephemeral_expiration: number, is_group: boolean, created_at: Date, updated_at: Date);
}
