import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const AdminSidebar = ({ active }) => {
  return (
    <section id="side-menu">
      <Logo />
      <div style={{ marginBottom: "20px" }}>
        <p>
          Welcome, <b>Admin</b>
        </p>
      </div>
      <ul>
        <li>
          <Link to="/admin" style={{ color: `${active === 1 && "black"}` }}>
            <i className="bx bx-home"></i> Home
          </Link>
        </li>
        <li>
          <Link
            to="/create-account"
            style={{ color: `${active === 2 && "black"}` }}
          >
            <i className="bx bx-user-pin"></i> Create Account
          </Link>
        </li>
        <li>
          <Link
            style={{ color: "#ef4444" }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("currUser");
              window.location = "/";
            }}
          >
            <i className="bx bx-log-out"></i> Logout
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default AdminSidebar;
