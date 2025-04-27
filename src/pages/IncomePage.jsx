import { useState, useRef, useEffect } from "react";
import { useBudget } from "../core/BudgetProvider";
import { formatCurrency } from "../utils/format/formatCurrency";
import PromptModal from "../modals/PromptModal";

const IncomePage = () => {
  const { state, dispatch } = useBudget();
  const [menuIndex, setMenuIndex] = useState(null);
  const [prompt, setPrompt] = useState({ show: false, title: "", fields: null, onSubmit: null });
  const menuRef = useRef(null);

  const monthData = state.months[state.currentMonth] || {};
  const income = monthData.income || [];

  const toggleMenu = (index) => {
    setMenuIndex(prev => (prev === index ? null : index));
  };

  const updateField = (index, field, value) => {
    const updated = [...income];
    updated[index][field] = value;
    dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, income: updated } });
  };

  const startAddIncome = () => {
    setPrompt({
      show: true,
      title: "Add New Income",
      submitLabel: "Save",
      fields: [
        { name: "source", label: "Source *", required: true },
        { name: "amount", label: "Amount *", required: true },
        { 
          name: "date", 
          label: "Date Received *", 
          type: "date",
          required: true 
        }
      ],
      onSubmit: (values) => {
        const updated = [...income, {
          source: values.source,
          amount: parseFloat(values.amount),
          date: values.date
        }];
        dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, income: updated } });
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

  // Handler generator for edit operations
  const getEditHandler = (fieldName, fieldLabel, index) => {
    const isDateField = fieldName === 'date';
    return {
      show: true,
      title: `Edit ${fieldLabel}`,
      fields: [
        { 
          name: fieldName, 
          label: `${fieldLabel}${isDateField ? '' : ' *'}`, 
          type: isDateField ? "date" : undefined,
          required: !isDateField
        }
      ],
      submitLabel: "Save",
      onSubmit: (values) => {
        updateField(index, fieldName, isDateField ? values[fieldName] : parseFloat(values[fieldName]));
        setPrompt({ show: false });
      }
    };
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>💰 Income</h1>
      <div className="table-container">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-muted)", color: "var(--color-text)", fontWeight: "600" }}>
              <th style={{ width: "1px", padding: "0.5rem 0.75rem", textAlign: "left" }}></th>
              <th style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}>Source</th>
              <th style={{ padding: "0.5rem 0.75rem", textAlign: "right" }}>Amount</th>
              <th style={{ padding: "0.5rem 0.75rem", textAlign: "center" }}>Date Received</th>
            </tr>
          </thead>
          <tbody>
            {income.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd", minHeight: "40px" }}>
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
                        <button 
                          className="dropdown-button" 
                          onClick={() => setPrompt(getEditHandler("source", "Source", index))}
                        >
                          Edit Source
                        </button>
                        <button 
                          className="dropdown-button" 
                          onClick={() => setPrompt(getEditHandler("amount", "Amount", index))}
                        >
                          Edit Amount
                        </button>
                        <button 
                          className="dropdown-button" 
                          onClick={() => setPrompt(getEditHandler("date", "Date Received", index))}
                        >
                          Edit Date
                        </button>
                        <button 
                          className="dropdown-button" 
                          onClick={() => {
                            setPrompt({
                              show: true,
                              title: "Confirm Delete",
                              label: "Are you sure you want to delete this income? This action cannot be undone.",
                              confirmationOnly: true,
                              submitLabel: "Delete",
                              onSubmit: () => {
                                const updated = [...income];
                                updated.splice(index, 1);
                                dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, income: updated } });
                                setPrompt({ show: false });
                              }
                            });
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: "0.5rem 0.75rem" }}>{item.source}</td>
                <td style={{ padding: "0.5rem 0.75rem", textAlign: "right" }}>{formatCurrency(item.amount)}</td>
                <td style={{ padding: "0.5rem 0.75rem", textAlign: "center" }}>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="centered" style={{ marginTop: "1.5rem" }}>
        <button className="btn btn-primary" onClick={startAddIncome}>➕ Add New Income</button>
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

export default IncomePage;