"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = void 0;
class Campaign {
    constructor(id, name, created_at, updated_at, frequency_type, payload, enabled, interval, day_of_month, day_of_week, cron_expression, run_at, executed_at, description, message, audienceIds) {
        this.id = id;
        this.name = name;
        this.created_at = created_at;
        this.frequency_type = frequency_type;
        this.interval = interval;
        this.day_of_month = day_of_month;
        this.day_of_week = day_of_week;
        this.cron_expression = cron_expression;
        this.run_at = run_at;
        this.executed_at = executed_at;
        this.description = description;
        this.message = message;
        this.audienceIds = audienceIds;
        this.payload = payload;
        this.enabled = enabled;
        this.updated_at = updated_at;
    }
}
exports.Campaign = Campaign;
