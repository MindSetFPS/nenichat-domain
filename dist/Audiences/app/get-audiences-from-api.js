"use strict";
// A reusable client function to fetch audiences from the API
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudiences = void 0;
const getAudiences = async () => {
    try {
        const response = await fetch("/api/audiences");
        if (!response.ok) {
            throw new Error("Failed to fetch audiences");
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching audiences:", error);
    }
};
exports.getAudiences = getAudiences;
