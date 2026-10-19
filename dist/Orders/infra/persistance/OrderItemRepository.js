"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemRepository = void 0;
const OrderItem_1 = require("../../domain/OrderItem");
class OrderItemRepository {
    constructor(pool) {
        this.pool = pool;
    }
    mapRowToOrderItem(row) {
        return new OrderItem_1.OrderItem(parseInt(row.id), parseInt(row.order_id), row.product_id, row.quantity, parseFloat(row.unit_price), parseFloat(row.total_price));
    }
    async getById(id) {
        const result = await this.pool.query('SELECT * FROM order_items WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToOrderItem(result.rows[0]);
    }
    async getByOrderId(orderId) {
        const result = await this.pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
        return result.rows.map(this.mapRowToOrderItem);
    }
    async getByOrderIdWithProduct(orderId) {
        const query = `
            SELECT oi.*, p.name as product_name 
            FROM order_items oi 
            LEFT JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = $1
        `;
        const result = await this.pool.query(query, [orderId]);
        return result.rows.map(row => ({
            ...this.mapRowToOrderItem(row),
            product_name: row.product_name || null
        }));
    }
    async create(item) {
        const query = `
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const values = [
            item.order_id,
            item.product_id,
            item.quantity,
            item.unit_price,
            item.total_price
        ];
        const result = await this.pool.query(query, values);
        return this.mapRowToOrderItem(result.rows[0]);
    }
    async update(id, updates) {
        const fields = Object.keys(updates)
            .map((key, index) => `"${key}" = $${index + 2}`)
            .join(', ');
        const values = Object.values(updates);
        if (fields.length === 0) {
            return this.getById(id);
        }
        const query = `UPDATE order_items SET ${fields} WHERE id = $1 RETURNING *`;
        const result = await this.pool.query(query, [id, ...values]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToOrderItem(result.rows[0]);
    }
    findOne(order_id, product_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM order_items WHERE order_id = $1 AND product_id = $2 LIMIT 1';
                const values = [order_id, product_id];
                const result = await this.pool.query(query, values);
                if (result.rows.length === 0) {
                    resolve(null);
                }
                else {
                    resolve(this.mapRowToOrderItem(result.rows[0]));
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    ;
    async delete(id) {
        const result = await this.pool.query('DELETE FROM order_items WHERE id = $1', [id]);
        return (result.rowCount || 0) > 0;
    }
}
exports.OrderItemRepository = OrderItemRepository;
