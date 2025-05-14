import { createContext, useReducer, useContext, useEffect } from "react";

const BudgetContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        currentMonth: action.payload.currentMonth,
        months: action.payload.months,
      };
    case "SET_MONTH":
      return { ...state, currentMonth: action.payload };
    case "UPDATE_MONTH_DATA":
      return {
        ...state,
        months: {
          ...state.months,
          [state.currentMonth]: {
            expenses: action.payload.expenses || [],
            income: action.payload.income || [],
            misc: action.payload.misc || [],
          },
        },
      };
    default:
      return state;
  }
};

export const BudgetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    currentMonth: "",
    months: {},
  });

  // Load months and default month data on app load
  useEffect(() => {
    const init = async () => {
      const monthsArray = await window.api.invoke("get-months");
      if (monthsArray.length > 0) {
        const currentMonth = monthsArray[0].name;

        const monthsMap = {};
        monthsArray.forEach((m) => {
          monthsMap[m.name] = { expenses: [], income: [], misc: [] };
        });

        dispatch({ type: "INIT", payload: { currentMonth, months: monthsMap } });

        const [rawExpenses, income, misc] = await Promise.all([
          window.api.invoke("get-expenses", currentMonth),
          window.api.invoke("get-income", currentMonth),
          window.api.invoke("get-misc", currentMonth),
        ]);

        const expenses = rawExpenses.map((e) => ({
          ...e,
          dueDate: e.due_date,
          paidDate: e.paid_date,
          confirmation: e.confirmation,
        }));

        dispatch({
          type: "UPDATE_MONTH_DATA",
          payload: { expenses, income, misc },
        });

        console.log("✅ Loaded initial data for", currentMonth);
      }
    };

    init();
  }, []);

  // Load new data when selected month changes
  useEffect(() => {
    const fetchMonthData = async () => {
      if (!state.currentMonth) return;

      const [rawExpenses, income, misc] = await Promise.all([
        window.api.invoke("get-expenses", state.currentMonth),
        window.api.invoke("get-income", state.currentMonth),
        window.api.invoke("get-misc", state.currentMonth),
      ]);

      const expenses = rawExpenses.map((e) => ({
        ...e,
        dueDate: e.due_date,
        paidDate: e.paid_date,
        confirmation: e.confirmation,
      }));

      dispatch({
        type: "UPDATE_MONTH_DATA",
        payload: { expenses, income, misc },
      });

      console.log("🔁 Switched to:", state.currentMonth);
    };

    fetchMonthData();
  }, [state.currentMonth]);

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
