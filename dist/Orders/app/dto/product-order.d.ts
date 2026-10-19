import { z } from 'zod';
export declare const ProductOrderSchema: z.ZodObject<{
    productName: z.ZodString;
    amount: z.ZodNumber;
}, z.core.$strip>;
export declare const ProductOrderListSchema: z.ZodObject<{
    orders: z.ZodArray<z.ZodObject<{
        productName: z.ZodString;
        amount: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ProductOrder = z.infer<typeof ProductOrderSchema>;
