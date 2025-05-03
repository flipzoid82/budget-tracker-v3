import { Outlet } from "react-router-dom";
import { useBudget } from "../core/BudgetProvider";
import { useRef, useState, useEffect } from "react";
import ToolbarTabs from "./ToolbarTabs";
import MonthSelector from "../components/MonthSelector";
import IconSave from "../components/icons/IconSave";
import IconPrint from "../components/icons/IconPrint";
import IconImport from "../components/icons/IconImport";
import IconDownload from "../components/icons/IconDownload";
import IconMoon from "../components/icons/IconMoon";
import IconMoonOff from "../components/icons/IconMoonOff";

const Layout = ({ toggleDarkMode, darkMode }) => {
  const { state, dispatch } = useBudget();
  
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
 
  const importInputRef = useRef(null); // Add this near top of Layout component

  const handleImportClick = () => {
    if (importInputRef.current) {
      importInputRef.current.click();
    }
  };

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

      <div className="toolbar">
        <div className="toolbar-left">
          <MonthSelector />
        </div>
          <div className="toolbar-actions">
          <button title="Save" className="icon-button" onClick={handleSave}>
            <IconSave />
          </button>
          <button title="Print" className="icon-button" onClick={handlePrint}>
            <IconPrint />
          </button>
          <button title="Import" className="icon-button" onClick={handleImportClick}>
            <IconImport />
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
          <button title="Export" className="icon-button" onClick={handleExport}>
            <IconDownload />
          </button>
          <button
            title={darkMode ? "Light Mode" : "Dark Mode"}
            className="icon-button"
            onClick={toggleDarkMode}
          >
            {darkMode ? <IconMoonOff /> : <IconMoon />}
          </button>
        </div>
      </div>

      <main style={{ padding: "1.5rem", marginTop: "-1px", backgroundColor: "var(--color-bg)" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
