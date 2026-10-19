import { Pool } from 'pg';
import { IContact } from '../../../Contacts/domain/IContact';
import { IAudienceContactRepository } from '../../domain/IAudienceContactRepository';
import { IAudience } from '../../domain/IAudience';
export declare class AudienceContactRepository implements IAudienceContactRepository {
    private pool;
    constructor(pool: Pool);
    private toContact;
    findByAudienceId(businessId: number, audienceId: number): Promise<IContact[]>;
    findAvailableContacts(businessId: number, audienceId: number): Promise<IContact[]>;
    findByContactId(businessId: number, contactId: number): Promise<IAudience[]>;
    private toAudience;
    addContactToAudience(businessId: number, audienceId: number, contactId: number): Promise<void>;
    removeContactFromAudience(businessId: number, audienceId: number, contactId: number): Promise<void>;
    delete(businessId: number, audienceId: number): Promise<void>;
    updateAudienceMembers(businessId: number, audienceId: number, contactIds: number[]): Promise<void>;
}
export declare const audienceContactRepository: AudienceContactRepository;
