"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseCampaignRepository = void 0;
const Campaign_1 = require("../../domain/Campaign");
class SupabaseCampaignRepository {
    constructor(supabase) {
        this._supabase = supabase;
    }
    get supabase() {
        return this._supabase;
    }
    mapToCampaign(data) {
        const payload = data.payload || {};
        const { message, audienceIds, interval, day_of_month, day_of_week } = payload;
        return new Campaign_1.Campaign(data.id, data.name, new Date(data.created_at), new Date(data.updated_at), data.frequency_type, payload, data.enabled, interval || data.interval, day_of_month || data.day_of_month, day_of_week || data.day_of_week, data.cron_expression, data.run_at ? new Date(data.run_at) : undefined, data.executed_at ? new Date(data.executed_at) : undefined, data.description, message || data.message, audienceIds ? audienceIds.map(Number) : (data.audienceIds ? data.audienceIds.map(Number) : undefined));
    }
    async findById(businessId, id) {
        const { data, error } = await this.supabase
            .from('scheduled_tasks')
            .select('*')
            .eq('business_id', businessId)
            .eq('task_type', 'message-campaign')
            .eq('id', id)
            .maybeSingle();
        if (error)
            throw error;
        return data ? this.mapToCampaign(data) : null;
    }
    async create(businessId, campaign) {
        const { data, error } = await this.supabase
            .from('scheduled_tasks')
            .insert({
            ...campaign,
            business_id: businessId,
            task_type: 'message-campaign'
        })
            .select()
            .single();
        if (error)
            throw error;
        return this.mapToCampaign(data);
    }
    async update(businessId, campaign) {
        const { data, error } = await this.supabase
            .from('scheduled_tasks')
            .update(campaign)
            .eq('business_id', businessId)
            .eq('task_type', 'message-campaign')
            .eq('id', campaign.id)
            .select()
            .single();
        if (error)
            throw error;
        return this.mapToCampaign(data);
    }
    async list(businessId, offset, limit) {
        const { data, error } = await this.supabase
            .from('scheduled_tasks')
            .select('*')
            .eq('business_id', businessId)
            .eq('task_type', 'message-campaign')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
        if (error)
            throw error;
        return (data || []).map(row => this.mapToCampaign(row));
    }
}
exports.SupabaseCampaignRepository = SupabaseCampaignRepository;
