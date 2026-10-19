import { SupabaseClient } from '@supabase/supabase-js';
import { IContact } from '../../../Contacts/domain/IContact';
import { IAudience } from '../../domain/IAudience';
import { IAudienceContactRepository } from '../../domain/IAudienceContactRepository';
export declare class SupabaseAudienceContactRepository implements IAudienceContactRepository {
    private _supabase;
    constructor(supabase: SupabaseClient);
    get supabase(): SupabaseClient;
    findByAudienceId(businessId: number, audienceId: number): Promise<IContact[]>;
    findByContactId(businessId: number, contactId: number): Promise<IAudience[]>;
    findAvailableContacts(businessId: number, audienceId: number): Promise<IContact[]>;
    addContactToAudience(businessId: number, audienceId: number, contactId: number): Promise<void>;
    removeContactFromAudience(businessId: number, audienceId: number, contactId: number): Promise<void>;
    delete(businessId: number, audienceId: number): Promise<void>;
    updateAudienceMembers(businessId: number, audienceId: number, contactIds: number[]): Promise<void>;
}
