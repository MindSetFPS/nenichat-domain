"use strict";
/**
 * A reusable client function to get contact audiences from the API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactAudiences = void 0;
const getContactAudiences = async (contactId) => {
    try {
        const response = await fetch(`/api/contacts/${contactId}/audiences`);
        if (!response.ok) {
            throw new Error("Failed to fetch contact audiences");
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching contact audiences:", error);
    }
};
exports.getContactAudiences = getContactAudiences;
