import React, { useEffect, useState } from "react";
import { AdminDashboard } from "./AdminDashboard";
import { UserDashboard } from "./UserDashboard";
import { LocalData } from "../Data";
import { Logo } from "./Logo";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export default function LoginPage() {
  // useState hooks
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  // change state
  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  const changePassword = (event) => {
    setPassword(event.target.value);
  };
  const onSubmit = (event) => {
    event.preventDefault(); // prevents jumping to url
    return login(username, password);
  };

  // Login function
  const login = async (username, password) => {
    if (await loginSuccess(username, password)) {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  // Login success
  const loginSuccess = async (username, password) => {
    const request = await axios.post(
      "http://localhost:5000/auth/",
      {
        customer_id: username,
        password,
      },
      { withCredentials: true }
    );

    alert(Object.keys(request.data));

    if (request.status !== 200) {
      return false;
    } else {
      localStorage.setItem("token", request.data?.token);
      if (request.data?.is_admin) {
        setIsAdmin(true);
      }
      toast.success(request.data?.msg, { position: "top-center" });
      return true;
    }
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("currUser");
    localStorage.removeItem("token");
    toast.success("You have logged out", { position: "top-center" });
  };

  // Redirect to corresponding pages
  if (isLoggedIn) {
    localStorage.setItem("currUser", JSON.stringify(currUser));
    if (isAdmin) {
      window.location = "/admin";
    } else {
      window.location = "/dashboard";
    }
  }

  return (
    <div id="login-page">
      <div id="login">
        <Logo />
        <form onSubmit={onSubmit}>
          <label htmlFor="username">Customer ID</label>
          <input
            id="username"
            autoComplete="off"
            onChange={changeUsername}
            value={username}
            type="text"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            autoComplete="off"
            onChange={changePassword}
            value={password}
            type="password"
          />

          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
