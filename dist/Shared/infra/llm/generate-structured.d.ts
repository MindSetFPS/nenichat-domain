import OpenAI from 'openai';
import { z } from 'zod';
export declare function generateStructured<T extends z.ZodType>(llm: OpenAI, schema: T, messages: {
    role: string;
    content: string;
}[], modelName?: string): Promise<{
    data: z.infer<T>;
    promptTokens: number;
    completionTokens: number;
}>;
