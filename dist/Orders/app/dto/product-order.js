"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOrderListSchema = exports.ProductOrderSchema = void 0;
const zod_1 = require("zod");
exports.ProductOrderSchema = zod_1.z.object({
    productName: zod_1.z.string().describe('The name of the product ordered'),
    amount: zod_1.z.number().int().positive().describe('The quantity of the product'),
});
exports.ProductOrderListSchema = zod_1.z.object({
    orders: zod_1.z.array(exports.ProductOrderSchema)
        .describe('Array of product orders extracted from the conversation'),
});
