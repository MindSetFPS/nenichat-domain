import { GoWappResponse } from '../domain/go-wapp-response';
export interface WappConfig {
    baseUrl?: string;
    user?: string;
    password?: string;
    deviceId?: number | string;
    timeoutMs?: number;
}
export interface WappPollOptions {
    retries?: number;
    delayMs?: number;
}
/**
 * Runtime information reported by the gateway's /app/info endpoint.
 */
export interface WappAppInfo {
    version?: string;
    os?: string;
    base_path?: string;
    max_file_size?: number;
    max_video_size?: number;
    max_image_size?: number;
    chatwoot_enabled?: boolean;
}
/**
 * Result of downloading media from a message via the gateway's
 * /message/{message_id}/download endpoint.
 */
export interface WappMediaDownload {
    status?: string;
    message_id?: string;
    media_type?: string;
    filename?: string;
    file_path?: string;
    file_url?: string;
    file_size?: number;
}
/**
 * Error thrown by Wapp when the gateway responds with a non-2xx status.
 * Carries the upstream HTTP status so callers can forward or branch on it.
 */
export declare class WappApiError extends Error {
    readonly status: number;
    constructor(message: string, status: number);
}
/**
 * The container reports its URL based on its internal view, but external access
 * through Traefik requires the specific /api/user/{business_id} path prefix.
 * The gateway (v9.0.1+) keeps the request port in generated URLs; we use the
 * hostname only so the rewritten URL stays reachable through Traefik on the
 * public port (80/443) and never carries the internal :3000.
 */
export declare function normalizeGatewayUrl(rawUrl: string, businessId: number | string): string;
/**
 * Transport client for a per-business GoWapp gateway container
 * (go-whatsapp-web-multidevice). Owns base URL, Basic auth, the X-Device-Id
 * header, request timeouts, and error normalization. Domain-facing adapters
 * (chats, messages) hold an instance and map responses to their own models.
 *
 * @see https://github.com/aldinokemal/go-whatsapp-web-multidevice
 */
export declare class Wapp {
    private readonly baseUrl;
    private readonly user?;
    private readonly password?;
    private readonly deviceId?;
    private readonly timeoutMs;
    constructor(config?: WappConfig);
    private buildHeaders;
    private fetchWithTimeout;
    /**
     * Performs a JSON request against the gateway and returns the standard envelope.
     * @throws {WappApiError} On non-2xx responses.
     * @throws {Error} On network failure or timeout.
     */
    request<T = unknown>(path: string, init?: RequestInit): Promise<GoWappResponse<T>>;
    /**
     * Registers a device slot for the given id. Tolerant by design: failures are
     * logged but not thrown, so callers can proceed to poll for login.
     */
    ensureDeviceSlot(deviceId: number | string): Promise<void>;
    /**
     * Ensures the device slot exists, then polls the login endpoint until it
     * returns a QR code link (rewritten to be reachable through Traefik) or the
     * attempts are exhausted.
     */
    getLoginQrLink(businessId: number, options?: WappPollOptions): Promise<string | null>;
    /**
     * Asks the gateway to attempt to reconnect this device's WhatsApp session.
     * @throws {WappApiError} When the gateway rejects the signal.
     * @throws {Error} On network failure or timeout.
     */
    reconnect(businessId: number | string): Promise<void>;
    /**
     * Returns runtime information about the gateway app (version, OS, limits).
     * Note: container-level endpoint, sent without the X-Device-Id header.
     * @throws {WappApiError} When the gateway rejects the request.
     * @throws {Error} On network failure or timeout.
     */
    getAppInfo(businessId: number | string): Promise<WappAppInfo | null>;
    /**
     * Lists the WhatsApp devices (linked phones) registered under this
     * business's gateway app.
     * @throws {WappApiError} When the gateway rejects the request.
     * @throws {Error} On network failure or timeout.
     */
    getAppDevices(businessId: number | string): Promise<Record<string, unknown>[]>;
    /**
     * Downloads media from a WhatsApp message via the gateway's download endpoint.
     * The gateway fetches media from WhatsApp, saves it to its statics directory,
     * and returns a file_url. The URL is normalized to be reachable through Traefik.
     * @param messageId The WhatsApp message ID.
     * @param phone The chat JID (phone number).
     * @returns The media download result, or null if no file_url is returned.
     * @throws {WappApiError} When the gateway rejects the request.
     * @throws {Error} On network failure or timeout.
     */
    downloadMessageMedia(messageId: string, phone: string): Promise<WappMediaDownload | null>;
    /**
     * Downloads a remote file with retries, resolving its contents as ArrayBuffer.
     * @throws {Error} After exhausting the attempts.
     */
    downloadFile(url: string, options?: WappPollOptions): Promise<ArrayBuffer>;
}
/**
 * Checks whether a GoWapp container answers at all. Lenient by design: any HTTP
 * response means the container is up; only network failures/timeouts mean down.
 * When no explicit baseUrl is given, the gateway origin comes from
 * NEXT_PUBLIC_GOWAPP_HOST_URL and, if a deviceId is provided, the probe targets
 * that business's Traefik route (/api/user/{deviceId}/devices).
 */
export declare function checkWappHealth(baseUrl?: string, options?: {
    deviceId?: number | string;
    user?: string;
    password?: string;
    timeoutMs?: number;
}): Promise<boolean>;
