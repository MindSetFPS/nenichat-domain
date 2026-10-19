import { TaskPayload } from '../../Shared/domain/scheduled-task';
import { ICampaign } from './ICampaign';
export declare class Campaign implements ICampaign {
    id: number;
    name: string;
    description?: string;
    frequency_type: 'once' | 'recurring';
    interval?: string;
    day_of_month?: string;
    day_of_week?: string;
    cron_expression?: string | undefined;
    run_at?: Date;
    executed_at?: Date;
    message?: string;
    created_at: Date;
    audienceIds?: number[];
    payload: {} | TaskPayload;
    enabled: boolean;
    updated_at: Date;
    constructor(id: number, name: string, created_at: Date, updated_at: Date, frequency_type: 'once' | 'recurring', payload: {} | TaskPayload, enabled: boolean, interval?: string, day_of_month?: string, day_of_week?: string, cron_expression?: string | undefined, run_at?: Date, executed_at?: Date, description?: string, message?: string, audienceIds?: number[]);
}
