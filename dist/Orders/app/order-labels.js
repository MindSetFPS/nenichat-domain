"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_METHOD_LABELS = exports.ORDER_STATUS_PLURAL_LABELS = exports.ORDER_STATUS_LABELS = exports.ORDER_STATUSES = void 0;
/** Canonical status order for selects and breakdowns. */
exports.ORDER_STATUSES = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];
exports.ORDER_STATUS_LABELS = {
    pending: "Pendiente",
    processing: "Procesando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
};
/** Plural forms for count lists ("3 Pendientes"). */
exports.ORDER_STATUS_PLURAL_LABELS = {
    pending: "Pendientes",
    processing: "Procesando",
    shipped: "Enviados",
    delivered: "Entregados",
    cancelled: "Cancelados",
};
exports.PAYMENT_METHOD_LABELS = {
    cash: "Efectivo",
    card: "Tarjeta",
    transfer: "Transferencia",
    other: "Otro",
};
