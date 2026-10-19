"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MODEL = exports.LLM_MODELS = void 0;
exports.LLM_MODELS = {
    // Thinking mode for text tasks: temperature=1.0, top_p=0.95, top_k=20, min_p=0.0, presence_penalty=1.5, repetition_penalty=1.0
    'qwen3.5:0.8b': {
        name: 'qwen3.5:0.8b',
        temperature: 1,
        top_k: 20,
        top_p: 0.95,
        min_p: 0.0,
        think: false,
        num_ctx: 8192, // if context is not enough, it will spit random text
        presence_penalty: 1.5,
        repetition_penalty: 1.0,
    },
    'qwen3.5:4b': {
        name: 'qwen3.5:4b',
        temperature: 1,
        top_k: 20,
        top_p: 0.95,
        think: false, // this does nothing, the think option is at request level, not model level.
        num_ctx: 8192 * 2, // if context is not enough, it will spit random text
        presence_penalty: 1.5,
    },
    'qwen3.5:9b': {
        name: 'qwen3.5:9b',
        temperature: 1,
        top_k: 20,
        top_p: 0.95,
        think: true, // this does nothing, the think option is at request level, not model level.
        num_ctx: 8192 * 2, // if context is not enough, it will spit random text
        presence_penalty: 1.5,
    },
    'gpt-oss:20b': {
        name: 'gpt-oss:20b',
        temperature: 1,
        num_ctx: 8192,
    },
};
exports.DEFAULT_MODEL = process.env.LLM_MODEL || 'gpt-oss:20b';
