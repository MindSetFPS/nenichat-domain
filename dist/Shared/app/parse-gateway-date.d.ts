/**
 * Parses a date value coming from the WhatsApp gateway. Handles RFC3339/ISO strings
 * and epoch seconds or milliseconds, and returns null when the value is missing or
 * unparseable. Never fabricates a date, so callers can tell "unknown" from a real time.
 */
export declare function parseGatewayDate(value: unknown): Date | null;
