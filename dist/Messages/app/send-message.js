"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SendMessage;
const api_1 = require("../infra/api");
async function SendMessage(phone, messageTextContent, businessId) {
    const wappRepo = new api_1.GoWappMessageRepository({ deviceId: String(businessId) });
    return wappRepo.save({
        chat_jid: phone,
        content: messageTextContent,
    });
}
