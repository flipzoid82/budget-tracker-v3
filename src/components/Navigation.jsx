import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <nav style={{ padding: "1rem", background: "#f4f4f4" }}>
      <NavLink to="/" style={{ marginRight: "1rem" }}>🏠 Dashboard</NavLink>
      <NavLink to="/expenses" style={{ marginRight: "1rem" }}>💸 Expenses</NavLink>
      <NavLink to="/income">💰 Income</NavLink>
    </nav>
  );
};

export default Navigation;
