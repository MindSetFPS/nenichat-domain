import { SupabaseClient } from '@supabase/supabase-js';
import { IExpense, IExpenseWithCategory } from '../../domain/IExpense';
import { IExpenseCategory } from '../../domain/IExpenseCategory';
import { IExpenseRepository } from '../../domain/IExpenseRepository';
export declare class SupabaseExpenseRepository implements IExpenseRepository {
    private _supabase;
    constructor(supabase: SupabaseClient);
    get supabase(): SupabaseClient;
    private mapToExpense;
    private mapToExpenseWithCategory;
    getAll(businessId: number): Promise<IExpenseWithCategory[]>;
    getById(businessId: number, id: number): Promise<IExpense | null>;
    getByCategoryId(businessId: number, categoryId: number): Promise<IExpenseWithCategory[]>;
    getByDateRange(businessId: number, startDate: Date, endDate: Date): Promise<IExpenseWithCategory[]>;
    create(businessId: number, expense: Omit<IExpense, 'id' | 'business_id' | 'created_at' | 'updated_at'>): Promise<IExpense>;
    update(businessId: number, id: number, updates: Partial<IExpense>): Promise<IExpense | null>;
    delete(businessId: number, id: number): Promise<boolean>;
    getTotalByDateRange(businessId: number, startDate: Date, endDate: Date): Promise<number>;
    getTotalByCategory(businessId: number, startDate: Date, endDate: Date): Promise<Array<{
        category_id: number;
        category_name: string;
        category_color: string;
        total: number;
        percentage: number;
    }>>;
    getDailyTotals(businessId: number, startDate: Date, endDate: Date): Promise<Array<{
        date: Date;
        total: number;
    }>>;
    private mapToCategory;
    getAllCategories(): Promise<IExpenseCategory[]>;
    getCategoryById(businessId: number, id: number): Promise<IExpenseCategory | null>;
}
