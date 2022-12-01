import { useState } from "react";
import { formatNumber, trim } from "./Utils";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export const CreateAccount = (props) => {
  // Random no generator
  const RandomNo = () => {
    return Math.floor(Math.random() * 9000000000 + 1000000000);
  };

  // useState Hooks
  const [Balance, setBalance] = useState(0);
  const [accountNumber, setaccountNumber] = useState(RandomNo());

  // new Account
  const createNewAccount = async (user) => {
    // const users = props.users;
    let exists = false;

    if (exists) {
      toast.error("Email already exists", { position: "top-center" });
      return false;
    } else {
      // users.unshift(user);
      // props.setUsers(users);
      // localStorage.setItem('users', JSON.stringify(users));

      const cu_req = await axios.post(
        "http://localhost:5000/auth/register",
        user
      );
      console.log(cu_req);
      toast.success("Successfully saved", { position: "top-center" });
      return true;
    }
  };

  const onCreateAccount = (event) => {
    event.preventDefault();
    const user = event.target.elements;

    // console.log(user);
    // return;
    const account = {
      email: user.email.value,
      password: user.password.value,
      fullname: user.fullname.value,
      type: user.accountType.value,
      number: user.accountNumber.value,
      isAdmin: false,
      balance: trim(user.balance.value),
      transactions: [],
    };

    
    const isSaved = createNewAccount(account);
    if (isSaved) {
      user.email.value = "";
      user.password.value = "";
      user.fullname.value = "";
      user.accountNumber.value = setaccountNumber(RandomNo());
      user.balance.value = setBalance(0);
    }
  };

  const onChangeBalance = (event) => {
    const amount = trim(event.target.value) || 0;
    setBalance(amount);
  };

  return (
    <section id="main-content">
      <form id="form" onSubmit={onCreateAccount}>
        <h1>Create Account</h1>
        <label htmlFor="account-number">Account (Randomly Generated)</label>
        <input
          id="account-number"
          name="accountNumber"
          className="right"
          value={accountNumber}
          type="number"
          disabled
        />
        <hr />
        <label htmlFor="account-type">Account Type</label>
        <select name="accountType">
          <option value="Savings Accounts">Savings Account</option>
          <option value="Checking Account">Salary Account</option>
        </select>
        <label htmlFor="fullname">Full name</label>
        <input
          id="fullname"
          type="text"
          autoComplete="off"
          name="fullname"
          required
        />

        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" name="email" required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" required />

        <label htmlFor="balance">Initial balance</label>
        <input
          id="balance"
          type="text"
          value={formatNumber(Balance)}
          onChange={onChangeBalance}
          name="initialBalance"
          className="right"
          required
        />

        <input value="Create Account" className="btn green" type="submit" />
      </form>
    </section>
  );
};
