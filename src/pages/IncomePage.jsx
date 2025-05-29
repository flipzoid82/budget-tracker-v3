import { useState, useRef, useEffect } from "react";
import { useBudget } from "../core/BudgetProvider";
import { formatCurrency } from "../utils/format/formatCurrency";
import PromptModal from "../modals/PromptModal";
import IconEdit from "../components/icons/IconEdit";
import UpArrowIcon from "../components/icons/UpArrowIcon";
import DownArrowIcon from "../components/icons/DownArrowIcon";

const IncomePage = () => {
  const { state, dispatch } = useBudget();
  const [menuIndex, setMenuIndex] = useState(null);
  const [prompt, setPrompt] = useState({ show: false, title: "", fields: null, onSubmit: null });
  const [sortConfig, setSortConfig] = useState({ key: 'source', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const monthData = state.months[state.currentMonth] || {};
  const income = monthData.income || [];

  const toggleMenu = (index) => {
    setMenuIndex(prev => (prev === index ? null : index));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? <UpArrowIcon /> : <DownArrowIcon />;
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

  //DeleteMonth: Triggers Delete Month
  const triggerDeleteMonth = () => {
    setPrompt({
      show: true,
      title: "Delete This Month?",
      label: `Are you sure you want to permanently delete ${state.currentMonth}? This action cannot be undone.`,
      confirmationOnly: true,
      submitLabel: "Delete",
      onSubmit: async () => {
        const res = await window.api.invoke("delete-month", state.currentMonth);
        if (res.success && res.months.length) {
          dispatch({
            type: "INIT",
            payload: {
              currentMonth: res.months[0].name,
              months: Object.fromEntries(res.months.map(m => [m.name, {}]))
            }
          });
        } else if (res.success && res.months.length === 0) {
          dispatch({ type: "INIT", payload: { currentMonth: "", months: {} } });
        }
        setPrompt({ show: false });
      }
    });
  };

  const sortedIncome = [...income].sort((a, b) => {
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    if (a[sortConfig.key] < b[sortConfig.key]) return -1 * dir;
    if (a[sortConfig.key] > b[sortConfig.key]) return 1 * dir;
    return 0;
  });

  const filteredIncome = sortedIncome.filter(item =>
    item.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>💰 Income</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search income..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.4rem 0.75rem",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "300px"
          }}
        />
      </div>
      <div className="table-container income-table">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-muted)", color: "var(--color-text)", fontWeight: "600" }}>
              <th style={{ paddingLeft: "4rem", textAlign: "left",cursor: "pointer" }} onClick={() => handleSort("source")}>
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  Source {getSortIndicator("source")}
                </span>
              </th>
              <th style={{ textAlign: "right", cursor: "pointer" }} onClick={() => handleSort("amount")}>
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  Amount {getSortIndicator("amount")}
                </span>
              </th>
              <th style={{ textAlign: "center", cursor: "pointer" }} onClick={() => handleSort("date")}>
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  Date {getSortIndicator("date")}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredIncome.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "1rem", fontStyle: "italic" }}>
                  No matching income found.
                </td>
              </tr>
            ) : (
              filteredIncome.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "left" }}>
                            <div className="expense-row">
                              <div className="dropdown-anchor">
                                <button className="icon-button" onClick={() => toggleMenu(index)}>
                                  <IconEdit />
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
                      <span style={{ marginLeft: "0.5rem" }}>{item.source}</span>
                    </div>
                  </td>
                          <td style={{ padding: "0", textAlign: "right" }}>{formatCurrency(item.amount)}</td>
                          <td style={{ padding: "0", textAlign: "center" }}>{item.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
        <button className="btn btn-primary" onClick={startAddIncome}>➕ Add New Income</button>
        <button className="btn btn-danger" onClick={triggerDeleteMonth}>🗑 Delete This Month</button>
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