# 📦 Budget Tracker - Changelog

---

## [v3.4.1] - 2025-05-28

### Fixed

- Bug where expense URLs were saved to the wrong item due to filtered index mismatch
- Now uses expense ID for safe updates

### Improved

- Confirmed database persistence
- Full round-trip editing verification for expenses

## [v3.4.0] – 2025-05-28

### ✨ Added

- 🔍 **Search Filtering** for Expenses and Income pages with real-time query updates
- ⬆️⬇️ **Table Sorting** by clicking headers (Name, Amount, Date, etc.)
- 🧭 **Sticky Toolbar & Tabs**: Navigation bar and toolbar now stay pinned to the top
- 🔗 Expenses now support an optional **URL** field that hyperlinks the name

### 🧼 Changed

- 📊 Tables visually cleaned for consistency: padding, alignment, and spacing refined
- 🎨 Sort indicators now use up/down SVG icons (`UpArrowIcon`, `DownArrowIcon`) placed beside header text
- 🧩 Modularized all icons for import cleanliness and reuse

### 🐛 Fixed

- 🚫 Hydration warning from `<tr>` outside `<tbody>` resolved
- 🌙 Sticky header background now theme-aware for dark/light mode

## [v3.3.0] – 2025-05-26

### ✨ Added

- ❗ **Error Handling Infrastructure**: Introduced a centralized `ErrorModal` component to standardize error messages across the app.
- 🔁 Predefined fallback messages for known error codes like `SQLITE_CONSTRAINT_UNIQUE`, with support for custom error messaging.
- 🔍 Specific message for duplicate month creation: _"The month name selected already exists. Please choose a unique name."_

### 🛠 Changed

- ⚙️ `electron.cjs`: Refactored to fully support secure preload usage with `contextIsolation: true` and `preload.js` path set correctly.
- 📦 Switched Electron launch script to use `electron .` to improve path resolution and debugging.
- 🔄 Restored and validated IPC-based database calls after refactoring.
- 🗃️ Added `url` field support to `expenses` table in SQLite schema via manual migration.

### 🐛 Fixed

- 🧩 Addressed `better-sqlite3` and Node.js version mismatch by rebuilding native modules using `electron-rebuild`.
- 🔒 Fixed contextBridge error by ensuring preload is used only when `contextIsolation` is enabled.
- 🌐 Resolved `ERR_CONNECTION_REFUSED` during Electron boot by syncing Vite server timing and `loadURL`.

## [v3.2.0] – 2025-05-13

### Added

- 🔄 Integrated SQLite as the app's persistent backend storage
- 💾 Save button now syncs expenses, income, and misc data
- ✅ Support for editing existing income entries
- 🗑️ Deletes removed items from the database on save
- 🔐 IPC secure communication using Electron preload
- 🧠 Updated PromptModal with reliable input focus handling

### Fixed

- ⚠️ Modal input fields were sometimes unclickable due to render timing

## [v3.1.1] – Expense Payment Polishing

- Unified "Mark Paid" and "Undo" button widths for visual consistency
- Added confirmation modal when undoing a payment with warning message:
  _"Are you sure you want to UNDO payment? This will delete the paid date and confirmation #."_
- Refactored modal prompt to support optional messages in confirmation-only mode

## [v3.1.0] - 2025-05-03

### Added

- Dark mode toggle button with persistent state using `localStorage` and `useEffect`.
- MonthSelector dropdown aligned left of toolbar, styled to match button height.
- Toolbar icons replaced with SVG components: Save, Print, Import, Export.
- SVG-based Edit icon (`IconEdit.jsx`) used across Income and Expenses pages.
- Delete confirmation modals now use `confirmationOnly` mode and custom prompt message.

### Updated

- `theme.css` styling for `.toolbar`, `.month-selector`, `.icon-button`, and SVG icons.
- Reusable `Icon` components added for toolbar actions and dark mode states.

### Fixed

- Alignments and sizing of dropdown/button elements within the toolbar.
- Dark mode SVG color inheritance issues by enforcing `stroke="currentColor"`.

## [v3.09] - PromptModal Overhaul + DatePicker Upgrade + Page Sync

**Date:** 2025-04-26

- Refactored PromptModal.jsx to fully support:
  - Single-field prompts
  - Multi-field prompts
  - Calendar date selection via react-datepicker
  - Delete confirmation modals with warning icon
- Preserved original modal styling (modal-header, modal-field, modal-footer)
- Fixed auto-focus behavior depending on confirmation-only vs form modals
- Added field-specific validation with real-time error clearing
- Integrated clean loading spinner on submission
- Updated ExpensesPage.jsx and IncomePage.jsx to:
  - Use PromptModal for Add/Edit/Delete flows
  - Correctly pass field types (including `type: "date"`)
  - Preserve dropdown menu structure and actions
- Minor CSS improvements for modal overlay, dark mode support, and date picker theming
- Full alignment to custom design language (Windows 11-lite aesthetic)

## [v3.08] - Modal Overhaul (Expenses/Income)

### Added

- Added a close (×) button to the top-right corner of all modals for easier exit.
- Improved modal spacing: Submit and Cancel buttons now visually separated for clarity.

### Changed

- Replaced inline "Delete" confirmations with proper floating modals for both Income and Expenses pages.
- Modals now support 3 modes: single field input, multi-field form, and confirmation-only messages.
- Delete prompts now show a clear confirmation message ("Are you sure you want to delete this income/expense?") instead of showing empty input fields.
- True modal overlays with background dimming applied across the app.

### Fixed

- Fixed delete confirmation rendering incorrectly inside the Expenses table instead of as a modal.
- Ensured consistent visual style across light and dark modes.

## v3.07

**Date:** 2025-04-25

### ✨ Added

- 🗑 Delete option in both Expenses and Income dropdown menus
- Uses `PromptModal` confirmation for continuity across the app

### 🧼 Changed

- Updated table cell alignment in Expenses:
  - Name, Amount, Status = Left-aligned
  - Due Date, Paid Date, Confirmation #, Action = Center-aligned
- Action buttons (e.g. Mark as Paid / Undo) now share a uniform width for clean layout
- Removed `action-button` class from Edit icon for visual consistency

## v3.06

**Date:** 2025-04-24

### ✨ Added

- ✏️ Rebuilt dropdown menus for both Income and Expenses using consistent structure
- 🧭 Anchored dropdowns using `.dropdown-anchor` and styled with `.dropdown-menu`
- 🪟 Matched Windows-style context menu for improved UX

### 🛠 Fixed

- JSX alignment and parsing issues in dropdown logic (no more missing tags!)
- Eliminated duplicate dropdown renders in IncomePage

## v3.05

**Date:** 2025-04-21

### ✨ Added

- Light mode and dark mode inactive tab shape control (flat-bottom)
- Clear contrast between active/inactive tabs across themes

### 🧼 Changed

- Reorganized `theme.css` with sections and comments
- Unified tab-button styling and removed shadow artifacts

---

## v3.04

**Date:** 2025-04-20

### ✨ Added

- Full visual sync between IncomePage and ExpensesPage
- Table structure, spacing, and font weights unified
- Add button centered and styled consistently

### 🔧 Changed

- Income edit button changed from `dropdown-button` to `btn btn-muted` for continuity

---

## v3.03

**Date:** 2025-04-19

### ✨ Added

- Seamless tab + toolbar + layout background alignment
- Tabs now match layout background color with soft border illusion
- Visual polish to remove all pixel gaps and layout glitches

---

## v3.02

**Date:** 2025-04-18

### ✨ Added

- Modular Toolbar extracted
- Dark mode styling for buttons and layout
- Unified header elements and background styling

---

## v3.01

**Date:** 2025-04-17

### ✨ Initial React-Electron migration version

- File structure modernization
- Main layout established with month switching and persistent budget state
