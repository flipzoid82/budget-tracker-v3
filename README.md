# 💸 Budget Tracker V3

A local-first, cross-platform **budget tracking desktop app** built with **React + Electron + SQLite**. Organize monthly income, expenses, and miscellaneous transactions with a smooth and modern UI.

---

## 🆕 What's New in v3.2.0

- ✅ Migrated all data from `localStorage` to **SQLite** for persistent, local-first storage
- 🔄 All saves now handled via secure **IPC communication** with Electron backend
- 💾 Fully functional **Save** button — persists current month to the database
- 🧠 Added SQLite schema for `months`, `income`, `expenses`, and `misc`
- ✏️ Unified modal system with reusable `<PromptModal />` for all inputs
- 🌑 Polished **dark mode** and tab styles
- 📊 Enhanced dashboard summaries and urgent bills alerts
- 🔐 `.gitignore` now protects `budget.sqlite3` to prevent leaking personal data

---

## 🗂 File Structure Overview

```
budget-tracker-v3/
├── public/
├── src/
│   ├── components/
│   │   ├── ToolbarTabs.jsx
│   │   ├── MonthSelector.jsx
│   │   └── UpcomingBills.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── ExpensesPage.jsx
│   │   └── IncomePage.jsx
│   ├── modals/
│   │   └── PromptModal.jsx
│   ├── core/
│   │   └── BudgetProvider.jsx
│   ├── db/
│   │   ├── database.js
│   │   └── dbAccess.js
│   ├── App.jsx
│   ├── Layout.jsx
│   ├── Navigation.jsx
│   └── theme.css
├── electron.cjs
├── preload.js
├── package.json
└── budget.sqlite3 (🚫 excluded by .gitignore)
```

---

## 💻 How It Works

### ⚙ Electron Backend
- Backend runs via `electron.cjs`
- `preload.js` exposes safe IPC bridges to the React frontend
- SQLite queries handled via `better-sqlite3` in `dbAccess.js`

### 🧠 State Management
- App state lives in `BudgetProvider.jsx`
- `INIT`, `SET_MONTH`, and `UPDATE_MONTH_DATA` control reducer logic

### 🖥️ Frontend
- Responsive UI built with custom CSS variables in `theme.css`
- Tabbed layout using `ToolbarTabs.jsx`
- Modal input system uses `PromptModal.jsx`
- Expense and income data shown in editable table formats
- Dark mode toggle and import/export JSON support included

---

## 📁 Database Schema

Tables:
- `months(id, name)`
- `income(id, month_id, date, source, amount)`
- `expenses(id, month_id, name, amount, due_date, paid_date, confirmation)`
- `misc(id, month_id, description, amount)`

Each table supports full CRUD through centralized access in `dbAccess.js`.

---

## 🧪 Development

### Install Dependencies
```bash
npm install
```

### Start App (Electron + React + SQLite)
```bash
npm run start
```

### Build Electron App
```bash
npm run build
```

> **Note:** SQLite file is local and will persist across app reloads.

---

## 🚀 Features

- [x] Offline desktop budgeting
- [x] Add, edit, and delete income/expenses/misc
- [x] "Mark as Paid" logic with confirmation number & undo
- [x] Monthly rollovers and selectors
- [x] Responsive UI with print support
- [x] Import/export `.json` backups
- [x] Secure and fast local database (no internet needed)
- [x] Clean dark mode support

---

## 🔒 Security Considerations

- IPC communication is limited to whitelisted actions in `preload.js`
- All data stored locally in `budget.sqlite3` (excluded from repo)
- No personal data is sent externally

---

## 📅 Coming Soon

- [ ] Full CRUD for Misc transactions
- [ ] Month renaming support
- [ ] Backup/restore via CLI or GUI
- [ ] SQLite schema migrations
- [ ] User accounts and password-protected profiles
- [ ] Optional sync with cloud backup

---

## 🧠 Credits

Developed by [flipzoid82](https://github.com/flipzoid82)  
MIT License © 2025
