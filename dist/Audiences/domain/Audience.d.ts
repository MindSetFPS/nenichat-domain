import { IAudience } from './IAudience';
export declare class Audience implements IAudience {
    id: number;
    name: string;
    description?: string;
    created_at: Date;
    constructor(id: number, name: string, description: string | undefined, created_at: Date);
}
