import { IContainerRepository } from "../../Domain/IContainerRepository";
import { SupabaseClient } from "@supabase/supabase-js";
/**
 * Implementation of IContainerRepository using Supabase.
 */
export declare class SupabaseContainerRepository implements IContainerRepository {
    private _supabase;
    constructor(supabase: SupabaseClient);
    get supabase(): SupabaseClient;
    /**
     * Updates the container project ID and external port for a business.
     */
    updateContainerInfo(businessId: number, containerId: string): Promise<void>;
    /**
     * Updates the QR code for a business container.
     */
    updateQrCode(businessId: number, qrCode: string): Promise<void>;
    /**
     * Updates the container state.
     */
    updateContainerState(businessId: number, state: string): Promise<void>;
    /**
     * Creates or updates a container row in the database.
     */
    insertContainer(businessId: number, containerId: string): Promise<void>;
    /**
     * Resets a container record to 'none' state (clears container_id, QR, phone_id).
     * Uses update instead of delete to avoid RLS restrictions on deletes.
     */
    resetContainer(businessId: number): Promise<void>;
    /**
     * Gets a container by business ID.
     */
    getContainerByBusinessId(businessId: number): Promise<any | null>;
}
