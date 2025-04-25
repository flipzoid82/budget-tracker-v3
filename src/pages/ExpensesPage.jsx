import { useState, useRef, useEffect } from "react";
import { useBudget } from "../core/BudgetProvider";
import PromptModal from "../modals/PromptModal";

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);

const ExpensesPage = () => {
  const { state, dispatch } = useBudget();
  const [menuIndex, setMenuIndex] = useState(null);
  const [prompt, setPrompt] = useState({ show: false, label: "", initialValue: "", onSubmit: null });
  const [showAdd, setShowAdd] = useState(false);
  const menuRef = useRef(null);

  const [newBill, setNewBill] = useState({
    name: "", amount: "", dueDate: "", paidDate: "", confirmation: "", url: ""
  });

  const monthData = state.months[state.currentMonth] || {};
  const expenses = monthData.expenses || [];

  // 💬 Toggle visibility of dropdown
const toggleMenu = (index) => {
    setMenuIndex(prev => prev === index ? null : index);
  };

  // 💬 Update a specific field for the selected row
const updateField = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, expenses: updated } });
  };

  const markAsPaid = (index) => {
    const today = new Date().toLocaleDateString("en-US");
    setPrompt({
      show: true,
      label: "Enter confirmation number:",
      initialValue: "",
      onSubmit: (confirmation) => {
        const updated = [...expenses];
        updated[index].paidDate = today;
        updated[index].confirmation = confirmation;
        dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, expenses: updated } });
        setPrompt({ show: false });
      },
    });
  };

  const undoPayment = (index) => {
    const updated = [...expenses];
    updated[index].paidDate = "";
    updated[index].confirmation = "";
    dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, expenses: updated } });
  };

  const handleAddBill = () => {
    const { name, dueDate, amount } = newBill;
    if (!name.trim() || !dueDate.trim() || !amount.toString().trim()) {
      alert("Bill name, due date, and amount are required.");
      return;
    }

    const updated = [...expenses, {
      ...newBill,
      amount: parseFloat(amount),
    }];

    dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, expenses: updated } });
    setNewBill({ name: "", amount: "", dueDate: "", paidDate: "", confirmation: "", url: "" });
    setShowAdd(false);
  };

  // Close edit menu when clicking outside
  // 💬 Handle closing dropdown on outside click
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
      <h1>💸 Expenses</h1>
      <div className="table-container">
        <table style={{ width: "100%" }}>
          <thead>
            <tr style={{ background: "var(--color-muted)", color: "var(--color-text)" }}>
              <th></th>
              <th>Name</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Paid Date</th>
              <th>Confirmation #</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((item, index) => {
              const isPaid = !!item.paidDate;
              return (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ paddingLeft: "0rem", display: "flex", alignItems: "center", position: "relative", textAlign: "center" }}>
                  <div className="dropdown-anchor">
                    <button
                      onClick={() => toggleMenu(index)}
                      className="btn btn-muted"
                      style={{ padding: "0.2rem", fontSize: "1rem" }}
                    >
                      ✏️
                    </button>
                  </div>
                    {menuIndex === index && (
                      <div ref={menuRef} className="dropdown-menu">
                        <button className="dropdown-button" onClick={() => {
                          setPrompt({
                            show: true,
                            label: "Edit URL",
                            initialValue: item.url || "",
                            onSubmit: (val) => {
                              updateField(index, "url", val);
                              setPrompt({ show: false });
                            }
                          });
                        }}>Edit URL</button>
                        <button className="dropdown-button" onClick={() => {
                          setPrompt({
                            show: true,
                            label: "Edit Due Date",
                            initialValue: item.dueDate,
                            onSubmit: (val) => {
                              updateField(index, "dueDate", val);
                              setPrompt({ show: false });
                            }
                          });
                        }}>Edit Due Date</button>
                        <button className="dropdown-button" onClick={() => {
                          setPrompt({
                            show: true,
                            label: "Edit Confirmation #",
                            initialValue: item.confirmation || "",
                            onSubmit: (val) => {
                              updateField(index, "confirmation", val);
                              setPrompt({ show: false });
                            }
                          });
                        }}>Edit Confirmation</button>
                        <button
                          className="dropdown-button"
                          onClick={() => {
                            setPrompt({
                              show: true,
                              label: "Are you sure you want to delete this expense?",
                              initialValue: "",
                              submitLabel: "Delete",
                              onSubmit: () => {
                                const updated = [...monthData.expenses];
                                updated.splice(index, 1);
                                dispatch({ type: "UPDATE_MONTH_DATA", payload: { ...monthData, expenses: updated } });
                                setPrompt({ show: false });
                              }
                            });
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="align-left">{item.name}</td>
                  <td className="align-left">{formatCurrency(item.amount)}</td>
                  <td className="align-center">{item.dueDate}</td>
                  <td className="align-center">{item.paidDate || "—"}</td>
                  <td className="align-center">{item.confirmation || "—"}</td>
                  <td className="align-left">{isPaid ? "✅ Paid" : "❌ Unpaid"}</td>
                  <td className="align-center">
                    {isPaid ? (
                      <button className="btn btn-muted action-button" onClick={() => undoPayment(index)}>Undo</button>
                    ) : (
                      <button className="btn btn-primary action-button" onClick={() => markAsPaid(index)}>Mark as Paid</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <button className="btn btn-primary action-button" onClick={() => setShowAdd(true)}>➕ Add New Bill</button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Add New Bill</h3>
          <input className="input" placeholder="Bill Name *" value={newBill.name} onChange={(e) => setNewBill({ ...newBill, name: e.target.value })} />
          <input className="input" placeholder="Amount *" value={newBill.amount} onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })} />
          <input className="input" placeholder="Due Date (MM/DD/YYYY) *" value={newBill.dueDate} onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })} />
          <input className="input" placeholder="Confirmation # (optional)" value={newBill.confirmation} onChange={(e) => setNewBill({ ...newBill, confirmation: e.target.value })} />
          <input className="input" placeholder="URL (optional)" value={newBill.url} onChange={(e) => setNewBill({ ...newBill, url: e.target.value })} />
          <div style={{ marginTop: "1rem" }}>
            <button className="btn btn-primary action-button" onClick={handleAddBill}>Save</button>
            <button className="btn btn-muted action-button" onClick={() => setShowAdd(false)} style={{ marginLeft: "0.5rem" }}>Cancel</button>
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

export default ExpensesPage;
