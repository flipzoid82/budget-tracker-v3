import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <>
      <Navigation />
      <main style={{ padding: "1.5rem" }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
