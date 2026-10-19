"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAudienceContactRepository = void 0;
class SupabaseAudienceContactRepository {
    constructor(supabase) {
        this._supabase = supabase;
    }
    get supabase() {
        return this._supabase;
    }
    async findByAudienceId(businessId, audienceId) {
        const { data, error } = await this.supabase
            .from('audience_contacts')
            .select('contacts(*)')
            .eq('audience_id', audienceId)
            .eq('contacts.business_id', businessId);
        if (error)
            throw error;
        return (data || []).map((row) => row.contacts).filter(Boolean);
    }
    async findByContactId(businessId, contactId) {
        const { data, error } = await this.supabase
            .from('audience_contacts')
            .select('audiences(*)')
            .eq('contact_id', contactId)
            .eq('audiences.business_id', businessId);
        if (error)
            throw error;
        return (data || []).map((row) => row.audiences).filter(Boolean);
    }
    async findAvailableContacts(businessId, audienceId) {
        const { data: contactsInAudience, error: fetchError } = await this.supabase
            .from('audience_contacts')
            .select('contact_id')
            .eq('audience_id', audienceId);
        if (fetchError)
            throw fetchError;
        const excludedIds = (contactsInAudience || []).map(r => r.contact_id);
        let query = this.supabase
            .from('contacts')
            .select('*')
            .eq('business_id', businessId);
        if (excludedIds.length > 0) {
            query = query.not('id', 'in', `(${excludedIds.join(',')})`);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data || [];
    }
    async addContactToAudience(businessId, audienceId, contactId) {
        const { error } = await this.supabase
            .from('audience_contacts')
            .insert({ audience_id: audienceId, contact_id: contactId });
        if (error)
            throw error;
    }
    async removeContactFromAudience(businessId, audienceId, contactId) {
        const { error } = await this.supabase
            .from('audience_contacts')
            .delete()
            .eq('audience_id', audienceId)
            .eq('contact_id', contactId);
        if (error)
            throw error;
    }
    async delete(businessId, audienceId) {
        const { error } = await this.supabase
            .from('audience_contacts')
            .delete()
            .eq('audience_id', audienceId);
        if (error)
            throw error;
    }
    async updateAudienceMembers(businessId, audienceId, contactIds) {
        const { error: deleteError } = await this.supabase
            .from('audience_contacts')
            .delete()
            .eq('audience_id', audienceId);
        if (deleteError)
            throw deleteError;
        if (contactIds.length > 0) {
            const { error: insertError } = await this.supabase
                .from('audience_contacts')
                .insert(contactIds.map(cid => ({ audience_id: audienceId, contact_id: cid })));
            if (insertError)
                throw insertError;
        }
    }
}
exports.SupabaseAudienceContactRepository = SupabaseAudienceContactRepository;
