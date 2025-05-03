// MonthSelector.jsx
import { useBudget } from "../core/BudgetProvider";

const MonthSelector = () => {
  const { state, dispatch } = useBudget();

  const handleChange = (e) => {
    dispatch({ type: "SET_MONTH", payload: e.target.value });
  };

  if (!state.months || Object.keys(state.months).length === 0) {
    return <p style={{ padding: "1rem" }}>No months available. Please create one.</p>;
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Select Month:</label>
      <select
        value={state.currentMonth}
        onChange={handleChange}
        className="month-selector"
        title="Select Month"
      >
        {Object.keys(state.months).map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
