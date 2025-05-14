// src/db/dbAccess.js
import db from "./database.js";

// 🔍 Utility
function getMonthIdByName(name) {
  const row = db.prepare("SELECT id FROM months WHERE name = ?").get(name);
  return row ? row.id : null;
}

// 📤 MONTHS
function getAllMonths() {
  return db.prepare("SELECT * FROM months ORDER BY id DESC").all();
}

function addMonth(name) {
  return db.prepare("INSERT INTO months (name) VALUES (?)").run(name).lastInsertRowid;
}

// 📤 EXPENSES
function getExpensesByMonth(monthName) {
  const id = getMonthIdByName(monthName);
  if (!id) return [];
  return db.prepare("SELECT * FROM expenses WHERE month_id = ? ORDER BY due_date").all(id);
}

function getExpenseIdsByMonth(monthId) {
  return db.prepare("SELECT id FROM expenses WHERE month_id = ?").all(monthId).map(row => row.id);
}

function addExpense({ month_id, name, amount, due_date }) {
  return db.prepare(`
    INSERT INTO expenses (month_id, name, amount, due_date)
    VALUES (?, ?, ?, ?)
  `).run(month_id, name, amount, due_date).lastInsertRowid;
}

function updateExpense({ id, name, amount, due_date, paid_date, confirmation }) {
  return db.prepare(`
    UPDATE expenses
    SET name = ?, amount = ?, due_date = ?, paid_date = ?, confirmation = ?
    WHERE id = ?
  `).run(name, amount, due_date, paid_date, confirmation, id);
}

function updateExpensePaidStatus({ id, paid_date, confirmation }) {
  return db.prepare("UPDATE expenses SET paid_date = ?, confirmation = ? WHERE id = ?").run(paid_date, confirmation, id);
}

function undoExpensePayment(id) {
  return db.prepare("UPDATE expenses SET paid_date = NULL, confirmation = NULL WHERE id = ?").run(id);
}

function deleteExpense(id) {
  return db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
}

// 📤 INCOME
function getIncomeByMonth(monthName) {
  const id = getMonthIdByName(monthName);
  if (!id) return [];
  return db.prepare("SELECT * FROM income WHERE month_id = ? ORDER BY date").all(id);
}

function getIncomeIdsByMonth(monthId) {
  return db.prepare("SELECT id FROM income WHERE month_id = ?").all(monthId).map(row => row.id);
}

function addIncome({ month_id, date, source, amount }) {
  return db.prepare(`
    INSERT INTO income (month_id, date, source, amount)
    VALUES (?, ?, ?, ?)
  `).run(month_id, date, source, amount).lastInsertRowid;
}

function updateIncome({ id, date, source, amount }) {
  return db.prepare(`
    UPDATE income
    SET date = ?, source = ?, amount = ?
    WHERE id = ?
  `).run(date, source, amount, id);
}

function deleteIncome(id) {
  return db.prepare("DELETE FROM income WHERE id = ?").run(id);
}

// 📤 MISC
function getMiscByMonth(monthName) {
  const id = getMonthIdByName(monthName);
  if (!id) return [];
  return db.prepare("SELECT * FROM misc WHERE month_id = ?").all(id);
}

function getMiscIdsByMonth(monthId) {
  return db.prepare("SELECT id FROM misc WHERE month_id = ?").all(monthId).map(row => row.id);
}

function addMisc({ month_id, description, amount }) {
  return db.prepare(`
    INSERT INTO misc (month_id, description, amount)
    VALUES (?, ?, ?)
  `).run(month_id, description, amount).lastInsertRowid;
}

function deleteMisc(id) {
  return db.prepare("DELETE FROM misc WHERE id = ?").run(id);
}

// ✅ Exports
export {
  getMonthIdByName,
  getAllMonths,
  addMonth,
  getExpensesByMonth,
  addExpense,
  updateExpense,
  updateExpensePaidStatus,
  undoExpensePayment,
  deleteExpense,
  getExpenseIdsByMonth,
  getIncomeByMonth,
  addIncome,
  updateIncome,
  deleteIncome,
  getIncomeIdsByMonth,
  getMiscByMonth,
  addMisc,
  deleteMisc,
  getMiscIdsByMonth
};
