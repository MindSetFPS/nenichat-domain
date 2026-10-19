import { Pool } from 'pg';
import { IContact } from '../../domain/IContact';
import { IContactRepository } from '../../domain/IContactRepository';
import IContactWithLastMessage from '../../app/dtos/IContactWithLastMessage';
export declare class ContactRepository implements IContactRepository {
    private pool;
    constructor(pool: Pool);
    /**
     * Maps a query row to a Contact domain object.
     * Expects the row to include `phone_number` from the phone_numbers JOIN.
     */
    private mapRow;
    /**
     * Looks up or creates a row in the global `phone_numbers` table.
     * @param client An active pg PoolClient (to participate in a transaction).
     * @param phoneNumber The phone number string.
     * @returns The id of the phone_numbers row.
     */
    private getOrCreatePhoneNumberId;
    findById(businessId: number, id: number): Promise<IContact | null>;
    findByPhoneNumber(businessId: number, phoneNumber: string): Promise<IContact | null>;
    findByLid(businessId: number, lid: string): Promise<IContact | null>;
    findMe(businessId: number): Promise<IContact | null>;
    save(contact: Partial<IContact>): Promise<IContact>;
    saveBatch(contacts: Partial<IContact>[]): Promise<void>;
    list(businessId: number, offset: number, limit: number): Promise<IContact[]>;
    search(businessId: number, query: string, limit: number): Promise<IContact[]>;
    findMergeCandidates(businessId: number, offset: number, limit: number): Promise<{
        contacts: IContact[];
        total: number;
    }>;
    getOrCreateContact(businessId: number, contactId: string): Promise<IContact>;
    setMe(businessId: number, userId: number): Promise<IContact>;
    mergeContacts(businessId: number, primaryContactId: number, secondaryContactIds: number[]): Promise<void>;
    findRecentContacts(businessId: number, limit: number): Promise<IContact[]>;
    getContactsWithLastMessage(businessId: number, offset: number, limit: number): Promise<IContactWithLastMessage[]>;
    hideContact(businessId: number, contactIdToHide: number): Promise<void>;
    getHiddenContacts(businessId: number, offset: number, limit: number): Promise<IContact[]>;
    isContactHidden(businessId: number, contactId: number): Promise<boolean>;
    unhideContact(businessId: number, contactIdToUnhide: number): Promise<void>;
    count(businessId: number): Promise<number>;
}
export declare const contactRepository: ContactRepository;
