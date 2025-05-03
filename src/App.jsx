import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ExpensesPage from "./pages/ExpensesPage";
import IncomePage from "./pages/IncomePage";
import { BudgetProvider } from "./core/BudgetProvider";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <BudgetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout 
              toggleDarkMode={toggleDarkMode}
              darkMode={darkMode}
            />
          }>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="income" element={<IncomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BudgetProvider>
  );
}

export default App;
