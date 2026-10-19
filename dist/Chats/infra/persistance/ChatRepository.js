"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRepository = exports.ChatRepository = void 0;
const Chat_1 = require("../../domain/Chat");
const db_1 = require("../../../Shared/infra/persistance/db");
class ChatRepository {
    constructor(pool) {
        this.pool = pool;
    }
    toChat(data) {
        if (!data)
            return data;
        return new Chat_1.Chat(data.id, data.name || 'Unknown', data.last_message_time ?? null, data.ephemeral_expiration || 0, data.is_group, data.created_at || new Date(), data.updated_at || new Date());
    }
    async findById(id) {
        const result = await this.pool.query('SELECT * FROM chats WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.toChat(result.rows[0]);
    }
    async save(chat) {
        const { jid, is_group } = chat;
        if (!jid) {
            throw new Error('Chat JID must be provided to save a chat.');
        }
        const existingChat = await this.findById(jid);
        if (existingChat) {
            // Update existing chat
            const chatToUpdate = { ...existingChat, ...chat };
            const result = await this.pool.query(`
        UPDATE chats
        SET
          is_group = $1
        WHERE id = $2
        RETURNING *
      `, [chatToUpdate.is_group, existingChat.jid]);
            if (!result || result.rows.length === 0) {
                throw new Error('Failed to save chat.');
            }
            return this.toChat(result.rows[0]);
        }
        else {
            // Insert new chat
            const result = await this.pool.query(`
        INSERT INTO chats (id, is_group)
        VALUES ($1, $2)
        RETURNING *
      `, [jid, is_group || false]);
            if (!result || result.rows.length === 0) {
                throw new Error('Failed to save chat.');
            }
            return this.toChat(result.rows[0]);
        }
    }
    async list(offset, limit) {
        const result = await this.pool.query('SELECT * FROM chats ORDER BY created_at DESC, id DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows.map((d) => this.toChat(d));
    }
    checkPhone(phone) {
        throw new Error('Method not implemented.');
    }
}
exports.ChatRepository = ChatRepository;
exports.chatRepository = new ChatRepository(db_1.pool);
