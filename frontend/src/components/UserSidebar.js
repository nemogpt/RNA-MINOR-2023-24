import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const UserSidebar = ({ active, acDetails }) => {
  // console.log(acDetails)
  return (
    <section id="side-menu">
      <Logo />
      <div style={{ marginBottom: "20px" }}>
        <p style={{ marginTop: "4px" }}>
          Welcome, <b style={{fontSize: '13px'}}>{acDetails?.full_name}</b>
        </p>
        <p style={{ color: "black", marginTop: "4px" }}>
          A/c No: <b style={{fontSize: '13px'}}>{acDetails?.account_no}</b>
        </p>
        <p style={{ marginTop: "4px" }}>
          Account Type:{" "}
          <b style={{fontSize: '13px'}}>
            {acDetails?.ac_type === 0
              ? "Saving"
              : acDetails?.ac_type === 1
              ? "Current"
              : "Credit"}
          </b>
        </p>
      </div>
      <ul>
        <li>
          <Link style={{ color: `${active === 1 && "black"}` }} to="/dashboard">
            <i className="bx bx-home"></i> Home
          </Link>
        </li>
        <li>
          <Link style={{ color: `${active === 2 && "black"}` }} to="/withdraw">
            <i class="bx bx-money-withdraw"></i> Withdraw
          </Link>
        </li>
        <li>
          <Link style={{ color: `${active === 3 && "black"}` }} to="/transfer">
            <i className="bx bx-user-pin"></i> Transfer Funds
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

export default UserSidebar;
