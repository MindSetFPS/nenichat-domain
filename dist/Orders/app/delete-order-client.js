"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = deleteOrder;
async function deleteOrder(orderId) {
    const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error("Failed to delete order");
    }
}
