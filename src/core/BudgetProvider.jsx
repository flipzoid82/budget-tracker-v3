import { createContext, useReducer, useContext } from "react";

const BudgetContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_MONTH":
      return { ...state, currentMonth: action.payload };
    default:
      return state;
  }
};

export const BudgetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    currentMonth: "APR2025",
    months: {},
  });

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
