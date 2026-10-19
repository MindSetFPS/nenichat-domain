"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJidKind = getJidKind;
exports.jidIsPhoneNumber = jidIsPhoneNumber;
exports.jidIsGroup = jidIsGroup;
exports.jidIsLid = jidIsLid;
exports.jidToNumeric = jidToNumeric;
exports.phoneNumberToJid = phoneNumberToJid;
exports.isJid = isJid;
/**
 * Detects the kind of JID based on its suffix.
 *
 * @param {string} jid - The JID string to analyze.
 * @returns {JidKind} The kind of JID detected.
 */
function getJidKind(jid) {
    if (!jid)
        return 'unknown';
    if (jid.endsWith('@s.whatsapp.net')) {
        return 'contact';
    }
    if (jid.endsWith('@g.us')) {
        return 'group';
    }
    if (jid.endsWith('@lid')) {
        return 'lid';
    }
    return 'unknown';
}
function jidIsPhoneNumber(jid) {
    return getJidKind(jid) === 'contact';
}
function jidIsGroup(jid) {
    return getJidKind(jid) === 'group';
}
function jidIsLid(jid) {
    return getJidKind(jid) === 'lid';
}
/**
 * Extracts the numeric part (phone number) from a JID.
 * Removes the suffix and any device identifiers (e.g. 521...:1@s.whatsapp.net -> 521...)
 */
function jidToNumeric(jid) {
    return jid.split('@')[0].split(':')[0];
}
/**
 * Converts a phone number to a WhatsApp JID by appending the suffix.
 * If the input is already a JID, returns it as-is.
 * @param phoneNumber - The phone number (e.g. "521234567890")
 * @returns The full JID (e.g. "521234567890@s.whatsapp.net")
 */
function phoneNumberToJid(phoneNumber) {
    if (phoneNumber.includes('@')) {
        return phoneNumber;
    }
    return `${phoneNumber}@s.whatsapp.net`;
}
/**
 * Checks if a string is a formatted WhatsApp JID.
 */
function isJid(jid) {
    return jid.includes('@');
}
