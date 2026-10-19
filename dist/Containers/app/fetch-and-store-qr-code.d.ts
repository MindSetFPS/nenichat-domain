import { SupabaseClient } from '@supabase/supabase-js';
import { IContainerRepository } from '../Domain/IContainerRepository';
/**
 * Polls the WhatsApp gateway for a fresh login QR code and persists it:
 * uploads the image to the Supabase Storage `qr` bucket, saves its public
 * URL via the repository, and marks the container as deployed. On any
 * failure the container is marked as errored.
 *
 * @returns {Promise<boolean>} Whether a QR code was fetched and stored.
 */
export declare function fetchAndStoreQrCode(supabase: SupabaseClient, repository: IContainerRepository, businessId: number): Promise<boolean>;
