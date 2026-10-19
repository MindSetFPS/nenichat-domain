"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audienceRepository = exports.AudienceRepository = void 0;
const db_1 = require("../../../Shared/infra/persistance/db");
class AudienceRepository {
    constructor(pool) {
        this.pool = pool;
    }
    toAudience(data) {
        if (!data)
            return data;
        return {
            id: Number(data.id),
            name: data.name,
            description: data.description,
            created_at: data.created_at,
        };
    }
    async findById(businessId, id) {
        const result = await this.pool.query('SELECT * FROM audiences WHERE id = $1 AND business_id = $2', [id, businessId]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.toAudience(result.rows[0]);
    }
    async getByIds(businessId, ids) {
        const result = await this.pool.query('SELECT * FROM audiences WHERE id = ANY($1) AND business_id = $2', [ids, businessId]);
        return result.rows.map(this.toAudience);
    }
    async findAll(businessId) {
        const result = await this.pool.query('SELECT * FROM audiences WHERE business_id = $1', [businessId]);
        return result.rows.map(this.toAudience);
    }
    async delete(businessId, id) {
        await this.pool.query('DELETE FROM audiences WHERE id = $1 AND business_id = $2', [id, businessId]);
    }
    async create(businessId, audience) {
        const result = await this.pool.query(`
      INSERT INTO audiences (name, description, business_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [audience.name, audience.description, businessId]);
        return this.toAudience(result.rows[0]);
    }
}
exports.AudienceRepository = AudienceRepository;
exports.audienceRepository = new AudienceRepository(db_1.pool);
