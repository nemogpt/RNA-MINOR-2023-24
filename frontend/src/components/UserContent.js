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
        accountNumber={client.number}
        balance={client.balance}
        full_name={client.full_name}
      />
      <div id="transactions">
        <h2>Transactions</h2>
        <div id="transaction-div">
          {client.transactions.map((transaction, index) => {
            const className = index % 2 === 0 ? "even" : "odd";
            return (
              <div className={`transaction-item ${className}`}>
                <div>{transaction.date}</div>
                <div>{transaction.title}</div>
                <div>
                  {transaction.type === "debit"
                    ? formatNumber(transaction.amount * -1)
                    : formatNumber(transaction.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
