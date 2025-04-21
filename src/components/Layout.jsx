import { Outlet } from "react-router-dom";
import Toolbar from "./Toolbar";

const Layout = () => {
  return (
    <div>
      <Toolbar />
      <main style={{ padding: "1.5rem" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
