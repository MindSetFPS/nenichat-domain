"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseExpenseRepository = void 0;
class SupabaseExpenseRepository {
    constructor(supabase) {
        this._supabase = supabase;
    }
    get supabase() {
        return this._supabase;
    }
    mapToExpense(data) {
        return {
            id: data.id,
            category_id: data.category_id,
            business_id: data.business_id,
            amount: parseFloat(data.amount),
            description: data.description,
            vendor: data.vendor,
            payment_method: data.payment_method,
            receipt_url: data.receipt_url,
            notes: data.notes,
            expense_date: new Date(data.expense_date),
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at)
        };
    }
    mapToExpenseWithCategory(data) {
        const category = Array.isArray(data.expense_categories)
            ? data.expense_categories[0]
            : data.expense_categories;
        return {
            ...this.mapToExpense(data),
            category_name: category?.name,
            category_color: category?.color
        };
    }
    async getAll(businessId) {
        const { data, error } = await this.supabase
            .from('expenses')
            .select('*, expense_categories(name, color)')
            .eq('business_id', businessId)
            .order('expense_date', { ascending: false });
        if (error)
            throw error;
        return (data || []).map(row => this.mapToExpenseWithCategory(row));
    }
    async getById(businessId, id) {
        const { data, error } = await this.supabase
            .from('expenses')
            .select('*')
            .eq('business_id', businessId)
            .eq('id', id)
            .maybeSingle();
        if (error)
            throw error;
        return data ? this.mapToExpense(data) : null;
    }
    async getByCategoryId(businessId, categoryId) {
        const { data, error } = await this.supabase
            .from('expenses')
            .select('*, expense_categories(name, color)')
            .eq('business_id', businessId)
            .eq('category_id', categoryId)
            .order('expense_date', { ascending: false });
        if (error)
            throw error;
        return (data || []).map(row => this.mapToExpenseWithCategory(row));
    }
    async getByDateRange(businessId, startDate, endDate) {
        const { data, error } = await this.supabase
            .from('expenses')
            .select('*, expense_categories(name, color)')
            .eq('business_id', businessId)
            .gte('expense_date', startDate.toISOString())
            .lte('expense_date', endDate.toISOString())
            .order('expense_date', { ascending: false });
        if (error)
            throw error;
        return (data || []).map(row => this.mapToExpenseWithCategory(row));
    }
    async create(businessId, expense) {
        const { data, error } = await this.supabase
            .from('expenses')
            .insert({
            category_id: expense.category_id,
            amount: expense.amount,
            description: expense.description,
            vendor: expense.vendor,
            payment_method: expense.payment_method,
            receipt_url: expense.receipt_url,
            notes: expense.notes,
            expense_date: expense.expense_date,
            business_id: businessId
        })
            .select()
            .single();
        if (error)
            throw error;
        return this.mapToExpense(data);
    }
    async update(businessId, id, updates) {
        const { data, error } = await this.supabase
            .from('expenses')
            .update(updates)
            .eq('business_id', businessId)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return this.mapToExpense(data);
    }
    async delete(businessId, id) {
        const { error } = await this.supabase
            .from('expenses')
            .delete()
            .eq('business_id', businessId)
            .eq('id', id);
        if (error)
            throw error;
        return true;
    }
    async getTotalByDateRange(businessId, startDate, endDate) {
        const { data, error } = await this.supabase
            .from('expenses')
            .select('amount')
            .eq('business_id', businessId)
            .gte('expense_date', startDate.toISOString())
            .lte('expense_date', endDate.toISOString());
        if (error)
            throw error;
        return (data || []).reduce((sum, row) => sum + parseFloat(row.amount), 0);
    }
    async getTotalByCategory(businessId, startDate, endDate) {
        const { data, error } = await this.supabase
            .from('expenses')
            .select('amount, category_id, expense_categories(name, color)')
            .eq('business_id', businessId)
            .gte('expense_date', startDate.toISOString())
            .lte('expense_date', endDate.toISOString());
        if (error)
            throw error;
        const totals = {};
        let grandTotal = 0;
        (data || []).forEach(row => {
            const category = Array.isArray(row.expense_categories)
                ? row.expense_categories[0]
                : row.expense_categories;
            const amount = parseFloat(row.amount);
            grandTotal += amount;
            if (!totals[row.category_id]) {
                totals[row.category_id] = {
                    category_id: row.category_id,
                    category_name: category?.name,
                    category_color: category?.color,
                    total: 0
                };
            }
            totals[row.category_id].total += amount;
        });
        return Object.values(totals).map(t => ({
            ...t,
            percentage: grandTotal > 0 ? (t.total / grandTotal) * 100 : 0
        })).sort((a, b) => b.total - a.total);
    }
    async getDailyTotals(businessId, startDate, endDate) {
        const { data, error } = await this.supabase
            .from('expenses')
            .select('amount, expense_date')
            .eq('business_id', businessId)
            .gte('expense_date', startDate.toISOString())
            .lte('expense_date', endDate.toISOString());
        if (error)
            throw error;
        const daily = {};
        (data || []).forEach(row => {
            const dateStr = new Date(row.expense_date).toISOString().split('T')[0];
            daily[dateStr] = (daily[dateStr] || 0) + parseFloat(row.amount);
        });
        return Object.entries(daily).map(([date, total]) => ({
            date: new Date(date),
            total
        })).sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    mapToCategory(data) {
        return {
            id: data.id,
            business_id: data.business_id,
            name: data.name,
            description: data.description,
            color: data.color,
            is_active: data.is_active,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at)
        };
    }
    async getAllCategories() {
        const { data, error } = await this.supabase
            .from('expense_categories')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true });
        if (error)
            throw error;
        return (data || []).map(this.mapToCategory);
    }
    async getCategoryById(businessId, id) {
        const { data, error } = await this.supabase
            .from('expense_categories')
            .select('*')
            .eq('business_id', businessId)
            .eq('id', id)
            .maybeSingle();
        if (error)
            throw error;
        return data ? this.mapToCategory(data) : null;
    }
}
exports.SupabaseExpenseRepository = SupabaseExpenseRepository;
