import { useLayoutEffect, useState } from "react";
import { Account } from "./Account";
import { formatNumber } from "./Utils";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { Logo } from "./Logo";
import UserSidebar from "./UserSidebar";

export const UserContent = () => {
  const [client, setClient] = useState();
  const location = useLocation();

  useLayoutEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const req = await axios.get("http://localhost:5000/auth/", {
        headers: {
          "x-access-token": token,
        },
      });
      console.log(req.data);
      setClient(req.data);
    })();
  }, [location]);

  return (
    <main>
      <UserSidebar active={1} acDetails={client} />
      <section id="main-content">
        <h1 className="main">Your Latest Transactions</h1>
        
        <div id="transactions">
          <div id="transaction-div">
            <div className="transaction-item">
              <div style={{ fontWeight: "bold" }}>Timestamp</div>
              <div style={{ fontWeight: "bold" }}>To</div>
              <div style={{ fontWeight: "bold" }}>Amount</div>
            </div>
            {client?.transactions.map((transaction, index) => {
              const className = index % 2 === 0 ? "even" : "odd";
              return (
                <div className={`transaction-item ${className}`}>
                  <div>
                    {new Date(transaction.timestamp).toLocaleString("UTC", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                  <div>
                    {transaction.to_acc === "000000"
                      ? "Withdraw"
                      : transaction.to_acc}
                  </div>
                  <div>{formatNumber(transaction.amount * -1)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
