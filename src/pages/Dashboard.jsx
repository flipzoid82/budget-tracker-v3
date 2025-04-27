import UpcomingBills from "../components/UpcomingBills";
import { useBudget } from "../core/BudgetProvider";
import { formatCurrency } from "../utils/format/formatCurrency";

const Dashboard = () => {
  const { state } = useBudget();
  const monthData = state.months[state.currentMonth] || {};
  const income = monthData.income || [];
  const expenses = monthData.expenses || [];
  const misc = monthData.misc || [];

  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    + misc.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const unpaidTotal = expenses
    .filter((e) => !e.paidDate)
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const surplus = totalIncome - totalExpenses;

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>📊 Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--gap)" }}>
        <div className="card">
          <h3>Total Income</h3>
          <p>{formatCurrency(totalIncome)}</p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <p>{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="card">
          <h3>Unpaid Bills</h3>
          <p>{formatCurrency(unpaidTotal)}</p>
        </div>
        <div className="card">
          <h3>Surplus</h3>
          <p>{formatCurrency(surplus)}</p>
        </div>
      </div>

      <UpcomingBills />
    </div>
  );
};

export default Dashboard;
