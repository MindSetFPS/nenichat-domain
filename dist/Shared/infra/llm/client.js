"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.llm = void 0;
const openai_1 = __importDefault(require("openai"));
// Placeholder key keeps module import safe during build-time page data collection;
// unconfigured environments fail at request time and are handled by callers.
exports.llm = new openai_1.default({
    baseURL: process.env.LLM_BASE_URL,
    apiKey: process.env.LLM_API_KEY || 'not-configured',
});
