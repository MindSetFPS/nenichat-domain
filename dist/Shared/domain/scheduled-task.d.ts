/**
 * Represents a row in the `scheduled_tasks` table.
 */
export interface ScheduledTask {
    id: number;
    name: string;
    description?: string;
    task_type?: string;
    frequency_type: 'once' | 'recurring';
    cron_expression?: string;
    run_at?: Date;
    payload: TaskPayload | {};
    enabled: boolean;
    last_run_at?: Date;
    next_run_at?: Date;
    created_at: Date;
    updated_at: Date;
}
/**
 * Payload structure for scheduled tasks
 */
export interface TaskPayload {
    requests: Array<{
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        url: string;
        headers?: Record<string, string>;
        body?: any;
    }>;
}
