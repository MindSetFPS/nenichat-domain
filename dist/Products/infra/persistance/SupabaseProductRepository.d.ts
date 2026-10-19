import { SupabaseClient } from '@supabase/supabase-js';
import { IProduct, IProductWithUnitsSold } from '../../domain/IProduct';
import { IProductRepository } from '../../domain/IProductRepository';
export declare class SupabaseProductRepository implements IProductRepository {
    private _supabase;
    constructor(supabase: SupabaseClient);
    get supabase(): SupabaseClient;
    private mapToProduct;
    getById(businessId: number, id: string): Promise<IProduct | null>;
    getAll(businessId: number): Promise<IProductWithUnitsSold[]>;
    list(businessId: number, limit: number, offset: number, active_only?: boolean): Promise<IProductWithUnitsSold[]>;
    create(businessId: number, product: Omit<IProduct, 'id' | 'business_id' | 'created_at' | 'updated_at'>): Promise<IProduct>;
    update(businessId: number, id: string, updates: Partial<IProduct>): Promise<IProduct | null>;
    delete(businessId: number, id: string): Promise<boolean>;
    deleteImage(businessId: number, productId: string, imageId: string): Promise<boolean>;
    getProductSales(businessId: number, productId: string): Promise<{
        quantity: number;
        created_at: Date;
    }[]>;
}
