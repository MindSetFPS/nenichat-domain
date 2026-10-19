"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactAudiences = updateContactAudiences;
/**
 * A function that updates de audiences of a contact.
 * @param contactId The id of the contact.
 * @param audienceUpdates The ids of the audiences to update.
 */
async function updateContactAudiences(contactId, audienceUpdates) {
    const response = await fetch(`/api/contacts/${contactId}/audiences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audienceUpdates: audienceUpdates }),
    });
    if (!response.ok) {
        throw new Error('Failed to update contact audiences');
    }
    return response.json();
}
