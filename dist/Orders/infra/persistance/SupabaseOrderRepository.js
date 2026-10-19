"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseOrderRepository = void 0;
const Order_1 = require("../../domain/Order");
const SupabaseContactRepository_1 = require("../../../Contacts/infra/persistance/SupabaseContactRepository");
/**
 * Implementation of IOrderRepository using Supabase.
 */
class SupabaseOrderRepository {
    constructor(supabase) {
        this._supabase = supabase;
    }
    get supabase() {
        return this._supabase;
    }
    /**
     * Maps a database row to an Order domain object.
     * @param data The database row data
     * @returns A new Order instance
     */
    mapToOrder(data) {
        return new Order_1.Order(data.id, data.business_id, data.order_number || 0, data.contact_id, parseFloat(data.total_amount), parseFloat(data.shipping_cost), data.shipping_address, data.status, data.payment_method, parseFloat(data.amount_paid), parseFloat(data.refunded_amount), data.payment_status, data.notes, data.completed_at ? new Date(data.completed_at) : null, data.cancelled_at ? new Date(data.cancelled_at) : null, new Date(data.created_at), new Date(data.updated_at));
    }
    /**
     * Retrieves an order by its ID.
     */
    async getById(businessId, id) {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('business_id', businessId)
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error("Error fetching order by ID:", error);
            throw error;
        }
        return this.mapToOrder(data);
    }
    /**
     * Retrieves an order by its order_number (business-scoped).
     */
    async getByOrderNumber(businessId, orderNumber) {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('business_id', businessId)
            .eq('order_number', orderNumber)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error("Error fetching order by order number:", error);
            throw error;
        }
        return this.mapToOrder(data);
    }
    /**
     * Retrieves all orders for a business, optionally filtered by time period.
     */
    async getAll(businessId, period) {
        let query = this.supabase
            .from('orders')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false });
        if (period && period !== "all") {
            const startDate = this.getPeriodStartDate(period);
            query = query.gte('created_at', startDate.toISOString());
        }
        const { data, error } = await query;
        if (error) {
            console.error("Error fetching all orders:", error);
            throw error;
        }
        return (data || []).map(row => this.mapToOrder(row));
    }
    /**
     * Returns the start date for a given time period.
     */
    getPeriodStartDate(period) {
        const now = new Date();
        switch (period) {
            case "today": {
                const start = new Date(now);
                start.setHours(0, 0, 0, 0);
                return start;
            }
            case "this_week": {
                const start = new Date(now);
                const dayOfWeek = start.getDay();
                const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
                start.setDate(start.getDate() - diff);
                start.setHours(0, 0, 0, 0);
                return start;
            }
            case "monthly": {
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                return start;
            }
            case "yearly": {
                const start = new Date(now.getFullYear(), 0, 1);
                return start;
            }
            default:
                return new Date(0);
        }
    }
    /**
     * Retrieves all orders for a specific contact.
     */
    async getByContactId(businessId, contactId) {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('business_id', businessId)
            .eq('contact_id', contactId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching orders by contact ID:", error);
            throw error;
        }
        return (data || []).map(row => this.mapToOrder(row));
    }
    /**
     * Retrieves all orders for a specific phone number.
     */
    async getOrdersByPhone(businessId, phoneNumber) {
        // Clean JID to get only the phone number part
        let searchNumber = phoneNumber;
        if (searchNumber.includes('@')) {
            searchNumber = searchNumber.split('@')[0];
        }
        if (searchNumber.includes(':')) {
            searchNumber = searchNumber.split(':')[0];
        }
        // Resolve contact via the global phone_numbers table JOIN
        const { data: contact, error: contactError } = await this.supabase
            .from('contacts')
            .select('id, phone_numbers!inner(phone_number)')
            .eq('business_id', businessId)
            .eq('phone_numbers.phone_number', searchNumber)
            .maybeSingle();
        if (contactError) {
            console.error("Error fetching contact by phone:", contactError);
            throw contactError;
        }
        if (!contact)
            return [];
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('business_id', businessId)
            .eq('contact_id', contact.id)
            .order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching orders by phone:", error);
            throw error;
        }
        return (data || []).map(row => this.mapToOrder(row));
    }
    /**
     * Creates a new order and its associated items.
     */
    async create(businessId, orderData, items) {
        let contactId = orderData.contact_id;
        // If no contact_id but lid is provided, resolve/create it via ContactRepository
        if (!contactId && orderData.lid) {
            const contactRepository = new SupabaseContactRepository_1.SupabaseContactRepository(this.supabase);
            const contact = await contactRepository.getOrCreateContact(businessId, orderData.lid);
            contactId = contact.id;
        }
        const { data: newOrder, error: orderError } = await this.supabase
            .from('orders')
            .insert({
            business_id: businessId,
            contact_id: contactId,
            total_amount: orderData.total_amount,
            shipping_cost: orderData.shipping_cost,
            shipping_address: orderData.shipping_address,
            status: orderData.status,
            payment_method: orderData.payment_method,
            amount_paid: orderData.amount_paid,
            refunded_amount: orderData.refunded_amount,
            payment_status: orderData.payment_status,
            notes: orderData.notes,
            completed_at: orderData.completed_at,
            cancelled_at: orderData.cancelled_at,
            created_at: orderData.created_at ? new Date(orderData.created_at).toISOString() : new Date().toISOString()
        })
            .select()
            .single();
        if (orderError) {
            console.error("Error creating order:", orderError);
            throw orderError;
        }
        const orderItems = items.map(item => ({
            order_id: newOrder.id,
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.quantity * item.unitPrice
        }));
        const { error: itemsError } = await this.supabase
            .from('orders_products')
            .insert(orderItems);
        if (itemsError) {
            console.error("Error creating order items for order:", newOrder.id, itemsError, "for items: ", orderItems);
            throw itemsError;
        }
        return this.mapToOrder(newOrder);
    }
    /**
     * Updates an existing order.
     */
    async update(businessId, id, updates, items) {
        const { data, error } = await this.supabase
            .from('orders')
            .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
            .eq('business_id', businessId)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error("Error updating order:", error);
            throw error;
        }
        if (items && items.length > 0) {
            // Delete existing items
            const { error: itemsDeleteError } = await this.supabase
                .from('orders_products')
                .delete()
                .eq('order_id', id);
            if (itemsDeleteError) {
                console.error("Error deleting order products on update:", itemsDeleteError);
                throw itemsDeleteError;
            }
            // Recreate all items
            const orderItems = items.map(item => ({
                order_id: id,
                product_id: item.productId,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                total_price: item.totalPrice || (item.quantity * item.unitPrice)
            }));
            const { error: itemsInsertError } = await this.supabase
                .from('orders_products')
                .insert(orderItems);
            if (itemsInsertError) {
                console.error("Error recreating order items on update:", itemsInsertError);
                throw itemsInsertError;
            }
        }
        return this.mapToOrder(data);
    }
    /**
     * Deletes an order by its ID.
     */
    async delete(businessId, id) {
        // 1. Delete associated products first to avoid foreign key constraint violations
        const { error: itemsError } = await this.supabase
            .from('orders_products')
            .delete()
            .eq('order_id', id);
        if (itemsError) {
            console.error("Error deleting order products:", itemsError);
            throw itemsError;
        }
        // 2. Delete the order itself
        const { error: orderError } = await this.supabase
            .from('orders')
            .delete()
            .eq('business_id', businessId)
            .eq('id', id);
        if (orderError) {
            console.error("Error deleting order:", orderError);
            throw orderError;
        }
        return true;
    }
    /**
     * Aggregates the number of products ordered on a specific date.
     */
    async getOrdersCountByDate(businessId, date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const localDateString = `${year}-${month}-${day}`;
        // Fetch orders and their items with product names
        const { data, error } = await this.supabase
            .from('orders')
            .select(`
                id,
                created_at,
                orders_products (
                    quantity,
                    products (
                        name
                    )
                )
            `)
            .eq('business_id', businessId)
            .gte('created_at', `${localDateString}T00:00:00`)
            .lte('created_at', `${localDateString}T23:59:59`);
        if (error) {
            console.error("Error fetching orders count by date:", error);
            throw error;
        }
        const aggregation = {};
        data?.forEach((order) => {
            order.orders_products?.forEach((item) => {
                const name = item.products?.name || 'Unknown Product';
                aggregation[name] = (aggregation[name] || 0) + Number(item.quantity);
            });
        });
        return Object.entries(aggregation)
            .map(([product_name, count]) => ({ product_name, count }))
            .sort((a, b) => b.count - a.count);
    }
    /**
     * Gets the total quantity of products ordered per day over a given interval.
     */
    async getProductOrdersByDateInterval(businessId, interval) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - interval);
        const { data, error } = await this.supabase
            .from('orders')
            .select(`
                created_at,
                orders_products (
                    quantity
                )
            `)
            .eq('business_id', businessId)
            .gte('created_at', dateLimit.toISOString());
        if (error) {
            console.error("Error fetching product orders by interval:", error);
            throw error;
        }
        const aggregation = {};
        data?.forEach((order) => {
            const dateStr = new Date(order.created_at).toISOString().split('T')[0];
            const quantity = order.orders_products?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
            aggregation[dateStr] = (aggregation[dateStr] || 0) + quantity;
        });
        return Object.entries(aggregation)
            .map(([date, quantity]) => ({ date, quantity }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
    /**
     * Returns the count of orders for each day of the week.
     */
    async getOrdersCountByDayOfWeek(businessId, contactId) {
        let query = this.supabase
            .from('orders')
            .select('created_at')
            .eq('business_id', businessId);
        if (contactId) {
            query = query.eq('contact_id', contactId);
        }
        const { data, error } = await query;
        if (error) {
            console.error("Error fetching orders count by day of week:", error);
            throw error;
        }
        const counts = {};
        // Initialize counts for 1-7 (Mon-Sun)
        for (let i = 1; i <= 7; i++) {
            counts[i] = 0;
        }
        data?.forEach((order) => {
            const date = new Date(order.created_at);
            // JS getDay() is 0=Sun, 1=Mon...
            // We want 1=Mon, 7=Sun
            let dayIndex = date.getDay();
            if (dayIndex === 0) {
                dayIndex = 7;
            }
            counts[dayIndex]++;
        });
        return Object.entries(counts)
            .map(([day_index, count]) => ({
            day_index: Number(day_index),
            count
        }))
            .sort((a, b) => a.day_index - b.day_index);
    }
    /**
     * Returns the total amount of orders per day for a given interval.
     */
    async getOrderTotalPerDay(businessId, interval) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - interval);
        const { data, error } = await this.supabase
            .from('orders')
            .select('created_at, total_amount')
            .eq('business_id', businessId)
            .gte('created_at', dateLimit.toISOString())
            .order('created_at', { ascending: true });
        if (error) {
            console.error("Error fetching order total per day:", error);
            throw error;
        }
        const aggregation = {};
        data?.forEach((order) => {
            const dateStr = new Date(order.created_at).toISOString().split('T')[0];
            aggregation[dateStr] = (aggregation[dateStr] || 0) + parseFloat(order.total_amount);
        });
        return Object.entries(aggregation)
            .map(([date, total]) => ({
            date,
            total
        }));
    }
    /**
     * Retrieves all items for an order, including the product name.
     */
    async getItems(businessId, orderId) {
        const { data, error } = await this.supabase
            .from('orders_products')
            .select(`
                id,
                order_id,
                product_id,
                quantity,
                unit_price,
                total_price,
                products (
                    name,
                    business_id
                )
            `)
            .eq('order_id', orderId)
            .eq('products.business_id', businessId);
        if (error) {
            console.error("Error fetching order items:", error);
            throw error;
        }
        return (data || []).map((row) => ({
            id: row.id,
            order_id: row.order_id,
            product_id: row.product_id,
            quantity: Number(row.quantity),
            unit_price: Number(row.unit_price),
            total_price: Number(row.total_price),
            product_name: row.products?.name || null
        }));
    }
}
exports.SupabaseOrderRepository = SupabaseOrderRepository;
