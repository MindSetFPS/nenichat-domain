"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSuggestionListSchema = exports.TextSuggestionSchema = void 0;
const zod_1 = require("zod");
exports.TextSuggestionSchema = zod_1.z.object({
    text: zod_1.z.string().describe('A short, professional reply the agent could send next'),
});
exports.TextSuggestionListSchema = zod_1.z.object({
    suggestions: zod_1.z.array(zod_1.z.object({
        text: zod_1.z.string().describe('A short, professional reply the agent could send next'),
    })).describe('List of response suggestions for the agent'),
});
