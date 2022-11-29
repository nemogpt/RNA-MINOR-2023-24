import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import LoginPage from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { CreateAccount } from "./components/CreateAccount";
import { TransferPage } from "./components/TransferPage";
import { TransactPage } from "./components/TransactPage";
import axios from "axios";

const loadAdminData = async () => {
  const token = localStorage.getItem("token");
  console.log("Token is ", token);
  if (!token) return;

  const user_req = await axios.get("http://localhost:5000/auth/alluser", {
    headers: {
      "x-access-token": token,
    },
  });

  console.log(user_req.data);
  return user_req.data;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    loader: loadAdminData,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
    loader: loadAdminData,
  },
  {
    path: "/transfer",
    element: <TransferPage />,
    loader: loadAdminData,
  },
  {
    path: "/deposit",
    element: <TransactPage type="add" page="deposit" />,
    loader: loadAdminData,
  },
  {
    path: "/withdraw",
    element: <TransactPage type="subtract" page="withdraw" />,
    loader: loadAdminData,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);
