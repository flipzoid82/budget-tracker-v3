import { useBudget } from "../core/BudgetProvider";
import { useState } from "react";
import PromptModal from "../modals/PromptModal";
import ErrorModal from "../modals/ErrorModal";

const MonthSelector = () => {
  const { state, dispatch } = useBudget();
  const [showPrompt, setShowPrompt] = useState(false);
  const [copyPrevious, setCopyPrevious] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(state.currentMonth);
  const [errorMessage, setErrorMessage] = useState(""); // ❗ new

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    dispatch({ type: "SET_MONTH", payload: value });
  };

  const handleNewMonth = () => {
    setShowPrompt(true);
  };

  const handleAddMonth = async (values) => {
    const monthName = values.monthName.trim();
    const copy = values.copyPrevious === "true" || values.copyPrevious === true;

    const result = await window.api.invoke("add-month", {
      name: monthName,
      copyPrevious: copy,
      source: state.currentMonth
    });

    if (result.success) {
      const newState = {
        currentMonth: monthName,
        months: Object.fromEntries(result.months.map(m => [m.name, {}]))
      };
      dispatch({ type: "INIT", payload: newState });
      setShowPrompt(false);
    } else {
      // 🧱 Replace alert with ErrorModal
      const msg = result.error === "DUPLICATE_MONTH"
        ? "The month name selected already exists. Please choose a unique name."
        : "Something went wrong while creating the month. Please try again.";
      setErrorMessage(msg);
    }
    console.log("🧪 Result error code:", result.error);
  };

  if (!state.months || Object.keys(state.months).length === 0) {
    return <p style={{ padding: "1rem" }}>No months available. Please create one.</p>;
  }

  return (
    <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <label style={{ fontWeight: "bold" }}>Select Month:</label>
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
      <button className="btn btn-primary" onClick={handleNewMonth}>
        ➕ New Month
      </button>

      {showPrompt && (
        <PromptModal
          title="Create New Month"
          submitLabel="Create"
          fields={[
            {
              name: "monthName",
              label: "Month Name (e.g. MAY2025)",
              required: true
            },
            {
              name: "copyPrevious",
              label: "Copy previous month’s data?",
              type: "checkbox"
            }
          ]}
          onSubmit={handleAddMonth}
          onClose={() => setShowPrompt(false)}
        />
      )}

      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </div>
  );
};

export default MonthSelector;
