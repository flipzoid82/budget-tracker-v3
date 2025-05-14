import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const db = new Database(path.resolve("budget.sqlite3"));

// Ensure tables exist before inserting
db.exec(`
CREATE TABLE IF NOT EXISTS months (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS income (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  source TEXT NOT NULL,
  amount REAL NOT NULL,
  FOREIGN KEY (month_id) REFERENCES months(id)
);

CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  due_date TEXT,
  paid_date TEXT,
  confirmation TEXT,
  FOREIGN KEY (month_id) REFERENCES months(id)
);

CREATE TABLE IF NOT EXISTS misc (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  FOREIGN KEY (month_id) REFERENCES months(id)
);
`);

// Read JSON data
const dataPath = path.resolve("budget-import.json");
const json = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Insert month, income, and expenses
for (const [monthName, { income, expenses }] of Object.entries(json.months)) {
  if (income.length === 0 && expenses.length === 0) continue;

  // Insert month and get ID
  let monthStmt = db.prepare("INSERT OR IGNORE INTO months (name) VALUES (?)");
  monthStmt.run(monthName);

  let monthIdRow = db.prepare("SELECT id FROM months WHERE name = ?").get(monthName);
  if (!monthIdRow) {
    console.error(`❌ Failed to fetch ID for month: ${monthName}`);
    continue;
  }
  const monthId = monthIdRow.id;

  // Insert income entries
  const incomeStmt = db.prepare(`
    INSERT INTO income (month_id, date, source, amount)
    VALUES (?, ?, ?, ?)
  `);
  for (const entry of income) {
    // Skip if total row or invalid source
    if (entry.source?.toLowerCase() === "total" || !entry.source?.trim()) continue;
    incomeStmt.run(monthId, entry.date, entry.source, entry.amount);
  }

  // Insert expense entries
  const expenseStmt = db.prepare(`
    INSERT INTO expenses (month_id, name, amount, due_date, paid_date, confirmation)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const entry of expenses) {
    expenseStmt.run(
      monthId,
      entry.name,
      entry.amount,
      entry.dueDate || null,
      entry.paidDate || null,
      entry.confirmation || ""
    );
  }

  console.log(`✅ Imported data for ${monthName}`);
}

console.log("🎉 All data inserted successfully.");
