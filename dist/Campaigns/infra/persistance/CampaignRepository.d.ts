import { Pool } from "pg";
import { ICampaign } from "../../domain/ICampaign";
import { ICampaignRepository } from "../../domain/ICampaignRepository";
export declare class CampaignRepository implements ICampaignRepository {
    private pool;
    constructor(pool: Pool);
    private toCampaign;
    findById(businessId: number, id: string): Promise<ICampaign | null>;
    create(businessId: number, campaign: Partial<ICampaign>): Promise<ICampaign>;
    update(businessId: number, campaign: Partial<ICampaign>): Promise<ICampaign>;
    list(businessId: number, offset: number, limit: number): Promise<ICampaign[]>;
}
export declare const campaignRepository: CampaignRepository;
