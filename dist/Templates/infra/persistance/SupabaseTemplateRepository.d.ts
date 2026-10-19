import { SupabaseClient } from '@supabase/supabase-js';
import { ITemplate } from '../../domain/ITemplate';
import { ITemplateRepository } from '../../domain/ITemplateRepository';
export declare class SupabaseTemplateRepository implements ITemplateRepository {
    private _supabase;
    constructor(supabase: SupabaseClient);
    private mapToTemplate;
    list(businessId: number): Promise<ITemplate[]>;
    findById(businessId: number, id: string): Promise<ITemplate | null>;
    create(businessId: number, data: {
        name: string;
        message: string;
    }): Promise<ITemplate>;
    update(businessId: number, id: string, data: {
        name: string;
        message: string;
    }): Promise<ITemplate>;
    delete(businessId: number, id: string): Promise<void>;
}
