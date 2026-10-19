import { IContact } from "../domain/IContact";
import { IChat } from "../../Chats/domain/IChat";
/**
 * Gets the most appropriate name or identifier for a contact or chat.
 *
 * Logic priority:
 * 1. Contact's manual name (contact_name)
 * 2. Chat's name (groups only — the group subject lives on the chat)
 * 3. Contact's pushname (WhatsApp display name)
 * 4. Contact's phone number
 * 5. Contact's LID
 * 6. Fallback to string if input is just an identifier string
 *
 * @param contact - The contact object or a string identifier
 * @param chat - The chat; its name is used only for groups, since individual
 *               chats must resolve to the contact's own name.
 * @returns {string} The resolved name or identifier
 */
export declare function getContactName(contact?: IContact | string | null, chat?: IChat | null): string;
/**
 * Gets the phone number or LID for a contact.
 */
export declare function getContactPhone(contact: IContact | undefined | null): string;
