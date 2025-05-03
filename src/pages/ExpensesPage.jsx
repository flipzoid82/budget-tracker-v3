import { useState, useRef, useEffect } from "react";
import { useBudget } from "../core/BudgetProvider";
import { formatCurrency } from "../utils/format/formatCurrency";
import PromptModal from "../modals/PromptModal";
import IconEdit from "../components/icons/IconEdit";

const ExpensesPage = () => {
  const { state, dispatch } = useBudget();
  const [menuIndex, setMenuIndex] = useState(null);
  const [prompt, setPrompt] = useState({ 
    show: false, 
    title: "", 
    fields: null, 
    submitLabel: "", 
    onSubmit: null 
  });
  const menuRef = useRef(null);

  const monthData = state.months[state.currentMonth] || {};
  const expenses = monthData.expenses || [];

  const toggleMenu = (index) => {
    setMenuIndex((prev) => (prev === index ? null : index));
  };

  const updateField = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    dispatch({ 
      type: "UPDATE_MONTH_DATA", 
      payload: { ...monthData, expenses: updated } 
    });
  };

  const startAddExpense = () => {
    setPrompt({
      show: true,
      title: "Add New Expense",
      submitLabel: "Save",
      fields: [
        { 
          name: "name", 
          label: "Bill Name", 
          required: true 
        },
        { 
          name: "amount", 
          label: "Amount", 
          required: true 
        },
        { 
          name: "dueDate", 
          label: "Due Date", 
          type: "date",
          required: true 
        }
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
        dispatch({ 
          type: "UPDATE_MONTH_DATA", 
          payload: { ...monthData, expenses: updated } 
        });
        setPrompt({ show: false });
      }
    });
  };

  const getEditHandler = (fieldName, fieldLabel, index, isDate = false) => {
    return {
      show: true,
      title: `Edit ${fieldLabel}`,
      fields: [
        { 
          name: fieldName, 
          label: fieldLabel, 
          type: isDate ? "date" : undefined,
          required: true 
        }
      ],
      submitLabel: "Save",
      onSubmit: (values) => {
        updateField(index, fieldName, values[fieldName]);
        setPrompt({ show: false });
      }
    };
  };

  const handleDelete = (index) => {
    setPrompt({
      show: true,
      title: "Confirm Delete",
      label: "Are you sure you want to delete this expense? This action cannot be undone.",
      confirmationOnly: true,
      submitLabel: "Delete",
      onSubmit: () => {
        const updated = [...expenses];
        updated.splice(index, 1);
        dispatch({ 
          type: "UPDATE_MONTH_DATA", 
          payload: { ...monthData, expenses: updated } 
        });
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
                      className="icon-button">
                      <IconEdit/>
                    </button>
                    {menuIndex === index && (
                      <div ref={menuRef} className="dropdown-menu">
                        <button 
                          className="dropdown-button" 
                          onClick={() => setPrompt(getEditHandler("name", "Bill Name", index))}
                        >
                          Edit Name
                        </button>
                        <button 
                          className="dropdown-button" 
                          onClick={() => setPrompt(getEditHandler("amount", "Amount", index))}
                        >
                          Edit Amount
                        </button>
                        <button 
                          className="dropdown-button" 
                          onClick={() => setPrompt(getEditHandler("dueDate", "Due Date", index, true))}
                        >
                          Edit Due Date
                        </button>
                        <button 
                          className="dropdown-button" 
                          onClick={() => setPrompt(getEditHandler("url", "URL", index))}
                        >
                          Edit URL
                        </button>
                        <button 
                          className="dropdown-button" 
                          onClick={() => setPrompt(getEditHandler("confirmation", "Confirmation #", index))}
                        >
                          Edit Confirmation
                        </button>
                        <button 
                          className="dropdown-button" 
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
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