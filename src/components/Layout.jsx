import { Outlet } from "react-router-dom";
import { useBudget } from "../core/BudgetProvider";
import { useRef, useState, useEffect } from "react";
import ToolbarTabs from "./ToolbarTabs";

const Layout = () => {
  const fileInputRef = useRef(null);
  const { state, dispatch } = useBudget();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSave = () => console.log("💾 Save triggered");
  const handlePrint = () => window.print();
  const handleExport = () => {
    const json = JSON.stringify({ currentMonth: state.currentMonth, months: state.months }, null, 2);
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
    <div>
      <ToolbarTabs />

      <div className="toolbar-actions">
        <button className="btn btn-muted" onClick={handleSave}>💾 Save</button>
        <button className="btn btn-muted" onClick={handlePrint}>🖨️ Print</button>
        <button className="btn btn-muted" onClick={() => fileInputRef.current?.click()}>📥 Import</button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
        <button className="btn btn-muted" onClick={handleExport}>📤 Export</button>
        <button className="btn btn-muted" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <main style={{ padding: "1.5rem", marginTop: "-1px", backgroundColor: "var(--color-bg)" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
