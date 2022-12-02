import React, { useEffect, useState } from "react";
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
            placeholder="Enter Customer ID"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            autoComplete="off"
            onChange={changePassword}
            value={password}
            type="password"
            placeholder="Enter Password"
          />

          <button type="submit" className="btn green">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
