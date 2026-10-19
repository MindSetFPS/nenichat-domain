"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoryRepository = void 0;
/**
 * @class ExpenseCategoryRepository
 * @description PostgreSQL implementation of IExpenseCategoryRepository.
 */
class ExpenseCategoryRepository {
    constructor(pool) {
        this.pool = pool;
    }
    mapRowToCategory(row) {
        return {
            id: parseInt(row.id),
            business_id: row.business_id ? parseInt(row.business_id) : undefined,
            name: row.name,
            description: row.description,
            color: row.color,
            is_active: row.is_active,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at)
        };
    }
    async getAll(businessId) {
        const query = `
            SELECT * FROM expense_categories 
            WHERE is_active = true
            ORDER BY name ASC
        `;
        const result = await this.pool.query(query);
        return result.rows.map(row => this.mapRowToCategory(row));
    }
    async getById(businessId, id) {
        const query = 'SELECT * FROM expense_categories WHERE id = $1';
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToCategory(result.rows[0]);
    }
    async create(businessId, category) {
        throw new Error("Creation of categories is disabled for businesses.");
    }
    async update(businessId, id, updates) {
        throw new Error("Updating categories is disabled for businesses.");
    }
    async delete(businessId, id) {
        throw new Error("Deletion of categories is disabled for businesses.");
    }
}
exports.ExpenseCategoryRepository = ExpenseCategoryRepository;
