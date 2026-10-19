"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DokployContainerService = void 0;
const templates_1 = require("./templates");
/**
 * Implementation of IContainerService using Dokploy API.
 */
class DokployContainerService {
    constructor() {
        this.serverUrl = process.env.DOKPLOY_SERVER_URL || "";
        this.apiKey = process.env.DOKPLOY_API_KEY || "";
        this.projectId = process.env.DOKPLOY_PROJECT_ID || "";
        this.environmentId = process.env.DOKPLOY_ENVIRONMENT_ID || "";
        this.wappWebhookBaseUrl = process.env.WAPP_WEBHOOK_BASE_URL || "";
        const missing = [
            ["DOKPLOY_SERVER_URL", this.serverUrl],
            ["DOKPLOY_API_KEY", this.apiKey],
            ["DOKPLOY_PROJECT_ID", this.projectId],
            ["DOKPLOY_ENVIRONMENT_ID", this.environmentId],
            ["WAPP_WEBHOOK_BASE_URL", this.wappWebhookBaseUrl],
        ]
            .filter(([, value]) => !value)
            .map(([name]) => name);
        if (missing.length > 0) {
            throw new Error(`Missing Dokploy environment variables: ${missing.join(", ")}`);
        }
    }
    /**
     * Helper to make POST requests to Dokploy API.
     */
    async post(endpoint, payload) {
        const response = await fetch(`${this.serverUrl}/api/${endpoint}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "x-api-key": this.apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            return await response.json();
        }
        else {
            const errorText = await response.text();
            const message = `Dokploy POST ${endpoint} failed with status ${response.status}: ${errorText}`;
            console.error(message);
            throw new Error(message);
        }
    }
    /**
     * Creates a new compose project in Dokploy.
     */
    async createContainer(businessId) {
        const payload = {
            name: `wapp-${businessId}-compose`,
            description: `wapp-${businessId}-compose`,
            environmentId: this.environmentId,
            composeType: "docker-compose",
            projectId: this.projectId,
            appName: "test-docker-compose",
        };
        const result = await this.post("compose.create", payload);
        return result.composeId;
    }
    /**
     * Deploys a compose project in Dokploy.
     */
    async deployContainer(composeId) {
        return await this.post("compose.deploy", { composeId });
    }
    /**
     * Updates the compose file and environment variables for a project.
     */
    async updateContainerConfiguration(composeId, businessId) {
        const composeFile = this.renderComposeFile(templates_1.INITIAL_COMPOSE_FILE, businessId);
        const env = `BUSINESS_ID=${businessId}
SUPABASE_URL=\${{project.SUPABASE_URL}}
SUPABASE_KEY=\${{project.SUPABASE_KEY}}
`;
        const payload = {
            composeId,
            composeFile,
            sourceType: "raw",
            env
        };
        return await this.post("compose.update", payload);
    }
    /**
     * Deletes a compose project from Dokploy.
     */
    async deleteContainer(composeId) {
        await this.post("compose.delete", { composeId });
    }
    /**
     * Renders a compose template with per-business and environment-derived values.
     * Basic auth matches the credentials the Wapp client uses (GOWAPP_USER / GOWAPP_PASSWORD).
     */
    renderComposeFile(template, businessId) {
        const basicAuth = `${process.env.GOWAPP_USER || "admin"}:${process.env.GOWAPP_PASSWORD || "admin"}`;
        const webhookBaseUrl = this.wappWebhookBaseUrl;
        return template
            .replace(/{business_id}/g, businessId.toString())
            .replace(/{basic_auth}/g, basicAuth)
            .replace(/{webhook_base_url}/g, webhookBaseUrl);
    }
    /**
     * Updates the container configuration with a specific phone.
     */
    async updateContainerWithPhone(composeId, businessId, initialPhone, phoneId) {
        const composeFile = this.renderComposeFile(templates_1.COMPOSE_FILE_WITH_PHONE, businessId)
            .replace(/{initial_phone}/g, initialPhone)
            .replace(/{phone_id}/g, phoneId);
        const env = `BUSINESS_ID=${businessId}
SUPABASE_URL=\${{project.SUPABASE_URL}}
SUPABASE_KEY=\${{project.SUPABASE_KEY}}
`;
        const payload = {
            composeId,
            composeFile,
            sourceType: "raw",
            env
        };
        return await this.post("compose.update", payload);
    }
}
exports.DokployContainerService = DokployContainerService;
