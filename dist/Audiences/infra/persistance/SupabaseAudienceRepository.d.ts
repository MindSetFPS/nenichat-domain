import { SupabaseClient } from '@supabase/supabase-js';
import { IAudience } from '../../domain/IAudience';
import { IAudienceRepository } from '../../domain/IAudienceRepository';
export declare class SupabaseAudienceRepository implements IAudienceRepository {
    private _supabase;
    constructor(supabase: SupabaseClient);
    get supabase(): SupabaseClient;
    findById(businessId: number, id: number): Promise<IAudience | null>;
    getByIds(businessId: number, ids: number[]): Promise<IAudience[]>;
    findAll(businessId: number): Promise<IAudience[]>;
    delete(businessId: number, id: number): Promise<void>;
    create(businessId: number, audience: Omit<IAudience, 'id' | 'business_id' | 'created_at'>): Promise<IAudience>;
}
