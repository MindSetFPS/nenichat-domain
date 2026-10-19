/**
 * Represents the different types of WhatsApp identifiers.
 */
export type JidKind = 'contact' | 'group' | 'lid' | 'unknown';
/**
 * Detects the kind of JID based on its suffix.
 *
 * @param {string} jid - The JID string to analyze.
 * @returns {JidKind} The kind of JID detected.
 */
export declare function getJidKind(jid: string): JidKind;
export declare function jidIsPhoneNumber(jid: string): boolean;
export declare function jidIsGroup(jid: string): boolean;
export declare function jidIsLid(jid: string): boolean;
/**
 * Extracts the numeric part (phone number) from a JID.
 * Removes the suffix and any device identifiers (e.g. 521...:1@s.whatsapp.net -> 521...)
 */
export declare function jidToNumeric(jid: string): string;
/**
 * Converts a phone number to a WhatsApp JID by appending the suffix.
 * If the input is already a JID, returns it as-is.
 * @param phoneNumber - The phone number (e.g. "521234567890")
 * @returns The full JID (e.g. "521234567890@s.whatsapp.net")
 */
export declare function phoneNumberToJid(phoneNumber: string): string;
/**
 * Checks if a string is a formatted WhatsApp JID.
 */
export declare function isJid(jid: string): boolean;
