"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAudienceRepository = void 0;
class SupabaseAudienceRepository {
    constructor(supabase) {
        this._supabase = supabase;
    }
    get supabase() {
        return this._supabase;
    }
    async findById(businessId, id) {
        const { data, error } = await this.supabase
            .from('audiences')
            .select('*')
            .eq('business_id', businessId)
            .eq('id', id)
            .maybeSingle();
        if (error)
            throw error;
        return data;
    }
    async getByIds(businessId, ids) {
        const { data, error } = await this.supabase
            .from('audiences')
            .select('*')
            .eq('business_id', businessId)
            .in('id', ids);
        if (error)
            throw error;
        return data || [];
    }
    async findAll(businessId) {
        const { data, error } = await this.supabase
            .from('audiences')
            .select('*')
            .eq('business_id', businessId)
            .order('name', { ascending: true });
        if (error)
            throw error;
        return data || [];
    }
    async delete(businessId, id) {
        const { error } = await this.supabase
            .from('audiences')
            .delete()
            .eq('business_id', businessId)
            .eq('id', id);
        if (error)
            throw error;
    }
    async create(businessId, audience) {
        const { data, error } = await this.supabase
            .from('audiences')
            .insert({ ...audience, business_id: businessId })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
}
exports.SupabaseAudienceRepository = SupabaseAudienceRepository;
