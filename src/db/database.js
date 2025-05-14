// src/db/database.js
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "../../budget.sqlite3");
const db = new Database(dbPath);

// Initialize schema (optional here if already created)
export default db;
