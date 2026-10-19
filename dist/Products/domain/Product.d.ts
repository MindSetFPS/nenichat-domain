import { IProduct } from './IProduct';
import { IImage } from './IImage';
export declare class Product implements IProduct {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    images: IImage[];
    whatsapp_product_id: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    constructor(id: string, name: string, description: string | null, price: number, stock: number, images: IImage[], whatsapp_product_id: string | null, is_active: boolean, created_at: Date, updated_at: Date);
}
