import { Pool } from 'pg';
import { IOrderItem } from '../../domain/IOrderItem';
import { IOrderItemWithProduct } from '../../domain/IOrderItemWithProduct';
import { IOrderItemRepository } from '../../domain/IOrderItemRepository';
export declare class OrderItemRepository implements IOrderItemRepository {
    private pool;
    constructor(pool: Pool);
    private mapRowToOrderItem;
    getById(id: number): Promise<IOrderItem | null>;
    getByOrderId(orderId: number): Promise<IOrderItem[]>;
    getByOrderIdWithProduct(orderId: number): Promise<IOrderItemWithProduct[]>;
    create(item: Omit<IOrderItem, 'id'>): Promise<IOrderItem>;
    update(id: number, updates: Partial<IOrderItem>): Promise<IOrderItem | null>;
    findOne(order_id: number, product_id: string): Promise<IOrderItem | null>;
    delete(id: number): Promise<boolean>;
}
