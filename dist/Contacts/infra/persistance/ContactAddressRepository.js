"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactAddressRepository = void 0;
const ContactAddress_1 = require("../../domain/ContactAddress");
class ContactAddressRepository {
    constructor(pool) {
        this.pool = pool;
    }
    mapRowToContactAddress(row) {
        return new ContactAddress_1.ContactAddress(parseInt(row.id), parseInt(row.contact_id), row.address, row.label, row.is_default, row.created_at, row.updated_at);
    }
    async getById(id) {
        const result = await this.pool.query('SELECT * FROM contact_addresses WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToContactAddress(result.rows[0]);
    }
    async getByContactId(contactId) {
        const result = await this.pool.query('SELECT * FROM contact_addresses WHERE contact_id = $1 ORDER BY is_default DESC, created_at DESC', [contactId]);
        return result.rows.map(this.mapRowToContactAddress);
    }
    async create(address) {
        const query = `
      INSERT INTO contact_addresses (contact_id, address, label, is_default)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const values = [
            address.contact_id,
            address.address,
            address.label,
            address.is_default
        ];
        const result = await this.pool.query(query, values);
        return this.mapRowToContactAddress(result.rows[0]);
    }
    async update(id, updates) {
        const fields = Object.keys(updates)
            .map((key, index) => `"${key}" = $${index + 2}`)
            .join(', ');
        const values = Object.values(updates);
        if (fields.length === 0) {
            return this.getById(id);
        }
        const query = `UPDATE contact_addresses SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`;
        const result = await this.pool.query(query, [id, ...values]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToContactAddress(result.rows[0]);
    }
    async delete(id) {
        const result = await this.pool.query('DELETE FROM contact_addresses WHERE id = $1', [id]);
        return (result.rowCount || 0) > 0;
    }
    async setDefault(id, contactId) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            // Unset default for all other addresses of this contact
            await client.query('UPDATE contact_addresses SET is_default = FALSE WHERE contact_id = $1', [contactId]);
            // Set default for the specified address
            const result = await client.query('UPDATE contact_addresses SET is_default = TRUE WHERE id = $1 AND contact_id = $2', [id, contactId]);
            await client.query('COMMIT');
            return (result.rowCount || 0) > 0;
        }
        catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }
        finally {
            client.release();
        }
    }
}
exports.ContactAddressRepository = ContactAddressRepository;
