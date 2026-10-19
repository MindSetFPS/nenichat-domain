"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Convenience barrel. Prefer deep imports (e.g.
// "@nenichat/domain/Orders/domain/Order") in consumers so that
// server-only adapters (pg, openai, supabase) are not pulled into bundles
// that do not need them.
__exportStar(require("./Wapp"), exports);
__exportStar(require("./Chats/infra/api"), exports);
__exportStar(require("./Messages/infra/api"), exports);
__exportStar(require("./Containers"), exports);
__exportStar(require("./Suggestions"), exports);
