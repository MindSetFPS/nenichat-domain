import { Pool } from 'pg';
import { IAudience } from '../../domain/IAudience';
import { IAudienceRepository } from '../../domain/IAudienceRepository';
export declare class AudienceRepository implements IAudienceRepository {
    private pool;
    constructor(pool: Pool);
    private toAudience;
    findById(businessId: number, id: number): Promise<IAudience | null>;
    getByIds(businessId: number, ids: number[]): Promise<IAudience[]>;
    findAll(businessId: number): Promise<IAudience[]>;
    delete(businessId: number, id: number): Promise<void>;
    create(businessId: number, audience: Omit<IAudience, 'id' | 'business_id' | 'created_at'>): Promise<IAudience>;
}
export declare const audienceRepository: AudienceRepository;
