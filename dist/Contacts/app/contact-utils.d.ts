import { IContact } from "../domain/IContact";
export type ContactIdentifier = string | number | IContact | undefined | null;
export declare function findContactById(contacts: IContact[], id: string | number): IContact | undefined;
export declare function findContactByLid(contacts: IContact[], lid: string): IContact | undefined;
export declare function findContactByPhone(contacts: IContact[], phone: string): IContact | undefined;
export declare function normalizeContact(contacts: IContact[], value: ContactIdentifier): IContact | undefined;
