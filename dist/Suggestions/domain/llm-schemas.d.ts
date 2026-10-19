import { z } from 'zod';
export declare const TextSuggestionSchema: z.ZodObject<{
    text: z.ZodString;
}, z.core.$strip>;
export declare const TextSuggestionListSchema: z.ZodObject<{
    suggestions: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
