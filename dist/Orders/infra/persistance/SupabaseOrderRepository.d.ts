import { SupabaseClient } from "@supabase/supabase-js";
import { IOrder } from "../../domain/IOrder";
import { IOrderRepository, OrderTimePeriod } from "../../domain/IOrderRepository";
import { IOrderItemWithProduct } from "../../domain/IOrderItemWithProduct";
import { IOrdersReport } from "../../domain/IOrdersReport";
/**
 * Implementation of IOrderRepository using Supabase.
 */
export declare class SupabaseOrderRepository implements IOrderRepository {
    private _supabase;
    constructor(supabase: SupabaseClient);
    get supabase(): SupabaseClient;
    /**
     * Maps a database row to an Order domain object.
     * @param data The database row data
     * @returns A new Order instance
     */
    private mapToOrder;
    /**
     * Retrieves an order by its ID.
     */
    getById(businessId: number, id: number): Promise<IOrder | null>;
    /**
     * Retrieves an order by its order_number (business-scoped).
     */
    getByOrderNumber(businessId: number, orderNumber: number): Promise<IOrder | null>;
    /**
     * Retrieves all orders for a business, optionally filtered by time period.
     */
    getAll(businessId: number, period?: OrderTimePeriod): Promise<IOrder[]>;
    /**
     * Returns the start date for a given time period.
     */
    private getPeriodStartDate;
    /**
     * Retrieves all orders for a specific contact.
     */
    getByContactId(businessId: number, contactId: number): Promise<IOrder[]>;
    /**
     * Retrieves all orders for a specific phone number.
     */
    getOrdersByPhone(businessId: number, phoneNumber: string): Promise<IOrder[]>;
    /**
     * Creates a new order and its associated items.
     */
    create(businessId: number, orderData: Omit<IOrder, 'id' | 'business_id' | 'created_at' | 'updated_at'> & {
        created_at?: Date;
        lid?: string | null;
    }, items: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
    }>): Promise<IOrder>;
    /**
     * Updates an existing order.
     */
    update(businessId: number, id: number, updates: Partial<IOrder>, items?: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        totalPrice?: number;
    }>): Promise<IOrder | null>;
    /**
     * Deletes an order by its ID.
     */
    delete(businessId: number, id: number): Promise<boolean>;
    /**
     * Aggregates the number of products ordered on a specific date.
     */
    getOrdersCountByDate(businessId: number, date: Date): Promise<{
        product_name: string;
        count: number;
    }[]>;
    /**
     * Gets the total quantity of products ordered per day over a given interval.
     */
    getProductOrdersByDateInterval(businessId: number, interval: number): Promise<{
        date: string;
        quantity: number;
    }[]>;
    /**
     * Returns the count of orders for each day of the week.
     */
    getOrdersCountByDayOfWeek(businessId: number, contactId?: number): Promise<{
        day_index: number;
        count: number;
    }[]>;
    /**
     * Returns the total amount of orders per day for a given interval.
     */
    getOrderTotalPerDay(businessId: number, interval: number): Promise<IOrdersReport[]>;
    /**
     * Retrieves all items for an order, including the product name.
     */
    getItems(businessId: number, orderId: number): Promise<IOrderItemWithProduct[]>;
}
