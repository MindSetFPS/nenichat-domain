import { IOrderItem } from './IOrderItem';
export declare class OrderItem implements IOrderItem {
    id: number;
    order_id: number;
    product_id: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    constructor(id: number, order_id: number, product_id: string | null, quantity: number, unit_price: number, total_price: number);
}
