import { useState, useEffect } from "react";
import { AdminContent } from "./AdminContent";
import { CreateAccount } from "./CreateAccount";
import { TransferPage } from "./TransferPage";
import { TransactPage } from "./TransactPage";
import { Logo } from "./Logo";
import { Routes, Route, Link, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

toast.configure();

export const AdminDashboard = (props) => {
  // useState Hooks
  //   const [users, setUsers] = useState([]);
  const users = useLoaderData();
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [editUser, setEditUser] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newAccount, setNewAccount] = useState(null);

  // useEffect Hooks

  // useEffect(() => {
  //     if(deleteUser !== null) {
  //         const filteredUsers = users.filter((user, index) => {
  //             return index !== deleteUser
  //         });

  //         setUsers(filteredUsers);
  //         setDeleteUser(null);
  //         // save
  //         localStorage.setItem('users', JSON.stringify(filteredUsers));
  //     }
  // }, [deleteUser]);
  // useEffect(() => {
  //     if(isUpdate) {
  //         const filteredUsers = users.map((user, index) => {
  //             if(user.number === newAccount.number) {
  //                 user = {...user, ...newAccount};
  //             }
  //             return user;
  //         });

  //         setUsers(filteredUsers);
  //         setIsUpdate(false);
  //         // save
  //         localStorage.setItem('users', JSON.stringify(filteredUsers));
  //     }
  // }, [isUpdate]);

  let editPopup = null;
  if (editingUser !== false && editUser) {
    console.log("it is being executed");
    const user = users[editingUser];
    editPopup = (
      <AccountEdit
        accountName={user.fullname}
        accountNumber={user.number}
        balance={user.balance}
        setEditUser={setEditUser}
        setIsUpdate={setIsUpdate}
        setNewAccount={setNewAccount}
      />
    );
  }

  // React Router
  return (
    <>
      <main>
        <section id="side-menu">
          <Logo />
          <ul>
            <li>
              <Link to="/admin">
                <i className="bx bx-home"></i> Home
              </Link>
            </li>
            <li>
              <Link to="/create-account">
                <i className="bx bx-user-pin"></i> Create Account
              </Link>
            </li>
            <li>
              <Link to="/transfer">
                <i className="bx bx-transfer"></i> Fund Transfer
              </Link>
            </li>
            <li>
              <Link to="/deposit">
                <i className="bx bx-money"></i> Deposit
              </Link>
            </li>
            <li>
              <Link to="/withdraw">
                <i className="bx bx-log-out-circle"></i> Withdraw
              </Link>
            </li>
            <li>
              <Link onClick={props.logout}>
                <i className="bx bx-log-out"></i> Logout
              </Link>
            </li>
          </ul>
        </section>
        {/* <Routes>
          <Route
            path="/home"
            element={
              <>
                <AdminContent
                  users={users}
                  editingUser={editingUser}
                  setEditModal={setEditUser}
                  setEditingUser={setEditingUser}
                  setDeleteUser={setDeleteUser}
                />
                {editPopup}
              </>
            }
          />
          <Route
            path="/create-account"
            element={
              <>
                <CreateAccount  />
              </>
            }
          />
          <Route
            path="/transfer"
            element={
              <>
                <TransferPage users={users} setUsers={setUsers} />
              </>
            }
          />
          <Route
            path="/deposit"
            element={
              <>
                <TransactPage
                  users={users}
                  setUsers={setUsers}
                  type="add"
                  page="deposit"
                />
              </>
            }
          />
          <Route
            path="/withdraw"
            element={
              <>
                <TransactPage
                  users={users}
                  setUsers={setUsers}
                  type="subtract"
                  page="withdraw"
                />
              </>
            }
          />
        </Routes> */}
      </main>
    </>
  );
};

const AccountEdit = (props) => {
  const {
    accountName,
    accountNumber,
    balance,
    setEditUser,
    setNewAccount,
    setIsUpdate,
  } = props;
  const [account, setAccount] = useState({
    fullname: accountName,
    number: accountNumber,
    balance: balance,
  });

  const closeUser = () => {
    setEditUser(false);
  };

  const updateAccount = (event) => {
    event.preventDefault();
    console.log(account);
    setNewAccount(account);
    setIsUpdate(true);
    setEditUser(false);
  };

  const editAccountName = (event) => {
    const name = event.target.value;
    setAccount({ ...account, ...{ fullname: name } });
  };
  const editAccountNumber = (event) => {
    const number = event.target.value;
    setAccount({ ...account, ...{ number: number } });
  };
  const editAccountBalance = (event) => {
    const balance = event.target.value;
    setAccount({ ...account, ...{ balance: parseFloat(balance) || 0 } });
  };

  // default return
  return (
    <div className="overlay">
      <div className="modal">
        <form onSubmit={updateAccount}>
          <h2 className="title">Edit Account</h2>

          <label>Account name</label>
          <input
            name="account-name"
            onChange={editAccountName}
            value={account.fullname}
            autoComplete="off"
          />

          <label>Account number</label>
          <input
            type="text"
            name="amount"
            onChange={editAccountNumber}
            disabled
            value={account.number}
            autoComplete="off"
          />

          <label>Balance</label>
          <input
            type="text"
            name="balance"
            onChange={editAccountBalance}
            value={account.balance}
            autoComplete="off"
          />

          <button type="button" onClick={closeUser} className="btn2 btn-muted">
            Cancel
          </button>
          <button type="submit" className="btn2">
            Update Account
          </button>
        </form>
      </div>
    </div>
  );
};
