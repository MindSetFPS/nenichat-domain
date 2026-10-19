"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOneOrder = generateOneOrder;
const models_1 = require("../../Shared/infra/llm/models");
const client_1 = require("../../Shared/infra/llm/client");
const generate_structured_1 = require("../../Shared/infra/llm/generate-structured");
const product_order_1 = require("../../Orders/app/dto/product-order");
const chat_to_llm_history_1 = require("./chat-to-llm-history");
async function generateOneOrder(messages, modelName = models_1.DEFAULT_MODEL) {
    const llmMessages = [
        ...(0, chat_to_llm_history_1.chatToLlmHistory)(messages),
        { role: 'user', content: 'Extract the product orders from the conversation above. Return ONLY a JSON object with an "orders" key containing an array of { productName, amount } objects. No explanations.' },
    ];
    try {
        const { data, promptTokens, completionTokens } = await (0, generate_structured_1.generateStructured)(client_1.llm, product_order_1.ProductOrderListSchema, llmMessages, modelName);
        if (!data.orders || data.orders.length === 0)
            return { suggestion: null, promptTokens, completionTokens };
        return {
            suggestion: {
                action: "open_form",
                label: data.orders.map(o => `${o.amount}x ${o.productName}`).join(', '),
                formType: "order",
                data: { orders: data.orders },
            },
            promptTokens,
            completionTokens,
        };
    }
    catch (e) {
        console.error('Failed to generate order suggestion:', e);
        return { suggestion: null, promptTokens: 0, completionTokens: 0 };
    }
}
