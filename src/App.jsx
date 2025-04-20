import Dashboard from "./components/Dashboard";
import ExpenseTable from "./components/ExpenseTable";
import { BudgetProvider } from "./core/BudgetProvider";

const App = () => (
  <BudgetProvider>
    <h1>💰 Budget Tracker V3</h1>
    <Dashboard />
    <ExpenseTable />
  </BudgetProvider>
);

export default App;
