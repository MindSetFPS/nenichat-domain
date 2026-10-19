import { Pool } from 'pg';
import { IContactAddress } from '../../domain/IContactAddress';
import { IContactAddressRepository } from '../../domain/IContactAddressRepository';
export declare class ContactAddressRepository implements IContactAddressRepository {
    private pool;
    constructor(pool: Pool);
    private mapRowToContactAddress;
    getById(id: number): Promise<IContactAddress | null>;
    getByContactId(contactId: number): Promise<IContactAddress[]>;
    create(address: Omit<IContactAddress, 'id' | 'created_at' | 'updated_at'>): Promise<IContactAddress>;
    update(id: number, updates: Partial<IContactAddress>): Promise<IContactAddress | null>;
    delete(id: number): Promise<boolean>;
    setDefault(id: number, contactId: number): Promise<boolean>;
}
