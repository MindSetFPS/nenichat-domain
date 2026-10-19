"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOneText = generateOneText;
const models_1 = require("../../Shared/infra/llm/models");
const client_1 = require("../../Shared/infra/llm/client");
const generate_structured_1 = require("../../Shared/infra/llm/generate-structured");
const suggestion_prompt_1 = require("../domain/suggestion-prompt");
const llm_schemas_1 = require("../domain/llm-schemas");
const chat_to_llm_history_1 = require("./chat-to-llm-history");
async function generateOneText(messages, modelName = models_1.DEFAULT_MODEL) {
    const llmMessages = [
        ...(0, chat_to_llm_history_1.chatToLlmHistory)(messages),
        { role: 'user', content: suggestion_prompt_1.TEXT_SUGGESTION_PROMPT },
    ];
    try {
        const { data, promptTokens, completionTokens } = await (0, generate_structured_1.generateStructured)(client_1.llm, llm_schemas_1.TextSuggestionSchema, llmMessages, modelName);
        const text = data.text.trim();
        if (!text)
            return { suggestion: null, promptTokens, completionTokens };
        return { suggestion: { action: "send_message", label: text, text }, promptTokens, completionTokens };
    }
    catch (e) {
        console.error('Failed to generate text suggestion:', e);
        return { suggestion: null, promptTokens: 0, completionTokens: 0 };
    }
}
