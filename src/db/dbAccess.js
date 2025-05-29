// src/db/dbAccess.js
const db = require("./database.js");

// Month helpers
function getMonthIdByName(monthName) {
  const row = db.prepare("SELECT id FROM months WHERE name = ?").get(monthName);
  return row?.id || null;
}

function getAllMonths() {
  return db.prepare("SELECT name FROM months ORDER BY id DESC").all();
}

function saveMonthData(name, data) {
  const monthId = getMonthIdByName(name);
  if (!monthId) throw new Error(`Month not found: ${name}`);

  // === Update Expenses ===
  const updateExpenseStmt = db.prepare(`
    UPDATE expenses SET
      name = ?,
      amount = ?,
      due_date = ?,
      paid_date = ?,
      confirmation = ?,
      url = ?
    WHERE id = ? AND month_id = ?
  `);

  for (const expense of data.expenses || []) {
    if (!expense.id) continue;
    updateExpenseStmt.run(
      expense.name,
      expense.amount,
      expense.due_date || null,
      expense.paid_date || null,
      expense.confirmation || null,
      expense.url || null,
      expense.id,
      monthId
    );
  }

  // === Update Income ===
  const updateIncomeStmt = db.prepare(`
    UPDATE income SET
      source = ?,
      amount = ?,
      date = ?
    WHERE id = ? AND month_id = ?
  `);

  for (const income of data.income || []) {
    if (!income.id) continue;
    updateIncomeStmt.run(
      income.source,
      income.amount,
      income.date || null,
      income.id,
      monthId
    );
  }

  // === Update Misc Transactions ===
  const updateMiscStmt = db.prepare(`
    UPDATE misc SET
      description = ?,
      amount = ?
    WHERE id = ? AND month_id = ?
  `);

  for (const misc of data.misc || []) {
    if (!misc.id) continue;
    updateMiscStmt.run(
      misc.description,
      misc.amount,
      misc.id,
      monthId
    );
  }

  console.log(`✅ Saved month '${name}' (ID: ${monthId}) to database`);
}

function addMonth(monthName) {
  return db.prepare("INSERT INTO months (name) VALUES (?)").run(monthName);
}

// Expenses
function getExpensesByMonth(monthName) {
  const id = getMonthIdByName(monthName);
  return db.prepare("SELECT * FROM expenses WHERE month_id = ?").all(id);
}

function addExpense({ month_id, name, amount, due_date, url }) {
  return db.prepare(
    `INSERT INTO expenses (month_id, name, amount, due_date, url)
     VALUES (?, ?, ?, ?, ?)`
  ).run(month_id, name, amount, due_date, url).lastInsertRowid;
}

function updateExpense({ id, name, amount, due_date, paid_date, confirmation, url }) {
  return db.prepare(
    `UPDATE expenses
     SET name = ?, amount = ?, due_date = ?, paid_date = ?, confirmation = ?, url = ?
     WHERE id = ?`
  ).run(name, amount, due_date, paid_date, confirmation, url, id);
}

function updateExpensePaidStatus(id, paid_date, confirmation) {
  return db.prepare(
    `UPDATE expenses SET paid_date = ?, confirmation = ? WHERE id = ?`
  ).run(paid_date, confirmation, id);
}

function undoExpensePayment(id) {
  return db.prepare(
    `UPDATE expenses SET paid_date = NULL, confirmation = NULL WHERE id = ?`
  ).run(id);
}

function deleteExpense(id) {
  return db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
}

function getExpenseIdsByMonth(monthName) {
  const id = getMonthIdByName(monthName);
  return db.prepare("SELECT id FROM expenses WHERE month_id = ?").all(id).map(r => r.id);
}

// Income
function getIncomeByMonth(monthName) {
  const id = getMonthIdByName(monthName);
  return db.prepare("SELECT * FROM income WHERE month_id = ?").all(id);
}

function addIncome({ month_id, date, source, amount }) {
  return db.prepare(
    `INSERT INTO income (month_id, date, source, amount)
     VALUES (?, ?, ?, ?)`
  ).run(month_id, date, source, amount);
}

function updateIncome({ id, date, source, amount }) {
  return db.prepare(
    `UPDATE income SET date = ?, source = ?, amount = ? WHERE id = ?`
  ).run(date, source, amount, id);
}

function deleteIncome(id) {
  return db.prepare("DELETE FROM income WHERE id = ?").run(id);
}

function getIncomeIdsByMonth(monthName) {
  const id = getMonthIdByName(monthName);
  return db.prepare("SELECT id FROM income WHERE month_id = ?").all(id).map(r => r.id);
}

// Misc
function getMiscByMonth(monthName) {
  const id = getMonthIdByName(monthName);
  return db.prepare("SELECT * FROM misc WHERE month_id = ?").all(id);
}

function addMisc({ month_id, name, amount }) {
  return db.prepare(
    `INSERT INTO misc (month_id, name, amount) VALUES (?, ?, ?)`
  ).run(month_id, name, amount);
}

function deleteMisc(id) {
  return db.prepare("DELETE FROM misc WHERE id = ?").run(id);
}

function getMiscIdsByMonth(monthName) {
  const id = getMonthIdByName(monthName);
  return db.prepare("SELECT id FROM misc WHERE month_id = ?").all(id).map(r => r.id);
}

// Copy
function copyMonth(sourceMonthName, targetMonthName) {
  const sourceId = getMonthIdByName(sourceMonthName);
  const result = db.prepare("INSERT INTO months (name) VALUES (?)").run(targetMonthName);
  const targetId = result.lastInsertRowid;

  const income = getIncomeByMonth(sourceMonthName);
  income.forEach((entry) => {
    addIncome({ ...entry, month_id: targetId });
  });

  const expenses = getExpensesByMonth(sourceMonthName);
  expenses.forEach((entry) => {
    const { name, amount, due_date } = entry;
    addExpense({ name, amount, due_date, month_id: targetId });
  });

  const misc = getMiscByMonth(sourceMonthName);
  misc.forEach((entry) => {
    addMisc({ ...entry, month_id: targetId });
  });
}

module.exports = {
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
  getMiscIdsByMonth,
  copyMonth,
  saveMonthData,
};
