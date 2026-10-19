"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactAddress = void 0;
class ContactAddress {
    constructor(id, contact_id, address, label, is_default, created_at, updated_at) {
        this.id = id;
        this.contact_id = contact_id;
        this.address = address;
        this.label = label;
        this.is_default = is_default;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
exports.ContactAddress = ContactAddress;
