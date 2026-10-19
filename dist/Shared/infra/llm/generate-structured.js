"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStructured = generateStructured;
const zod_1 = require("zod");
const models_1 = require("./models");
async function generateStructured(llm, schema, messages, modelName = models_1.DEFAULT_MODEL) {
    const model = models_1.LLM_MODELS[modelName];
    if (!model)
        throw new Error(`Unknown model: ${modelName}`);
    // Only forward sampling params that are valid across OpenAI-compatible APIs.
    const { temperature, top_p, top_k, presence_penalty, seed, stop } = model;
    const options = {
        ...(temperature !== undefined && { temperature }),
        ...(top_p !== undefined && { top_p }),
        ...(top_k !== undefined && { top_k }),
        ...(presence_penalty !== undefined && { presence_penalty }),
        ...(seed !== undefined && { seed }),
        ...(stop !== undefined && { stop }),
    };
    const jsonSchema = zod_1.z.toJSONSchema(schema);
    const response = await llm.chat.completions.create({
        model: modelName,
        messages: messages,
        stream: false,
        response_format: {
            type: 'json_schema',
            json_schema: { name: 'response', schema: jsonSchema, strict: false },
        },
        ...options,
    });
    const content = response.choices[0]?.message?.content ?? '';
    const data = schema.parse(JSON.parse(content));
    return {
        data,
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
    };
}
