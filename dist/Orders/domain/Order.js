"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(id, business_id, order_number, contact_id, total_amount, shipping_cost, shipping_address, status, payment_method, amount_paid, refunded_amount, payment_status, notes, completed_at, cancelled_at, created_at, updated_at) {
        this.id = id;
        this.business_id = business_id;
        this.order_number = order_number;
        this.contact_id = contact_id;
        this.total_amount = total_amount;
        this.shipping_cost = shipping_cost;
        this.shipping_address = shipping_address;
        this.status = status;
        this.payment_method = payment_method;
        this.amount_paid = amount_paid;
        this.refunded_amount = refunded_amount;
        this.payment_status = payment_status;
        this.notes = notes;
        this.completed_at = completed_at;
        this.cancelled_at = cancelled_at;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
exports.Order = Order;
