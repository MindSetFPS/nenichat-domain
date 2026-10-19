"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseProductRepository = void 0;
const Product_1 = require("../../domain/Product");
class SupabaseProductRepository {
    constructor(supabase) {
        this._supabase = supabase;
    }
    get supabase() {
        return this._supabase;
    }
    mapToProduct(data) {
        return new Product_1.Product(data.id, data.name, data.description, parseFloat(data.price), data.stock, data.product_images?.map((pi) => pi.images) || [], data.whatsapp_product_id, data.is_active, new Date(data.created_at), new Date(data.updated_at));
    }
    async getById(businessId, id) {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            // .select('*, product_images(images(*))')
            .eq('business_id', businessId)
            .eq('id', id)
            .maybeSingle();
        if (error)
            throw error;
        return data ? this.mapToProduct(data) : null;
    }
    async getAll(businessId) {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            // .select('*, product_images(images(*))')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        const products = (data || []).map(row => this.mapToProduct(row));
        // Fetch monthly sales for each product
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const { data: salesData, error: salesError } = await this.supabase
            .from('orders_products')
            .select('product_id, orders!inner(business_id, created_at)')
            .eq('orders.business_id', businessId)
            .gte('orders.created_at', lastMonth.toISOString());
        if (salesError)
            throw salesError;
        const salesCounts = {};
        salesData?.forEach((item) => {
            salesCounts[item.product_id] = (salesCounts[item.product_id] || 0) + 1;
        });
        return products.map(p => ({
            ...p,
            units_sold: salesCounts[p.id] || 0
        }));
    }
    async list(businessId, limit, offset, active_only) {
        let query = this.supabase
            .from('products')
            // .select('*, product_images(images(*))')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
        if (active_only) {
            query = query.eq('is_active', true);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        const products = (data || []).map(row => this.mapToProduct(row));
        if (products.length === 0)
            return [];
        // Fetch monthly sales for each product in the list
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const productIds = products.map(p => p.id);
        const { data: salesData, error: salesError } = await this.supabase
            .from('orders_products')
            .select('product_id, orders!inner(business_id, created_at)')
            .eq('orders.business_id', businessId)
            .in('product_id', productIds)
            .gte('orders.created_at', lastMonth.toISOString());
        if (salesError)
            throw salesError;
        const salesCounts = {};
        salesData?.forEach((item) => {
            salesCounts[item.product_id] = (salesCounts[item.product_id] || 0) + 1;
        });
        return products.map(p => ({
            ...p,
            units_sold: salesCounts[p.id] || 0
        }));
    }
    async create(businessId, product) {
        const { images, ...productToInsert } = product;
        const { data, error } = await this.supabase
            .from('products')
            .insert({ ...productToInsert, business_id: businessId })
            .select()
            .single();
        if (error)
            throw error;
        return this.mapToProduct(data);
    }
    async update(businessId, id, updates) {
        const { images, ...updatesToApply } = updates;
        const { data, error } = await this.supabase
            .from('products')
            .update(updatesToApply)
            .eq('business_id', businessId)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return this.mapToProduct(data);
    }
    async delete(businessId, id) {
        const { error } = await this.supabase
            .from('products')
            .delete()
            .eq('business_id', businessId)
            .eq('id', id);
        if (error)
            throw error;
        return true;
    }
    async deleteImage(businessId, productId, imageId) {
        // This logic is complex because it involves deleting associations and potentially orphaned files.
        // In a pure Supabase/Client-side implementation, we dissociated it in product_images.
        const { error } = await this.supabase
            .from('product_images')
            .delete()
            .eq('product_id', productId)
            .eq('image_id', imageId);
        if (error)
            throw error;
        return true;
    }
    async getProductSales(businessId, productId) {
        const { data, error } = await this.supabase
            .from('orders_products')
            .select('quantity, orders!inner(id, created_at)')
            .eq('product_id', productId)
            .eq('orders.business_id', businessId);
        if (error)
            throw error;
        return (data || []).map((item) => ({
            quantity: item.quantity,
            created_at: new Date(item.orders.created_at)
        }));
    }
}
exports.SupabaseProductRepository = SupabaseProductRepository;
