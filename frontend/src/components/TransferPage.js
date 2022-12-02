import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import UserSidebar from "./UserSidebar";
import { useLoaderData } from "react-router-dom";

toast.configure();

export const TransferPage = () => {
  // useState Hooks
  const [amount, setAmount] = useState(0);
  const [cardNo, setCardNo] = useState("");
  const [pin, setPin] = useState("");
  const [cvv, setCVV] = useState("");
  const [expDate, setExpDate] = useState("");
  const [recvAc, setRecvAc] = useState("");

  const token = localStorage.getItem("token");
  const client = useLoaderData()

  const onDeposit = (event) => {
    setAmount(event.target.value);
  };

  const processTxn = async (e) => {
    e.preventDefault();
    try {
      const wRequest = await axios.post(
        "http://localhost:5000/txn/transfer",
        {
          card_no: cardNo,
          exp_data: expDate,
          pin,
          cvv,
          amount,
          to_acc: recvAc,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (wRequest.status === 200) {
        toast.success("Transfer Success", { position: "top-center" });
        window.location = "/";
      } else {
        toast.error("An Error Occurred", { position: "top-center" });
      }
    } catch (e) {
      if (e.response.status === 401) {
        toast.error("Wrong Account Details", { position: "top-center" });
      }
    }
  };

  return (
    <main>
      <UserSidebar active={3} acDetails={client} />
      <section
        style={{
          display: "flex",
          height: "100vh",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form id="form" onSubmit={processTxn}>
          <h1>POS Transaction Simulation</h1>

          <label>Debit Card No.</label>
          <input
            type="text"
            placeholder="Enter 16 Digit Card No"
            value={cardNo}
            onChange={(e) => setCardNo(e.target.value)}
          />

          <label>PIN</label>
          <input
            type="password"
            placeholder="Enter 4 Digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <label>Expiry Date</label>
          <input
            type="text"
            placeholder="Enter Expiry Date in the form (MM/YY)"
            value={expDate}
            onChange={(e) => setExpDate(e.target.value)}
          />

          <label>CVV</label>
          <input
            type="password"
            placeholder="Enter 3 Digit CVV"
            value={cvv}
            onChange={(e) => setCVV(e.target.value)}
          />
          <label>Transaction Amount</label>
          <input
            type="text"
            name="amount"
            value={amount}
            onChange={onDeposit}
            autoComplete="off"
            className="right big-input"
          />
          <label>Reciever A/c No</label>
          <input
            type="text"
            name="recvAc"
            value={recvAc}
            onChange={(e) => setRecvAc(e.target.value)}
            autoComplete="off"
            placeholder="Enter A/c No of Reciever"
          />
          <button type="submit" className="btn blue">
            Transfer
          </button>
        </form>
      </section>
    </main>
  );
};
