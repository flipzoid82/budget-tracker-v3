import { useLocation, useNavigate } from "react-router-dom";

const ToolbarTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      display: "flex",
      gap: "0.5rem",
      padding: "1rem 1.5rem 0 1.5rem",
      background: "var(--color-surface)",
      borderBottom: "1px solid var(--color-muted)"
    }}>
      <button className={isActive("/") ? "tab-button active" : "tab-button"} onClick={() => navigate("/")}>🏠 Dashboard</button>
      <button className={isActive("/expenses") ? "tab-button active" : "tab-button"} onClick={() => navigate("/expenses")}>💸 Expenses</button>
      <button className={isActive("/income") ? "tab-button active" : "tab-button"} onClick={() => navigate("/income")}>💰 Income</button>
    </div>
  );
};

export default ToolbarTabs;
