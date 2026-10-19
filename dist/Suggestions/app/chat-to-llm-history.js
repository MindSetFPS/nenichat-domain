"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatToLlmHistory = chatToLlmHistory;
function chatToLlmHistory(messages) {
    return [...messages].map(m => ({
        role: m.sender_jid !== m.chat_jid ? 'assistant' : 'user',
        content: m.content || '',
    }));
}
