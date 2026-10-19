import { SupabaseClient } from '@supabase/supabase-js';
import { ICampaign } from '../../domain/ICampaign';
import { ICampaignRepository } from '../../domain/ICampaignRepository';
export declare class SupabaseCampaignRepository implements ICampaignRepository {
    private _supabase;
    constructor(supabase: SupabaseClient);
    get supabase(): SupabaseClient;
    private mapToCampaign;
    findById(businessId: number, id: string): Promise<ICampaign | null>;
    create(businessId: number, campaign: Partial<ICampaign>): Promise<ICampaign>;
    update(businessId: number, campaign: Partial<ICampaign>): Promise<ICampaign>;
    list(businessId: number, offset: number, limit: number): Promise<ICampaign[]>;
}
