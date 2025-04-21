
import { useBudget } from "../core/BudgetProvider";

// Helper to convert MM/DD/YYYY into a Date object
const parseDate = (str) => {
  const [month, day, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
};

// Determine urgency level based on how many days until due
const getUrgency = (dueDate) => {
  const today = new Date();
  const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  if (daysDiff < 0) return "urgent";    // Overdue
  if (daysDiff <= 3) return "soon";     // Due very soon
  return "future";                      // Not urgent
};

const UpcomingBills = () => {
  const { state } = useBudget();
  const monthData = state.months[state.currentMonth] || {};
  const expenses = monthData.expenses || [];

  const unpaid = expenses.filter((e) => !e.paidDate);
  const sorted = unpaid.sort((a, b) => parseDate(a.dueDate) - parseDate(b.dueDate)).slice(0, 6);

  const urgentBills = [];
  const upcomingBills = [];

  for (let bill of sorted) {
    const urgency = getUrgency(parseDate(bill.dueDate));
    if (urgency === "urgent") urgentBills.push(bill);
    else upcomingBills.push(bill);
  }

  if (urgentBills.length === 0 && upcomingBills.length === 0) return null;

  return (
    <div style={{
      border: "1px solid var(--color-muted)",
      borderRadius: "8px",
      padding: "1rem",
      marginTop: "1rem",
      background: "rgba(168, 150, 93, 0.15)",
      color: "var(--color-text)"
    }}>
      {urgentBills.length > 0 && (
        <>
          <h3 style={{ color: "var(--color-text)" }}>❗ Urgent Bills</h3>
          <ul style={{ paddingLeft: "1rem", color: "var(--color-text)" }}>
            {urgentBills.map((bill, index) => (
              <li key={`urgent-${index}`}>
                🔴 <strong>{bill.name}</strong> — {bill.dueDate} (${bill.amount.toFixed(2)})
              </li>
            ))}
          </ul>
        </>
      )}

      {upcomingBills.length > 0 && (
        <>
          <h3 style={{ marginTop: "1rem", color: "var(--color-text)" }}>🕒 Upcoming Bills</h3>
          <ul style={{ paddingLeft: "1rem", color: "var(--color-text)" }}>
            {upcomingBills.map((bill, index) => {
              const due = parseDate(bill.dueDate);
              const daysDiff = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
              const emoji = daysDiff <= 3 ? "🟡" : "🟢";
              return (
                <li key={`upcoming-${index}`}>
                  {emoji} <strong>{bill.name}</strong> — {bill.dueDate} (${bill.amount.toFixed(2)})
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default UpcomingBills;
