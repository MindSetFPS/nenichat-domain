import { Pool } from 'pg';
import { IOrder } from '../../domain/IOrder';
import { IOrderRepository, OrderTimePeriod } from '../../domain/IOrderRepository';
import { IOrdersReport } from '../../domain/IOrdersReport';
import { IOrderItemWithProduct } from '../../domain/IOrderItemWithProduct';
export declare class OrderRepository implements IOrderRepository {
    private pool;
    constructor(pool: Pool);
    private mapRowToOrder;
    getById(businessId: number, id: number): Promise<IOrder | null>;
    getByOrderNumber(businessId: number, orderNumber: number): Promise<IOrder | null>;
    getAll(businessId: number, period?: OrderTimePeriod): Promise<IOrder[]>;
    private getPeriodStartDate;
    getByContactId(businessId: number, contactId: number): Promise<IOrder[]>;
    getOrdersByPhone(businessId: number, phoneNumber: string): Promise<IOrder[]>;
    create(businessId: number, orderData: Omit<IOrder, 'id' | 'business_id' | 'created_at' | 'updated_at'> & {
        created_at?: Date;
    }, items: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
    }>): Promise<IOrder>;
    update(businessId: number, id: number, updates: Partial<IOrder>, items?: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        totalPrice?: number;
    }>): Promise<IOrder | null>;
    getOrderTotalPerDay(businessId: number, interval: number): Promise<IOrdersReport[]>;
    delete(businessId: number, id: number): Promise<boolean>;
    getOrdersCountByDate(businessId: number, date: Date): Promise<{
        product_name: string;
        count: number;
    }[]>;
    getProductOrdersByDateInterval(businessId: number, interval: number): Promise<{
        date: string;
        quantity: number;
    }[]>;
    getOrdersCountByDayOfWeek(businessId: number, contactId?: number): Promise<{
        day_index: number;
        count: number;
    }[]>;
    getItems(businessId: number, orderId: number): Promise<IOrderItemWithProduct[]>;
}
