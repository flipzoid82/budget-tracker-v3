import path from "path";
import Database from "better-sqlite3";

// Create or open the SQLite database file
const dbPath = path.resolve("src", "db", "database.sqlite3");
const db = new Database(dbPath);

// Initialize schema (run once)
function initDatabase() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS months (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS income (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      source TEXT NOT NULL,
      amount REAL NOT NULL,
      FOREIGN KEY (month_id) REFERENCES months(id)
    );
  `).run();

  db.prepare(`
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
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS misc (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      FOREIGN KEY (month_id) REFERENCES months(id)
    );
  `).run();
}

// Insert sample months
function insertSampleMonths() {
  const months = ["January 2025", "February 2025", "March 2025"];
  months.forEach((month) => {
    db.prepare("INSERT OR IGNORE INTO months (name) VALUES (?)").run(month);
  });
}

// Insert sample income
function insertSampleIncome() {
  const januaryMonthId = db.prepare("SELECT id FROM months WHERE name = ?").get("January 2025").id;
  const februaryMonthId = db.prepare("SELECT id FROM months WHERE name = ?").get("February 2025").id;
  
  const sampleIncome = [
    { month_id: januaryMonthId, date: "01/15/2025", source: "Job", amount: 2000 },
    { month_id: februaryMonthId, date: "02/15/2025", source: "Freelance", amount: 1500 },
  ];

  sampleIncome.forEach((income) => {
    db.prepare("INSERT INTO income (month_id, date, source, amount) VALUES (?, ?, ?, ?)").run(
      income.month_id,
      income.date,
      income.source,
      income.amount
    );
  });
}

// Insert sample expenses
function insertSampleExpenses() {
  const januaryMonthId = db.prepare("SELECT id FROM months WHERE name = ?").get("January 2025").id;
  const februaryMonthId = db.prepare("SELECT id FROM months WHERE name = ?").get("February 2025").id;

  const sampleExpenses = [
    { month_id: januaryMonthId, name: "Rent", amount: 1000, due_date: "01/01/2025", paid_date: "", confirmation: "" },
    { month_id: januaryMonthId, name: "Internet", amount: 50, due_date: "01/05/2025", paid_date: "", confirmation: "" },
    { month_id: februaryMonthId, name: "Electricity", amount: 75, due_date: "02/10/2025", paid_date: "", confirmation: "" },
    { month_id: februaryMonthId, name: "Water", amount: 30, due_date: "02/12/2025", paid_date: "", confirmation: "" },
  ];

  sampleExpenses.forEach((expense) => {
    db.prepare("INSERT INTO expenses (month_id, name, amount, due_date, paid_date, confirmation) VALUES (?, ?, ?, ?, ?, ?)").run(
      expense.month_id,
      expense.name,
      expense.amount,
      expense.due_date,
      expense.paid_date,
      expense.confirmation
    );
  });
}

// Insert sample data into the database
function insertSampleData() {
  initDatabase();  // Initialize the database schema
  insertSampleMonths();
  insertSampleIncome();
  insertSampleExpenses();
  console.log("Sample data inserted into the database.");
}

// Run the insertion
insertSampleData();
