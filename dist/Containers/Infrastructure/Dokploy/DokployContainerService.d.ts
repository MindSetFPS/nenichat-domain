import { IContainerService } from "../../Domain/IContainerService";
/**
 * Implementation of IContainerService using Dokploy API.
 */
export declare class DokployContainerService implements IContainerService {
    private readonly serverUrl;
    private readonly apiKey;
    private readonly projectId;
    private readonly environmentId;
    private readonly wappWebhookBaseUrl;
    constructor();
    /**
     * Helper to make POST requests to Dokploy API.
     */
    private post;
    /**
     * Creates a new compose project in Dokploy.
     */
    createContainer(businessId: number): Promise<string>;
    /**
     * Deploys a compose project in Dokploy.
     */
    deployContainer(composeId: string): Promise<any>;
    /**
     * Updates the compose file and environment variables for a project.
     */
    updateContainerConfiguration(composeId: string, businessId: number): Promise<any>;
    /**
     * Deletes a compose project from Dokploy.
     */
    deleteContainer(composeId: string): Promise<void>;
    /**
     * Renders a compose template with per-business and environment-derived values.
     * Basic auth matches the credentials the Wapp client uses (GOWAPP_USER / GOWAPP_PASSWORD).
     */
    private renderComposeFile;
    /**
     * Updates the container configuration with a specific phone.
     */
    updateContainerWithPhone(composeId: string, businessId: number, initialPhone: string, phoneId: string): Promise<any>;
}
