import { Contact } from "../../Contacts/domain/Contact";
export declare const getOrCreateChat: (contact: Contact) => Promise<import("../domain/IChat").IChat | null>;
