"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateChat = void 0;
const ChatRepository_1 = require("../infra/persistance/ChatRepository");
const getOrCreateChat = async (contact) => {
    let chat = await ChatRepository_1.chatRepository.findById(contact.id.toString());
    const isGroup = contact.lid ? contact.lid.length >= 18 : false;
    // chat = await chatRepository.save({ id: contact.id!, is_group: isGroup });
    return chat;
};
exports.getOrCreateChat = getOrCreateChat;
