import { IOrder } from "../domain/IOrder";
type OrderStatus = IOrder["status"];
/** Canonical status order for selects and breakdowns. */
export declare const ORDER_STATUSES: OrderStatus[];
export declare const ORDER_STATUS_LABELS: Record<OrderStatus, string>;
/** Plural forms for count lists ("3 Pendientes"). */
export declare const ORDER_STATUS_PLURAL_LABELS: Record<OrderStatus, string>;
export declare const PAYMENT_METHOD_LABELS: Record<string, string>;
export {};
