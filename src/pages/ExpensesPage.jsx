
import { useState, useRef, useEffect } from "react";
import { useBudget } from "../core/BudgetProvider";
import { formatCurrency } from "../utils/formatCurrency";
import PromptModal from "../modals/PromptModal";

const ExpensesPage = () => {
  const { state, dispatch } = useBudget();
  const [menuIndex, setMenuIndex] = useState(null);
  const [prompt, setPrompt] = useState({ show: false, title: "", fields: null, submitLabel: "", onSubmit: null });
  const menuRef = useRef(null);

  const monthData = state.months[state.currentMonth] || {};
  const expenses = monthData.expenses || [];

  const toggleMenu = (index) => {
    setMenuIndex((prev) => (prev === index ? null : index));
  };

  const updateField = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, expenses: updated } });
  };

  const startAddExpense = () => {
    setPrompt({
      show: true,
      title: "Add New Expense",
      submitLabel: "Save",
      fields: [
        { name: "name", label: "Bill Name *", required: true },
        { name: "amount", label: "Amount *", required: true },
        { name: "dueDate", label: "Due Date (MM/DD/YYYY) *", required: true }
      ],
      onSubmit: (values) => {
        const updated = [...expenses, {
          name: values.name,
          amount: parseFloat(values.amount),
          dueDate: values.dueDate,
          paidDate: "",
          confirmation: "",
          url: ""
        }];
        dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, expenses: updated } });
        setPrompt({ show: false });
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>📄 Expenses</h1>
      <div className="table-container">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-muted)", color: "var(--color-text)", fontWeight: "600" }}>
              <th style={{ paddingLeft: "0.5rem", textAlign: "left" }}></th>
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "left" }}>Amount</th>
              <th style={{ textAlign: "center" }}>Due Date</th>
              <th style={{ textAlign: "center" }}>Paid Date</th>
              <th style={{ textAlign: "center" }}>Confirmation #</th>
              <th style={{ textAlign: "left" }}>Status</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ paddingLeft: "0rem", width: "1px" }}>
                  <div className="dropdown-anchor">
                    <button
                      onClick={() => toggleMenu(index)}
                      className="btn btn-muted"
                      style={{ padding: "0.2rem", fontSize: "1rem" }}
                    >
                      ✏️
                    </button>
                    {menuIndex === index && (
                      <div ref={menuRef} className="dropdown-menu">
                        <button className="dropdown-button" onClick={() => {
                          setPrompt({
                            show: true,
                            title: "Edit Name",
                            fields: [{ name: "name", label: "Bill Name", required: true }],
                            submitLabel: "Save",
                            onSubmit: (values) => {
                              updateField(index, "name", values.name);
                              setPrompt({ show: false });
                            }
                          });
                        }}>Edit Name</button>
                        <button className="dropdown-button" onClick={() => {
                          setPrompt({
                            show: true,
                            title: "Edit Amount",
                            fields: [{ name: "amount", label: "Amount", required: true }],
                            submitLabel: "Save",
                            onSubmit: (values) => {
                              updateField(index, "amount", parseFloat(values.amount));
                              setPrompt({ show: false });
                            }
                          });
                        }}>Edit Amount</button>
                        <button className="dropdown-button" onClick={() => {
                          setPrompt({
                            show: true,
                            title: "Edit Due Date",
                            fields: [{ name: "dueDate", label: "Due Date (MM/DD/YYYY)", required: true }],
                            submitLabel: "Save",
                            onSubmit: (values) => {
                              updateField(index, "dueDate", values.dueDate);
                              setPrompt({ show: false });
                            }
                          });
                        }}>Edit Due Date</button>
                        <button className="dropdown-button" onClick={() => {
                          setPrompt({
                            show: true,
                            title: "Edit URL",
                            fields: [{ name: "url", label: "Link or URL", required: false }],
                            submitLabel: "Save",
                            onSubmit: (values) => {
                              updateField(index, "url", values.url);
                              setPrompt({ show: false });
                            }
                          });
                        }}>Edit URL</button>
                        <button className="dropdown-button" onClick={() => {
                          setPrompt({
                            show: true,
                            title: "Edit Confirmation #",
                            fields: [{ name: "confirmation", label: "Confirmation #", required: false }],
                            submitLabel: "Save",
                            onSubmit: (values) => {
                              updateField(index, "confirmation", values.confirmation);
                              setPrompt({ show: false });
                            }
                          });
                        }}>Edit Confirmation</button>
                        <button className="dropdown-button" onClick={() => {
                          setPrompt({
                            show: true,
                            title: "Confirm Delete",
                            label: "Are you sure you want to delete this expense? This action cannot be undone.",
                            confirmationOnly: true,
                            submitLabel: "Delete",
                            onSubmit: () => {
                              const updated = [...expenses];
                              updated.splice(index, 1);
                              dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, expenses: updated } });
                              setPrompt({ show: false });
                            }
                          });
                        }}>Delete</button>
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: "left" }}>{item.name}</td>
                <td style={{ textAlign: "left" }}>{formatCurrency(item.amount)}</td>
                <td style={{ textAlign: "center" }}>{item.dueDate}</td>
                <td style={{ textAlign: "center" }}>{item.paidDate || "-"}</td>
                <td style={{ textAlign: "center" }}>{item.confirmation || "-"}</td>
                <td style={{ textAlign: "left" }}>
                  {item.paidDate ? "✅ Paid" : "🕗 Unpaid"}
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="btn btn-primary"
                    style={{ minWidth: "90px" }}
                  >
                    {item.paidDate ? "Undo" : "Mark Paid"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="centered" style={{ marginTop: "1.5rem" }}>
        <button className="btn btn-primary" onClick={startAddExpense}>➕ Add New Bill</button>
      </div>

      {prompt.show && (
        <PromptModal
          title={prompt.title}
          label={prompt.label}
          fields={prompt.fields}
          submitLabel={prompt.submitLabel}
          onSubmit={prompt.onSubmit}
          onClose={() => setPrompt({ show: false })}
          confirmationOnly={prompt.confirmationOnly}
        />
      )}
    </div>
  );
};

export default ExpensesPage;
