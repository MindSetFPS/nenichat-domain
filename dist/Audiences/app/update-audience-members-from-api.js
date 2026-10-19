"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateAudienceMembers;
/**
 * a resuable client function that takes a list of contact ids and an audience id and updates the audience members
 * @param contactIds list of contact ids
 * @param audienceId audience id
 * @returns json response
 */
async function updateAudienceMembers(contactIds, audienceId) {
    const response = await fetch(`/api/audiences/${audienceId}/members`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactIds }),
    });
    if (!response.ok) {
        throw new Error("Failed to save audience members");
    }
    return response.json();
}
