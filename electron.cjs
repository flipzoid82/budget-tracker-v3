const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { addMonth, getAllMonths, copyMonth } = require('./src/db/dbAccess.js');
const db = require('./src/db/database.js');
const dbAccess = require('./src/db/dbAccess.js');

// Enhanced error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

async function createWindow() {
  console.log('🚀 [Electron] createWindow triggered');

  // Verify preload file exists
  const preloadPath = path.join(__dirname, 'preload.js');
  if (!fs.existsSync(preloadPath)) {
    throw new Error(`Preload file not found at ${preloadPath}`);
  }
  console.log('🧪 Preload path verified:', preloadPath);

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show immediately
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true, // Additional security
      preload: preloadPath,
    },
  });

  console.log('✅ BrowserWindow created');

  // Enhanced load handling with retries
  let retries = 0;
  const maxRetries = 5;
  const retryDelay = 1000;

  const tryLoad = async () => {
    try {
      await win.loadURL('http://localhost:5173');
      console.log('🌐 Page loaded successfully');
      return true;
    } catch (err) {
      if (retries < maxRetries) {
        retries++;
        console.log(`⚠️  Load failed (attempt ${retries}/${maxRetries}), retrying...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return tryLoad();
      }
      throw err;
    }
  };

  // Event listeners for better debugging
  win.webContents.on('did-finish-load', () => {
    console.log('🌐 Page fully loaded');
    win.show();
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('❌ Failed to load page:', errorDescription);
  });

  win.webContents.on('render-process-gone', (event, details) => {
    console.error('❌ Render process crashed:', details);
  });

  win.webContents.on('unresponsive', () => {
    console.warn('⚠️  Window unresponsive');
  });

  try {
    await tryLoad();
    win.webContents.openDevTools();
  } catch (err) {
    console.error('❌ Failed to load after retries:', err);
    win.close();
    app.quit();
  }

  return win;
}

// App lifecycle with better error handling
app.whenReady().then(async () => {
  try {
    console.log('🔄 App is ready, creating window...');
    await createWindow();
  } catch (err) {
    console.error('❌ App failed during whenReady:', err);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// --- IPC: Months ---
ipcMain.handle('get-months', () => dbAccess.getAllMonths());

// --- IPC: Income ---
ipcMain.handle('get-income', (event, monthId) => dbAccess.getIncomeByMonth(monthId));
ipcMain.handle('add-income', (event, data) => dbAccess.addIncome(data));

// --- IPC: Expenses ---
ipcMain.handle("get-expenses", (event, monthId) => dbAccess.getExpensesByMonth(monthId));
ipcMain.handle("add-expense", (event, data) => dbAccess.addExpense(data));
ipcMain.handle("mark-expense-paid", (event, data) => dbAccess.updateExpensePaidStatus(data));
ipcMain.handle("undo-expense-payment", (event, id) => dbAccess.undoExpensePayment(id));
ipcMain.handle("delete-expense", (event, id) => dbAccess.deleteExpense(id));

// --- IPC: Misc ---
ipcMain.handle("get-misc", (event, monthId) => dbAccess.getMiscByMonth(monthId));
ipcMain.handle("add-misc", (event, data) => dbAccess.addMisc(data));
ipcMain.handle("delete-misc", (event, id) => dbAccess.deleteMisc(id));

// --- IPC: Add Month ---
ipcMain.handle("add-month", async (event, data) => {
  try {
    const { name, copyPrevious, source } = data;

    if (copyPrevious) {
      copyMonth(source, name);
    } else {
      addMonth(name);
    }

    const months = getAllMonths();
    return { success: true, months };
  } catch (err) {
    console.error("❌ Error adding month:", err);

    const errorCode = err?.code;
    const isDuplicate = errorCode === "SQLITE_CONSTRAINT_UNIQUE";

    return {
      success: false,
      error: isDuplicate ? "DUPLICATE_MONTH" : "UNKNOWN_ERROR"
    };
  }
});

// --- IPC: Delete Month ---
ipcMain.handle("delete-month", (event, monthName) => {
  try {
    const id = dbAccess.getMonthIdByName(monthName);
    if (id) {
      db.prepare("DELETE FROM expenses WHERE month_id = ?").run(id);
      db.prepare("DELETE FROM income WHERE month_id = ?").run(id);
      db.prepare("DELETE FROM misc WHERE month_id = ?").run(id);
      db.prepare("DELETE FROM months WHERE id = ?").run(id);
    }

    const months = dbAccess.getAllMonths();
    return { success: true, months };
  } catch (err) {
    console.error("❌ Error deleting month:", err);
    return { success: false, error: err.message };
  }
});

// --- IPC: Save ---
ipcMain.handle("save-month-data", async (event, { monthName, data }) => {
  const monthId = dbAccess.getMonthIdByName(monthName);
  if (!monthId) throw new Error("Month not found");

  // EXPENSES
  const existingExpenseIds = dbAccess.getExpenseIdsByMonth(monthId);
  const updatedExpenseIds = new Set((data.expenses || []).filter(e => e.id).map(e => e.id));
  for (const id of existingExpenseIds) {
    if (!updatedExpenseIds.has(id)) dbAccess.deleteExpense(id);
  }
  for (const e of data.expenses || []) {
    if (e.id) {
      dbAccess.updateExpense({
        id: e.id,
        name: e.name,
        amount: e.amount,
        due_date: e.dueDate,
        paid_date: e.paidDate,
        confirmation: e.confirmation,
      });
    } else {
      dbAccess.addExpense({
        month_id: monthId,
        name: e.name,
        amount: e.amount,
        due_date: e.dueDate,
      });
    }
  }

  // INCOME
  const existingIncomeIds = dbAccess.getIncomeIdsByMonth(monthId);
  const updatedIncomeIds = new Set((data.income || []).filter(i => i.id).map(i => i.id));
  for (const id of existingIncomeIds) {
    if (!updatedIncomeIds.has(id)) dbAccess.deleteIncome(id);
  }
  for (const i of data.income || []) {
    if (i.id) {
      dbAccess.updateIncome({
        id: i.id,
        date: i.date,
        source: i.source,
        amount: i.amount,
      });
    } else {
      dbAccess.addIncome({
        month_id: monthId,
        date: i.date,
        source: i.source,
        amount: i.amount,
      });
    }
  }

  // MISC
  const existingMiscIds = dbAccess.getMiscIdsByMonth(monthId);
  const updatedMiscIds = new Set((data.misc || []).filter(m => m.id).map(m => m.id));
  for (const id of existingMiscIds) {
    if (!updatedMiscIds.has(id)) dbAccess.deleteMisc(id);
  }
  for (const m of data.misc || []) {
    if (!m.id) {
      dbAccess.addMisc({
        month_id: monthId,
        description: m.description,
        amount: m.amount,
      });
    }
  }

  return true;
});
