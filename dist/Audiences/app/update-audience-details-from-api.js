"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateAudienceDetailsFromApi;
async function updateAudienceDetailsFromApi(audienceId, name, description) {
    const response = await fetch(`/api/audiences/${audienceId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
    });
    return response;
}
