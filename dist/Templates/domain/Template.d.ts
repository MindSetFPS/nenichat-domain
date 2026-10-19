import { ITemplate } from './ITemplate';
export declare class Template implements ITemplate {
    id: string;
    business_id: number;
    name: string;
    message: string;
    created_at: string;
    updated_at: string;
    constructor(data: ITemplate);
}
