import React from "react";
import { ActionButtons } from "./ActionButtons";
import { formatNumber } from "./Utils";

export const Account = (props) => {
  const {
    key,
    index,
    fullname,
    type,
    isAdmin,
    accountNumber,
    balance,
    editingUser,
    setEditingUser,
    setEditModal,
    setDeleteUser,
  } = props;
  let action = null;

  if (isAdmin)
    action = (
      <ActionButtons
        index={index}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        setEditModal={setEditModal}
        setDeleteUser={setDeleteUser}
      />
    );

  return (
    <div className="account">
      <div className="details">
        <h1 className="details-name">Welcome, {fullname}</h1>
        <h4>Account No: {accountNumber}</h4>
        <div>Balance: {balance} INR</div>
        <div>
          A/c Type: {type === 0 ? "Saving" : type === 1 ? "Current" : "Credit"}
        </div>
      </div>
      {/* {action} */}
      <div className="button-div">
        <button
          type="button"
          className="btn green"
          onClick={() => (window.location = "/transfer")}
        >
          Transfer Funds
        </button>
        <button
          type="button"
          className="btn blue"
          onClick={() => (window.location = "/withdraw")}
        >
          Withdraw Funds
        </button>
        <button
          type="button"
          className="btn red"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem('currUser')
            window.location = "/";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
