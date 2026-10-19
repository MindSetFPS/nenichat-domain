import { ICampaignMessage } from './ICampaignMessage';
export declare class CampaignMessage implements ICampaignMessage {
    id: number;
    campaign_id: string;
    content: string;
    constructor(id: number, campaign_id: string, content: string);
}
