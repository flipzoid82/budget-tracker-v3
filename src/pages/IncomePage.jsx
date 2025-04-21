import { useState, useRef, useEffect } from "react";
import { useBudget } from "../core/BudgetProvider";
import { formatCurrency } from "../utils/formatCurrency";
import PromptModal from "../modals/PromptModal";

const IncomePage = () => {
  const { state, dispatch } = useBudget();
  const [menuIndex, setMenuIndex] = useState(null);
  const [prompt, setPrompt] = useState({ show: false, label: "", initialValue: "", onSubmit: null });
  const [showAdd, setShowAdd] = useState(false);
  const menuRef = useRef(null);

  const [newIncome, setNewIncome] = useState({ source: "", amount: "", date: "" });
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

  const handleAddIncome = () => {
    const { source, amount, date } = newIncome;
    if (!source.trim() || !amount.toString().trim() || !date.trim()) {
      alert("Source, date, and amount are required.");
      return;
    }
    const updated = [...income, { ...newIncome, amount: parseFloat(amount) }];
    dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, income: updated } });
    setNewIncome({ source: "", amount: "", date: "" });
    setShowAdd(false);
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
                  <button
                    onClick={() => toggleMenu(index)}
                    className="btn btn-muted"
                    style={{ padding: "0.2rem", fontSize: "1rem" }}
                  >
                    ✏️
                  </button>
                  {menuIndex === index && (
                    <div
                      ref={menuRef}
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-muted)",
                        borderRadius: "6px",
                        padding: "0.5rem",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        zIndex: 100,
                        minWidth: "140px"
                      }}
                    >
                      <button className="dropdown-button" onClick={() => {
                        setPrompt({ show: true, label: "Edit Source", initialValue: item.source, onSubmit: (val) => {
                          updateField(index, "source", val); setPrompt({ show: false });
                        }});
                      }}>Edit Source</button><br />
                      <button className="dropdown-button" onClick={() => {
                        setPrompt({ show: true, label: "Edit Amount", initialValue: item.amount, onSubmit: (val) => {
                          updateField(index, "amount", parseFloat(val)); setPrompt({ show: false });
                        }});
                      }}>Edit Amount</button><br />
                      <button className="dropdown-button" onClick={() => {
                        setPrompt({ show: true, label: "Edit Date", initialValue: item.date, onSubmit: (val) => {
                          updateField(index, "date", val); setPrompt({ show: false });
                        }});
                      }}>Edit Date</button>
                    </div>
                  )}
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
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>➕ Add New Income</button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Add New Income</h3>
          <input className="input" placeholder="Source *" value={newIncome.source} onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })} />
          <input className="input" placeholder="Amount *" value={newIncome.amount} onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })} />
          <input className="input" placeholder="Date Received (MM/DD/YYYY) *" value={newIncome.date} onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })} />
          <div style={{ marginTop: "1rem" }}>
            <button className="btn btn-primary" onClick={handleAddIncome}>Save</button>
            <button className="btn btn-muted" onClick={() => setShowAdd(false)} style={{ marginLeft: "0.5rem" }}>Cancel</button>
          </div>
        </div>
      )}

      {prompt.show && (
        <PromptModal
          title="Edit Field"
          label={prompt.label}
          initialValue={prompt.initialValue}
          onSubmit={prompt.onSubmit}
          onClose={() => setPrompt({ show: false })}
        />
      )}
    </div>
  );
};

export default IncomePage;
