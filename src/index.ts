// Convenience barrel. Prefer deep imports (e.g.
// "@nenichat/domain/Orders/domain/Order") in consumers so that
// server-only adapters (pg, openai, supabase) are not pulled into bundles
// that do not need them.
export * from "./Wapp";
export * from "./Chats/infra/api";
export * from "./Messages/infra/api";
export * from "./Containers";
export * from "./Suggestions";
