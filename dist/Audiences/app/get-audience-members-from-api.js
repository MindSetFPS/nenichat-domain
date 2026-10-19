"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudienceMembers = void 0;
/*
* Given an audience, returns a list of contacts that belong to that audience.
* @param audienceId - The ID of the audience.
* @returns A list of contacts that belong to the audience.
*/
const getAudienceMembers = async (audienceId) => {
    const response = await fetch(`/api/audiences/${audienceId}/members`);
    if (!response.ok) {
        throw new Error("Failed to fetch audience members");
    }
    const data = await response.json();
    return data;
};
exports.getAudienceMembers = getAudienceMembers;
