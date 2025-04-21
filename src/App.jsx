import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ExpensesPage from "./pages/ExpensesPage";
import IncomePage from "./pages/IncomePage";
import { BudgetProvider } from "./core/BudgetProvider";

function App() {
  return (
    <BudgetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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
