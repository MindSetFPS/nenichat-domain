import { SupabaseClient } from "@supabase/supabase-js";
import { IContact } from "../../domain/IContact";
import { IContactRepository } from "../../domain/IContactRepository";
import IContactWithLastMessage from "../../app/dtos/IContactWithLastMessage";
export declare class SupabaseContactRepository implements IContactRepository {
    private _supabase;
    constructor(supabase: SupabaseClient);
    get supabase(): SupabaseClient;
    /**
     * Maps a database row (with optional joined phone_numbers) to a Contact domain object.
     */
    private mapToContact;
    /**
     * Looks up or creates a row in the global `phone_numbers` table and returns its id.
     * @param phoneNumber The phone number string to look up or insert.
     * @returns The id of the phone_numbers row.
     */
    private getOrCreatePhoneNumberId;
    findById(businessId: number, id: number): Promise<IContact | null>;
    findByPhoneNumber(businessId: number, phoneNumber: string): Promise<IContact | null>;
    findByLid(businessId: number, lid: string): Promise<IContact | null>;
    findByPhoneNumberOrLid(businessId: number, phoneOrLid: string): Promise<IContact | null>;
    findBatchByPhoneOrLid(businessId: number, lookups: {
        value: string;
        is_lid: boolean;
    }[]): Promise<IContact[]>;
    findMe(businessId: number): Promise<IContact | null>;
    save(contact: Partial<IContact>): Promise<IContact>;
    saveBatch(contacts: Partial<IContact>[]): Promise<void>;
    list(businessId: number, offset: number, limit: number): Promise<IContact[]>;
    findMergeCandidates(businessId: number, offset: number, limit: number): Promise<{
        contacts: IContact[];
        total: number;
    }>;
    mergeContacts(businessId: number, primaryContactId: number, secondaryContactIds: number[]): Promise<void>;
    getOrCreateContact(businessId: number, contactId: string): Promise<IContact>;
    setMe(businessId: number, userId: number): Promise<IContact>;
    findRecentContacts(businessId: number, limit: number): Promise<IContact[]>;
    getContactsWithLastMessage(businessId: number, offset: number, limit: number): Promise<IContactWithLastMessage[]>;
    hideContact(businessId: number, contactIdToHide: number): Promise<void>;
    getHiddenContacts(businessId: number, offset: number, limit: number): Promise<IContact[]>;
    isContactHidden(businessId: number, contactId: number): Promise<boolean>;
    unhideContact(businessId: number, contactId: number): Promise<void>;
    count(businessId: number): Promise<number>;
    search(businessId: number, query: string, limit: number): Promise<IContact[]>;
}
