"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudienceUnselectedContacts = void 0;
/*
* Given an audience, returns a list of contacts that dont belong to that audience.
* @param audienceId - The ID of the audience.
* @returns A list of contacts that dont belong to the audience.
*/
const getAudienceUnselectedContacts = async (audienceId) => {
    try {
        const response = await fetch(`/api/audiences/${audienceId}/available-contacts`);
        if (!response.ok) {
            throw new Error("Failed to fetch available contacts");
        }
        return await response.json();
    }
    catch (error) {
        console.error("Error fetching available contacts:", error);
        return [];
    }
};
exports.getAudienceUnselectedContacts = getAudienceUnselectedContacts;
