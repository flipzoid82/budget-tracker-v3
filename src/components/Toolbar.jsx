import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBudget } from "../core/BudgetProvider";

const Toolbar = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useBudget();
  const fileInputRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Toggle body class and persist theme
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSave = () => {
    console.log("💾 Save triggered (hook up storage logic)");
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
      <div style={{ display: "flex", gap: "1rem" }}>
        <button className="btn btn-muted" style={{ color: 'var(--color-text)' }} onClick={() => navigate("/")}>🏠 Dashboard</button>
        <button className="btn btn-muted" style={{ color: 'var(--color-text)' }} onClick={() => navigate("/expenses")}>💸 Expenses</button>
        <button className="btn btn-muted" style={{ color: 'var(--color-text)' }} onClick={() => navigate("/income")}>💰 Income</button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button className="btn btn-muted" style={{ color: 'var(--color-text)' }} onClick={handleSave}>💾 Save</button>
        <button className="btn btn-muted" style={{ color: 'var(--color-text)' }} onClick={handlePrint}>🖨️ Print</button>
        <button className="btn btn-muted" style={{ color: 'var(--color-text)' }} onClick={() => fileInputRef.current?.click()}>
          📥 Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: "none" }}
        />
        <button className="btn btn-muted" style={{ color: 'var(--color-text)' }} onClick={handleExport}>📤 Export</button>
        <button className="btn btn-muted" style={{ color: 'var(--color-text)' }} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
};

export default Toolbar;
