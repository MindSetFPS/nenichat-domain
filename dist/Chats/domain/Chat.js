"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
class Chat {
    constructor(jid, name, last_message_time, ephemeral_expiration, is_group, created_at, updated_at) {
        this.jid = jid;
        this.name = name;
        this.last_message_time = last_message_time;
        this.ephemeral_expiration = ephemeral_expiration;
        this.is_group = is_group;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
exports.Chat = Chat;
