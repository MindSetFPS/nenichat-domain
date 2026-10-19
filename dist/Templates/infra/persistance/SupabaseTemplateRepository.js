"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseTemplateRepository = void 0;
const Template_1 = require("../../domain/Template");
class SupabaseTemplateRepository {
    constructor(supabase) {
        this._supabase = supabase;
    }
    mapToTemplate(data) {
        return new Template_1.Template({
            id: data.id,
            business_id: data.business_id,
            name: data.name,
            message: data.message,
            created_at: data.created_at,
            updated_at: data.updated_at,
        });
    }
    async list(businessId) {
        const { data, error } = await this._supabase
            .from('message_templates')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return (data || []).map(row => this.mapToTemplate(row));
    }
    async findById(businessId, id) {
        const { data, error } = await this._supabase
            .from('message_templates')
            .select('*')
            .eq('business_id', businessId)
            .eq('id', id)
            .maybeSingle();
        if (error)
            throw error;
        return data ? this.mapToTemplate(data) : null;
    }
    async create(businessId, data) {
        const { data: created, error } = await this._supabase
            .from('message_templates')
            .insert({ business_id: businessId, name: data.name, message: data.message })
            .select()
            .single();
        if (error)
            throw error;
        return this.mapToTemplate(created);
    }
    async update(businessId, id, data) {
        const { data: updated, error } = await this._supabase
            .from('message_templates')
            .update({ name: data.name, message: data.message, updated_at: new Date().toISOString() })
            .eq('business_id', businessId)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return this.mapToTemplate(updated);
    }
    async delete(businessId, id) {
        const { error } = await this._supabase
            .from('message_templates')
            .delete()
            .eq('business_id', businessId)
            .eq('id', id);
        if (error)
            throw error;
    }
}
exports.SupabaseTemplateRepository = SupabaseTemplateRepository;
