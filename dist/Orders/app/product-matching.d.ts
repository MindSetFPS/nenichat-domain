import type { ProductOrder } from "./dto/product-order";
export interface OrderItemRow {
    productId: string;
    quantity: number;
    unitPrice: number;
}
/**
 * Match an order product name against a known product using
 * progressively looser strategies:
 *
 * 1. **Exact** (normalized)        – "Café" ↔ "cafe" (handles accents)
 * 2. **Substring** (normalized)    – "Coca Cola 500ml" ↔ "coca cola"
 * 3. **Token overlap ≥ 50%**       – "Rice White Long" ↔ "White Rice"
 * 4. **Levenshtein ratio ≥ 80%**   – "Choclate" ↔ "Chocolate" (typos)
 *
 * @example
 * matchProduct("Café",         { name: "Cafe",       price: 5 })  // true  (exact after deburr)
 * matchProduct("Choclate",     { name: "Chocolate",  price: 3 })  // true  (levenshtein 87.5%)
 * matchProduct("Coca Cola 2L", { name: "Coca Cola",  price: 2 })  // true  (substring)
 * matchProduct("White Rice",   { name: "Rice White", price: 4 })  // true  (token overlap 100%)
 * matchProduct("Laptop",       { name: "Notebook",   price: 9 })  // false (completely different)
 */
export declare function matchProduct(orderName: string, product: {
    name: string;
}): boolean;
/**
 * Map products extracted from an LLM suggestion to OrderItemRow
 * objects that the order form can consume.
 *
 * Each LLM-extracted ProductOrder is fuzzy-matched against the
 * available product catalog using {@link matchProduct}, which
 * handles accents, punctuation, word-order differences, and typos.
 *
 * Unmatched products produce an empty productId (no auto-link).
 *
 * @param orders   – products extracted from the LLM conversation
 * @param products – the available product catalog (id, name, price)
 * @returns order items ready for the order form
 *
 * @example
 * // LLM says "2 chocolate bars and 1 café"
 * const orders = [
 *   { productName: "Choclate", amount: 2 },       // typo
 *   { productName: "Café",     amount: 1 },       // accent
 * ];
 * const catalog = [
 *   { id: "p1", name: "Chocolate", price: 3 },
 *   { id: "p2", name: "Cafe",      price: 5 },
 * ];
 * mapExtractedProductsToEcommerceProducts(orders, catalog);
 * // → [
 * //     { productId: "p1", quantity: 2, unitPrice: 3 },
 * //     { productId: "p2", quantity: 1, unitPrice: 5 },
 * //   ]
 */
export declare function mapExtractedProductsToEcommerceProducts(orders: ProductOrder[], products: {
    id: string;
    name: string;
    price: number;
}[]): OrderItemRow[];
