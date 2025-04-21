import { createContext, useReducer, useContext, useEffect } from "react";
import { loadData, saveData } from "../utils/storage";

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
      const updatedMonths = {
        ...state.months,
        [state.currentMonth]: action.payload,
      };
      saveData({ currentMonth: state.currentMonth, months: updatedMonths });
      return {
        ...state,
        months: updatedMonths,
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

  useEffect(() => {
    const init = async () => {
      const data = await loadData();
      dispatch({ type: "INIT", payload: data });
    };
    init();
  }, []);

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
