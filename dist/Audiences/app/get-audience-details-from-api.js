"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudienceDetails = void 0;
/*
* Given an audience ID, returns the audience details.
* @param id - The ID of the audience.
* @returns The audience details.
*/
const getAudienceDetails = async (id) => {
    const response = await fetch(`/api/audiences/${id}`);
    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new Error("Failed to fetch audience details");
    }
    const data = await response.json();
    return data;
};
exports.getAudienceDetails = getAudienceDetails;
