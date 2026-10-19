"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db = process.env.DB_NAME;
if (!user)
    throw new Error("Missing environment variable: DB_USER");
if (!password)
    throw new Error("Missing environment variable: DB_PASSWORD");
if (!host)
    throw new Error("Missing environment variable: DB_HOST");
if (!port)
    throw new Error("Missing environment variable: DB_PORT");
if (!db)
    throw new Error("Missing environment variable: DB_NAME");
const connectionString = `postgres://${user}:${password}@${host}:${port}/${db}`;
exports.pool = new pg_1.Pool({
    connectionString,
});
