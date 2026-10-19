import { Pool } from 'pg';
import { IExpenseCategory } from '../../domain/IExpenseCategory';
import { IExpenseCategoryRepository } from '../../domain/IExpenseCategoryRepository';
/**
 * @class ExpenseCategoryRepository
 * @description PostgreSQL implementation of IExpenseCategoryRepository.
 */
export declare class ExpenseCategoryRepository implements IExpenseCategoryRepository {
    private pool;
    constructor(pool: Pool);
    private mapRowToCategory;
    getAll(businessId: number): Promise<IExpenseCategory[]>;
    getById(businessId: number, id: number): Promise<IExpenseCategory | null>;
    create(businessId: number, category: Omit<IExpenseCategory, 'id' | 'business_id' | 'created_at' | 'updated_at'>): Promise<IExpenseCategory>;
    update(businessId: number, id: number, updates: Partial<IExpenseCategory>): Promise<IExpenseCategory | null>;
    delete(businessId: number, id: number): Promise<boolean>;
}
