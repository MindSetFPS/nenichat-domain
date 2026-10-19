"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findContactById = findContactById;
exports.findContactByLid = findContactByLid;
exports.findContactByPhone = findContactByPhone;
exports.normalizeContact = normalizeContact;
function findContactById(contacts, id) {
    return contacts.find(c => c.id?.toString() === id?.toString());
}
function findContactByLid(contacts, lid) {
    return contacts.find(c => c.lid === lid);
}
function findContactByPhone(contacts, phone) {
    return contacts.find(c => c.phone_number === phone);
}
function normalizeContact(contacts, value) {
    if (!value)
        return undefined;
    if (typeof value === 'object')
        return value;
    const strValue = String(value);
    return (findContactById(contacts, strValue) ||
        findContactByLid(contacts, strValue) ||
        findContactByPhone(contacts, strValue) ||
        undefined);
}
