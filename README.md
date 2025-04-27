# 💰 Budget Tracker

A local-first, dark-mode-ready budgeting app built with React + Electron.

---

### v3.09

- Complete PromptModal rebuild with multi-mode support (forms, confirmation-only, date pickers).
- Synchronized IncomePage and ExpensesPage to new modal framework.
- Added react-datepicker integration for Due Dates and Income Dates.
- Improved error handling and validation UX.
- Maintained strict styling consistency with original project theme.

## Version 3.08 - Modal System Overhaul

- Rebuilt all modal prompts (add, edit, delete) using a unified, clean PromptModal system.
- Introduced confirmation-only modals for safe delete actions.
- Added aesthetic improvements: close buttons on modals, better button spacing.
- Bug fixes to modal behavior, overlay consistency, and dark mode support.

## 🚀 Version 3.07 Highlights

- 🗑 Delete option now available in both Expenses and Income edit menus
- 🔒 Uses reusable `PromptModal` for unified confirmation behavior
- 📐 Table column alignment cleaned up on Expenses page
- 📏 Action buttons now share consistent sizing

## 🚀 Version 3.05 Highlights

- 🎨 Improved contrast for active/inactive tabs in light and dark mode
- 🔲 Inactive tabs now have flat bottoms for clean separation
- 🧼 Fully reorganized and commented `theme.css` for clarity and maintainability

---

## 🚀 Version 3.04 Highlights

- 🔁 Income page now visually and structurally matches Expenses page
- 🧾 Table headers, row spacing, and edit menus fully unified
- ✏️ Edit button in Income uses consistent styling (`btn btn-muted`)
- ➕ Add button now centered and styled identically to Expenses

---

## 🚀 Version 3.03 Highlights

- 🎯 Seamless tab + toolbar + layout background alignment
- 🧱 Tab design split into modular `ToolbarTabs` and `toolbar-actions`
- 🎨 Unified dark mode color scheme for all header elements
- 🧼 Removed unnecessary styles and spacing for a flush top UI
- ✨ Final tab illusion is perfect — active tab shares layout background

---

## 🚀 Version 3.02 Highlights

- 🔧 Modular Toolbar component for easy reuse and clean layout
- 🌙 Dark Mode Toggle with theme variable support and localStorage persistence
- ✏️ Expenses Edit Menu UI redesign with pencil icon and better alignment
- 🧱 Styled dropdown for editing fields (Confirmation, URL, Due Date)
- 🖱️ Auto-close on outside click for expense menus
- 🛠️ Clean, theme-compatible updates to all navigation and tables
- 💄 Flush icon alignment in Expenses table for a polished look

---

## 🛠️ Tech Stack

- **React** (Vite)
- **Electron** (desktop native runtime)
- **SQLite (coming soon)** for local persistent data
- **Vitest** for testing
- **Modular Components**: `ToolbarTabs`, `PromptModal`, `BudgetProvider`

---

## 📦 How to Run

```bash
npm install
npm run dev
```

To launch with Electron:

```bash
npm run start
```

---

## 📄 License

MIT
