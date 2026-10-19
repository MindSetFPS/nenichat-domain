"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseContainerRepository = void 0;
/**
 * Implementation of IContainerRepository using Supabase.
 */
class SupabaseContainerRepository {
    constructor(supabase) {
        this._supabase = supabase;
    }
    get supabase() {
        return this._supabase;
    }
    /**
     * Updates the container project ID and external port for a business.
     */
    async updateContainerInfo(businessId, containerId) {
        const { error } = await this.supabase
            .from("whatsapp-containers")
            .update({
            container_id: containerId,
        })
            .eq("business_id", businessId);
        if (error) {
            console.error("Error updating WhatsApp container in Supabase:", error);
            throw error;
        }
    }
    /**
     * Updates the QR code for a business container.
     */
    async updateQrCode(businessId, qrCode) {
        const { data, error } = await this.supabase
            .from("whatsapp-containers")
            .update({
            qr_code_url: qrCode,
            qr_code_updated_at: new Date().toISOString()
        })
            .eq("business_id", businessId);
        if (error) {
            console.error("Error updating QR code in Supabase:", error);
            throw error;
        }
    }
    /**
     * Updates the container state.
     */
    async updateContainerState(businessId, state) {
        const { error } = await this.supabase
            .from("whatsapp-containers")
            .update({
            status: state
        })
            .eq("business_id", businessId);
        if (error) {
            console.error("Error updating container state in Supabase:", error);
            throw error;
        }
    }
    /**
     * Creates or updates a container row in the database.
     */
    async insertContainer(businessId, containerId) {
        const { error } = await this.supabase
            .from("whatsapp-containers")
            .upsert({
            business_id: businessId,
            container_id: containerId,
            status: "empty"
        }, { onConflict: 'business_id' });
        if (error) {
            console.error("Error creating/updating WhatsApp container in Supabase:", error);
            throw error;
        }
    }
    /**
     * Resets a container record to 'none' state (clears container_id, QR, phone_id).
     * Uses update instead of delete to avoid RLS restrictions on deletes.
     */
    async resetContainer(businessId) {
        const { error } = await this.supabase
            .from("whatsapp-containers")
            .update({
            container_id: null,
            qr_code_url: null,
            qr_code_updated_at: null,
            phone_id: null,
            status: 'none'
        })
            .eq("business_id", businessId);
        if (error) {
            console.error("Error resetting WhatsApp container in Supabase:", error);
            throw error;
        }
    }
    /**
     * Gets a container by business ID.
     */
    async getContainerByBusinessId(businessId) {
        const { data, error } = await this.supabase
            .from("whatsapp-containers")
            .select("*")
            .eq("business_id", businessId)
            .single();
        if (error && error.code !== "PGRST116") { // PGRST116 is code for "no rows found"
            console.error("Error fetching container by business ID:", error);
            throw error;
        }
        return data || null;
    }
}
exports.SupabaseContainerRepository = SupabaseContainerRepository;
