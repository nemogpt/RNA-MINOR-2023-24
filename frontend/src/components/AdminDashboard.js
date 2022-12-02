import { Logo } from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLayoutEffect, useState } from "react";

toast.configure();

export const AdminDashboard = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  useLayoutEffect(() => {
    (async () => {
      if (!token || !refresh) {
        setLoading(false);
        return;
      }
      try {
        const req = await axios.get("http://localhost:5000/txn/stats", {
          headers: {
            "x-access-token": token,
          },
        });
        setStats(req.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
      setRefresh(false);
    })();
  }, [location, token, refresh]);
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
              <Link
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
        <section className="render-data-analysis">
          <h2>Transaction Data Analysis</h2>
          {loading ? (
            <span style={{ textAlign: "center" }}>Loading...</span>
          ) : (
            <div className="render-data-div">
              <img src={stats?.image} alt="Analysis" height={700} width={900} />
              <h2 style={{ marginTop: "10px" }}>Statistics</h2>
              <div
                className="transactions-data"
              >
                <div>
                  <h4 style={{ marginTop: "4px" }}>Max Transactions</h4>
                  <table className="transaction-div">
                    <tr className="transaction-item">
                      <th>Year</th>
                      <th>ATM Name</th>
                      <th>Value</th>
                    </tr>
                    {stats?.stats.max.map((st, i) => (
                      <tr key={i} className="transaction-item">
                        <td>{st.year}</td>
                        <td>{st.atm_name}</td>
                        <td>{st.val}</td>
                      </tr>
                    ))}
                  </table>
                </div>
                <div>
                  <h4 style={{ marginTop: "4px" }}>Min Transactions</h4>
                  <table className="transaction-div">
                    <tr className="transaction-item">
                      <th>Year</th>
                      <th>ATM Name</th>
                      <th>Value</th>
                    </tr>
                    {stats?.stats.min.map((st, i) => (
                      <tr key={i} className="transaction-item">
                        <td>{st.year}</td>
                        <td>{st.atm_name}</td>
                        <td>{st.val}</td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
};
