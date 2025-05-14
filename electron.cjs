const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./src/db/dbAccess"); // make sure path is correct

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// --- IPC: Months ---
ipcMain.handle("get-months", () => db.getAllMonths());
ipcMain.handle("add-month", (event, name) => db.addMonth(name));

// --- IPC: Income ---
ipcMain.handle("get-income", (event, monthId) => db.getIncomeByMonth(monthId));
ipcMain.handle("add-income", (event, data) => db.addIncome(data));

// --- IPC: Expenses ---
ipcMain.handle("get-expenses", (event, monthId) => db.getExpensesByMonth(monthId));
ipcMain.handle("add-expense", (event, data) => db.addExpense(data));
ipcMain.handle("mark-expense-paid", (event, data) => db.updateExpensePaidStatus(data));
ipcMain.handle("undo-expense-payment", (event, id) => db.undoExpensePayment(id));
ipcMain.handle("delete-expense", (event, id) => db.deleteExpense(id));

// --- IPC: Misc ---
ipcMain.handle("get-misc", (event, monthId) => db.getMiscByMonth(monthId));
ipcMain.handle("add-misc", (event, data) => db.addMisc(data));
ipcMain.handle("delete-misc", (event, id) => db.deleteMisc(id));

// --- IPC: Save ---
ipcMain.handle("save-month-data", async (event, { monthName, data }) => {
    const monthId = db.getMonthIdByName(monthName);
    if (!monthId) throw new Error("Month not found");
  
    // EXPENSES
    const existingExpenseIds = db.getExpenseIdsByMonth(monthId);
    const updatedExpenseIds = new Set((data.expenses || []).filter(e => e.id).map(e => e.id));
    for (const id of existingExpenseIds) {
      if (!updatedExpenseIds.has(id)) db.deleteExpense(id);
    }
    for (const e of data.expenses || []) {
      if (e.id) {
        db.updateExpense({
          id: e.id,
          name: e.name,
          amount: e.amount,
          due_date: e.dueDate,
          paid_date: e.paidDate,
          confirmation: e.confirmation,
        });
      } else {
        db.addExpense({
          month_id: monthId,
          name: e.name,
          amount: e.amount,
          due_date: e.dueDate,
        });
      }
    }
  
    // INCOME
    const existingIncomeIds = db.getIncomeIdsByMonth(monthId);
    const updatedIncomeIds = new Set((data.income || []).filter(i => i.id).map(i => i.id));
    for (const id of existingIncomeIds) {
      if (!updatedIncomeIds.has(id)) db.deleteIncome(id);
    }
    for (const i of data.income || []) {
      if (i.id) {
        db.updateIncome({
          id: i.id,
          date: i.date,
          source: i.source,
          amount: i.amount,
        });
      } else {
        db.addIncome({
          month_id: monthId,
          date: i.date,
          source: i.source,
          amount: i.amount,
        });
      }
    }
  
    // MISC
    const existingMiscIds = db.getMiscIdsByMonth(monthId);
    const updatedMiscIds = new Set((data.misc || []).filter(m => m.id).map(m => m.id));
    for (const id of existingMiscIds) {
      if (!updatedMiscIds.has(id)) db.deleteMisc(id);
    }
    for (const m of data.misc || []) {
      if (!m.id) {
        db.addMisc({
          month_id: monthId,
          description: m.description,
          amount: m.amount,
        });
      }
    }
  
    return true;
  });
  
  
