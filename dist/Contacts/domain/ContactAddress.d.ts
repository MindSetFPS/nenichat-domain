import { IContactAddress } from './IContactAddress';
export declare class ContactAddress implements IContactAddress {
    id: number;
    contact_id: number;
    address: string;
    label: string | null;
    is_default: boolean;
    created_at: Date;
    updated_at: Date;
    constructor(id: number, contact_id: number, address: string, label: string | null, is_default: boolean, created_at: Date, updated_at: Date);
}
