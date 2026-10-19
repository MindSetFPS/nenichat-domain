"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
class Contact {
    constructor(id, businessId, phoneNumberId, phoneNumber, lid, username, pushname, contactName, is_user, is_hidden, createdAt, updatedAt) {
        this.id = id;
        this.business_id = businessId;
        this.phone_number_id = phoneNumberId;
        this.phone_number = phoneNumber;
        this.lid = lid;
        this.username = username;
        this.pushname = pushname;
        this.contact_name = contactName;
        this.is_user = is_user;
        this.is_hidden = is_hidden;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
    }
}
exports.Contact = Contact;
