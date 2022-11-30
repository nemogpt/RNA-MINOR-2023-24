import { useEffect, useState } from "react";
import { Account } from "./Account";
import { formatNumber } from "./Utils";
import axios from "axios";
import { useLoaderData } from "react-router-dom";

export const UserContent = (props) => {
  // const [client, setClient] = useState();
  // const {client} = props
  const client = useLoaderData();

  return (
    <section id="main-content">
      <h1 className="main">My Account</h1>
      <Account
        type={client.ac_type}
        accountNumber={client.account_no}
        balance={client.balance}
        fullname={client.full_name}
      />
      <div id="transactions">
        <h2>Transactions</h2>
        <div id="transaction-div">
          <div className="transaction-item">
            <div style={{ fontWeight: "bold" }}>Timestamp</div>
            <div></div>
            <div style={{ fontWeight: "bold" }}>Amount</div>
          </div>
          {client.transactions.map((transaction, index) => {
            const className = index % 2 === 0 ? "even" : "odd";
            return (
              <div className={`transaction-item ${className}`}>
                <div>{transaction.timestamp}</div>
                <div></div>
                <div>{formatNumber(transaction.amount * -1)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
