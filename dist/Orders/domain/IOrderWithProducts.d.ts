import { IOrder } from "./IOrder";
import { IOrderItemWithProduct } from "./IOrderItemWithProduct";
export interface IOrderWithProducts extends IOrder {
    items: IOrderItemWithProduct[];
}
