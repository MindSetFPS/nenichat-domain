"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wapp = exports.WappApiError = void 0;
exports.normalizeGatewayUrl = normalizeGatewayUrl;
exports.checkWappHealth = checkWappHealth;
const DEFAULT_BASE_URL = 'http://localhost:3000';
const DEFAULT_TIMEOUT_MS = 15000;
const QR_POLL_RETRIES = 10;
const QR_POLL_DELAY_MS = 5000;
const DOWNLOAD_RETRIES = 5;
const DOWNLOAD_DELAY_MS = 2000;
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function isDebugEnabled() {
    return process.env.WAPP_DEBUG === 'true';
}
/**
 * Error thrown by Wapp when the gateway responds with a non-2xx status.
 * Carries the upstream HTTP status so callers can forward or branch on it.
 */
class WappApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'WappApiError';
        this.status = status;
    }
}
exports.WappApiError = WappApiError;
/**
 * The container reports its URL based on its internal view, but external access
 * through Traefik requires the specific /api/user/{business_id} path prefix.
 * The gateway (v9.0.1+) keeps the request port in generated URLs; we use the
 * hostname only so the rewritten URL stays reachable through Traefik on the
 * public port (80/443) and never carries the internal :3000.
 */
function normalizeGatewayUrl(rawUrl, businessId) {
    const prefix = `/api/user/${businessId}`;
    if (!rawUrl.includes('/statics/') || rawUrl.includes(prefix)) {
        return rawUrl;
    }
    try {
        const urlObj = new URL(rawUrl);
        return `${urlObj.protocol}//${urlObj.hostname}${prefix}${urlObj.pathname}${urlObj.search}`;
    }
    catch (e) {
        console.error("Error parsing gateway URL:", e);
        return rawUrl;
    }
}
/**
 * Rewrites the gateway's QR link to be reachable through Traefik, preserving the
 * /api/user/{business_id} prefix and dropping any internal port.
 */
function resolveQrImageUrl(rawUrl, businessId) {
    return normalizeGatewayUrl(rawUrl, businessId);
}
/**
 * Transport client for a per-business GoWapp gateway container
 * (go-whatsapp-web-multidevice). Owns base URL, Basic auth, the X-Device-Id
 * header, request timeouts, and error normalization. Domain-facing adapters
 * (chats, messages) hold an instance and map responses to their own models.
 *
 * @see https://github.com/aldinokemal/go-whatsapp-web-multidevice
 */
class Wapp {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_GOWAPP_HOST_URL || DEFAULT_BASE_URL;
        this.user = config.user ?? process.env.GOWAPP_USER;
        this.password = config.password ?? process.env.GOWAPP_PASSWORD;
        this.deviceId = config.deviceId;
        this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    }
    buildHeaders(deviceIdOverride) {
        const headers = {};
        if (this.user && this.password) {
            headers['Authorization'] = `Basic ${btoa(`${this.user}:${this.password}`)}`;
        }
        const deviceId = deviceIdOverride ?? this.deviceId;
        if (deviceId) {
            headers['X-Device-Id'] = `${deviceId}`;
        }
        return headers;
    }
    async fetchWithTimeout(url, init = {}) {
        return fetch(url, { ...init, signal: AbortSignal.timeout(this.timeoutMs) });
    }
    /**
     * Performs a JSON request against the gateway and returns the standard envelope.
     * @throws {WappApiError} On non-2xx responses.
     * @throws {Error} On network failure or timeout.
     */
    async request(path, init = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            'Content-Type': 'application/json',
            ...this.buildHeaders(),
            ...init.headers,
        };
        if (isDebugEnabled()) {
            console.log(`[Wapp] ${init.method ?? 'GET'} ${url}`);
        }
        const response = await this.fetchWithTimeout(url, { ...init, headers });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const detail = errorData.message || errorData.error || `status ${response.status}`;
            console.warn(`[Wapp] ${init.method ?? 'GET'} ${url} failed: ${detail}`);
            throw new WappApiError(`GoWapp API request failed (${response.status}): ${detail}`, response.status);
        }
        if (isDebugEnabled()) {
            const clone = response.clone();
            clone.text().then(t => console.log(`[Wapp] Response: ${t.slice(0, 500)}`)).catch(() => { });
        }
        return response.json();
    }
    /**
     * Registers a device slot for the given id. Tolerant by design: failures are
     * logged but not thrown, so callers can proceed to poll for login.
     */
    async ensureDeviceSlot(deviceId) {
        const url = `${this.baseUrl}/api/user/${deviceId}/devices`;
        console.log(`Creating device slot at: ${url}`);
        try {
            await this.request(`/api/user/${deviceId}/devices`, {
                method: 'POST',
                body: JSON.stringify({ device_id: deviceId }),
                headers: this.buildHeaders(deviceId),
            });
            console.log('Device slot created successfully');
        }
        catch (err) {
            console.warn('Failed to create device slot (continuing):', err);
        }
    }
    /**
     * Ensures the device slot exists, then polls the login endpoint until it
     * returns a QR code link (rewritten to be reachable through Traefik) or the
     * attempts are exhausted.
     */
    async getLoginQrLink(businessId, options) {
        const retries = options?.retries ?? QR_POLL_RETRIES;
        const delayMs = options?.delayMs ?? QR_POLL_DELAY_MS;
        await this.ensureDeviceSlot(businessId);
        const path = `/api/user/${businessId}/devices/${businessId}/login`;
        let qrCodeImageURL = "";
        if (isDebugEnabled()) {
            console.log(`Polling for QR code at: ${this.baseUrl}${path}`);
        }
        for (let i = 0; i < retries; i++) {
            try {
                if (isDebugEnabled()) {
                    console.log(`Attempt ${i + 1} to fetch QR from ${this.baseUrl}${path}`);
                }
                const response = await this.fetchWithTimeout(`${this.baseUrl}${path}`, {
                    headers: this.buildHeaders(businessId),
                });
                if (!response.ok) {
                    console.warn(`Attempt ${i + 1} server returned status ${response.status}`);
                }
                else {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const data = await response.json();
                        if (data && data.results && (data.results.qr_link || data.results.qr_image_link)) {
                            qrCodeImageURL = resolveQrImageUrl(data.results.qr_link || data.results.qr_image_link || "", businessId);
                            break;
                        }
                    }
                    else {
                        const text = await response.text();
                        console.warn(`Attempt ${i + 1} received non-JSON response:`, text.substring(0, 100));
                    }
                }
            }
            catch (err) {
                console.error(`Attempt ${i + 1} failed:`, err);
            }
            await wait(delayMs);
        }
        return qrCodeImageURL || null;
    }
    /**
     * Asks the gateway to attempt to reconnect this device's WhatsApp session.
     * @throws {WappApiError} When the gateway rejects the signal.
     * @throws {Error} On network failure or timeout.
     */
    async reconnect(businessId) {
        await this.request(`/api/user/${businessId}/app/reconnect`, {
            headers: this.buildHeaders(businessId),
        });
    }
    /**
     * Returns runtime information about the gateway app (version, OS, limits).
     * Note: container-level endpoint, sent without the X-Device-Id header.
     * @throws {WappApiError} When the gateway rejects the request.
     * @throws {Error} On network failure or timeout.
     */
    async getAppInfo(businessId) {
        const response = await this.request(`/api/user/${businessId}/app/info`);
        return response.results ?? null;
    }
    /**
     * Lists the WhatsApp devices (linked phones) registered under this
     * business's gateway app.
     * @throws {WappApiError} When the gateway rejects the request.
     * @throws {Error} On network failure or timeout.
     */
    async getAppDevices(businessId) {
        const response = await this.request(`/api/user/${businessId}/app/devices`, {
            headers: this.buildHeaders(businessId),
        });
        return response.results ?? [];
    }
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
    async downloadMessageMedia(messageId, phone) {
        const path = this.deviceId
            ? `/api/user/${this.deviceId}/message/${messageId}/download?phone=${encodeURIComponent(phone)}`
            : `/message/${messageId}/download?phone=${encodeURIComponent(phone)}`;
        const response = await this.request(path);
        const result = response.results ?? null;
        if (result?.file_url && this.deviceId) {
            result.file_url = normalizeGatewayUrl(result.file_url, this.deviceId);
        }
        return result;
    }
    /**
     * Downloads a remote file with retries, resolving its contents as ArrayBuffer.
     * @throws {Error} After exhausting the attempts.
     */
    async downloadFile(url, options) {
        const retries = options?.retries ?? DOWNLOAD_RETRIES;
        const delayMs = options?.delayMs ?? DOWNLOAD_DELAY_MS;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    return await response.arrayBuffer();
                }
                console.warn(`Attempt ${attempt} to download file failed with status ${response.status}`);
            }
            catch (e) {
                console.warn(`Attempt ${attempt} to download file error:`, e);
            }
            await wait(delayMs);
        }
        throw new Error(`Failed to download file after ${retries} attempts from ${url}`);
    }
}
exports.Wapp = Wapp;
/**
 * Checks whether a GoWapp container answers at all. Lenient by design: any HTTP
 * response means the container is up; only network failures/timeouts mean down.
 * When no explicit baseUrl is given, the gateway origin comes from
 * NEXT_PUBLIC_GOWAPP_HOST_URL and, if a deviceId is provided, the probe targets
 * that business's Traefik route (/api/user/{deviceId}/devices).
 */
async function checkWappHealth(baseUrl, options) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options?.timeoutMs ?? 5000);
    try {
        const user = options?.user ?? process.env.GOWAPP_USER ?? 'admin';
        const password = options?.password ?? process.env.GOWAPP_PASSWORD ?? 'admin';
        const origin = baseUrl || process.env.NEXT_PUBLIC_GOWAPP_HOST_URL || DEFAULT_BASE_URL;
        const target = options?.deviceId != null
            ? `${origin}/api/user/${options.deviceId}/devices`
            : `${origin}/devices`;
        await fetch(target, {
            headers: { 'Authorization': `Basic ${btoa(`${user}:${password}`)}` },
            signal: controller.signal,
        });
        return true;
    }
    catch {
        return false;
    }
    finally {
        clearTimeout(timer);
    }
}
