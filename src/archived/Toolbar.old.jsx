import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBudget } from "../core/BudgetProvider";

const Toolbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useBudget();
  const fileInputRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSave = () => {
    console.log("💾 Save triggered");
  };

  const handlePrint = () => window.print();

  const handleExport = () => {
    const json = JSON.stringify({
      currentMonth: state.currentMonth,
      months: state.months,
    }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget_export_${state.currentMonth}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        dispatch({ type: "INIT", payload: parsed });
        alert("✅ Budget imported successfully!");
      } catch {
        alert("❌ Failed to import data.");
      }
    };
    reader.readAsText(file);
  };

  // Helper to determine active route
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      background: "var(--color-surface)",
      borderBottom: "1px solid var(--color-muted)",
      color: "var(--color-text)"
    }}>
      {/* Tab-style navigation buttons */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button className={isActive("/") ? "tab-button active" : "tab-button"} onClick={() => navigate("/")}>
          🏠 Dashboard
        </button>
        <button className={isActive("/expenses") ? "tab-button active" : "tab-button"} onClick={() => navigate("/expenses")}>
          💸 Expenses
        </button>
        <button className={isActive("/income") ? "tab-button active" : "tab-button"} onClick={() => navigate("/income")}>
          💰 Income
        </button>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button className="btn btn-muted" onClick={handleSave}>💾 Save</button>
        <button className="btn btn-muted" onClick={handlePrint}>🖨️ Print</button>
        <button className="btn btn-muted" onClick={() => fileInputRef.current?.click()}>📥 Import</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: "none" }}
        />
        <button className="btn btn-muted" onClick={handleExport}>📤 Export</button>
        <button className="btn btn-muted" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
};

export default Toolbar;
