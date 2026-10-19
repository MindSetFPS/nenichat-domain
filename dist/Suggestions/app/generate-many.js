"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateManySuggestions = generateManySuggestions;
const models_1 = require("../../Shared/infra/llm/models");
const client_1 = require("../../Shared/infra/llm/client");
const generate_structured_1 = require("../../Shared/infra/llm/generate-structured");
const product_order_1 = require("../../Orders/app/dto/product-order");
const suggestion_prompt_1 = require("../domain/suggestion-prompt");
const llm_schemas_1 = require("../domain/llm-schemas");
const chat_to_llm_history_1 = require("./chat-to-llm-history");
async function extractProductOrders(messages, modelName = models_1.DEFAULT_MODEL) {
    const llmMessages = [
        ...(0, chat_to_llm_history_1.chatToLlmHistory)(messages),
        { role: 'user', content: 'Extract the product orders from the conversation above. Return ONLY a JSON object with an "orders" key containing an array of { productName, amount } objects. No explanations.' },
    ];
    try {
        const { data, promptTokens, completionTokens } = await (0, generate_structured_1.generateStructured)(client_1.llm, product_order_1.ProductOrderListSchema, llmMessages, modelName);
        return { orders: data.orders, promptTokens, completionTokens };
    }
    catch (e) {
        console.error('Failed to extract product orders:', e);
        return { orders: null, promptTokens: 0, completionTokens: 0 };
    }
}
async function generateTextSuggestions(messages, modelName = models_1.DEFAULT_MODEL) {
    const llmMessages = [
        ...(0, chat_to_llm_history_1.chatToLlmHistory)(messages),
        { role: 'user', content: suggestion_prompt_1.TEXT_SUGGESTION_PROMPT },
    ];
    try {
        const { data, promptTokens, completionTokens } = await (0, generate_structured_1.generateStructured)(client_1.llm, llm_schemas_1.TextSuggestionListSchema, llmMessages, modelName);
        return { texts: data.suggestions.map(s => s.text), promptTokens, completionTokens };
    }
    catch (e) {
        console.error('Failed to generate text suggestions:', e);
        return { texts: [], promptTokens: 0, completionTokens: 0 };
    }
}
async function generateManySuggestions(messages, modelName = models_1.DEFAULT_MODEL) {
    const [textResult, orderResult] = await Promise.all([
        generateTextSuggestions(messages, modelName),
        extractProductOrders(messages, modelName),
    ]);
    const suggestions = [];
    for (const text of textResult.texts) {
        if (text.trim()) {
            suggestions.push({ action: "send_message", label: text, text });
        }
    }
    if (orderResult.orders && orderResult.orders.length > 0) {
        suggestions.push({
            action: "open_form",
            label: orderResult.orders.map(o => `${o.amount}x ${o.productName}`).join(', '),
            formType: "order",
            data: { orders: orderResult.orders },
        });
    }
    return {
        suggestions,
        promptTokens: textResult.promptTokens + orderResult.promptTokens,
        completionTokens: textResult.completionTokens + orderResult.completionTokens,
    };
}
