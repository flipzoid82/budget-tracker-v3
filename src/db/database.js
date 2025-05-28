// src/db/database.js
const path = require("path");
const Database = require("better-sqlite3");

// Path to the SQLite file (assumes it's at the project root)
const dbPath = path.resolve(__dirname, "../../budget.sqlite3");

// Open or create the SQLite DB
const db = new Database(dbPath);

// Export the raw DB connection for Electron
module.exports = db;