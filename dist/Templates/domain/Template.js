"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
class Template {
    constructor(data) {
        this.id = data.id;
        this.business_id = data.business_id;
        this.name = data.name;
        this.message = data.message;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}
exports.Template = Template;
