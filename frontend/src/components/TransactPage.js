import { useLayoutEffect, useState } from "react";
import { trim } from "./Utils";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useLoaderData, useLocation } from "react-router-dom";
import addNotification from "react-push-notification";
import UserSidebar from "./UserSidebar";

toast.configure();

export const TransactPage = (props) => {
  // useState Hooks
  const [amount, setAmount] = useState(0);
  const [cardNo, setCardNo] = useState("");
  const [pin, setPin] = useState("");
  const [cvv, setCVV] = useState("");
  const [expDate, setExpDate] = useState("");

  const [clicked, setClicked] = useState(false);

  const [atms, setAtms] = useState([]);
  const [atm, setAtm] = useState("");

  const token = localStorage.getItem("token");
  const client = useLoaderData();

  const location = useLocation();

  useLayoutEffect(() => {
    (async () => {
      const req = await axios.get("http://localhost:5000/txn/getatms");
      setAtms(req.data);
    })();
  }, [location]);

  const options = atms.map((atm) => {
    return (
      <option value={atm.atm_id}>
        #{atm.atm_id} - {atm.atm_address} @ [{atm.location[0]},{" "}
        {atm.location[1]}]
      </option>
    );
  });

  const onDeposit = (event) => {
    // const amount = formatNumber(trim(event.target.value));
    setAmount(event.target.value);
  };

  const performWithdrawl = async (loc) => {
    const wRequest = await axios.post(
      "http://localhost:5000/txn/withdraw",
      {
        card_no: cardNo,
        exp_data: expDate,
        pin,
        atm,
        cvv,
        amount,
        // lat: loc.coords.latitude,
        // lng: loc.coords.longitude,
        lat: 28.71275, // Testing Creds
        lng: 77.656, // Testing Creds
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    if (wRequest.status === 200) {
      toast.success(wRequest.data?.success, { position: "top-center" });
    } else {
      toast.error("An Error Occurred", { position: "top-center" });
    }
  };

  const processTransfer = async (event) => {
    event.preventDefault();
    const amount = trim(event.target.elements.amount.value);

    navigator.geolocation.getCurrentPosition(async (loc) => {
      if (amount > 0) {
        try {
          const request = await axios.post(
            "http://localhost:5000/txn/processWithdraw",
            {
              atm,
              //   lat: loc.coords.latitude,
              //   lng: loc.coords.longitude,
              lat: 28.71275, // Testing Creds
              lng: 77.656, // Testing Creds
            },
            {
              headers: {
                "x-access-token": token,
              },
            }
          );
          if (request.status === 200) {
            await performWithdrawl(loc);
            return;
          }
        } catch (e) {
          if (e.response.status === 401) {
            let atmData = atms.filter((_atm) => _atm.atm_id === atm);
            if (atmData.length > 0) {
              atmData = atmData[0];
            }
            // PUSH NOtification
            addNotification({
              title: `A Transaction Request was requested at \n${atmData.atm_address}`,
              subtitle:
                "A Card Transaction was requested from location? Press or Touch to approve, ignore if not initiated by you",
              native: true,
              duration: 10000,
              onClick: async () => {
                const x = window.confirm("Confirm Transaction Approval?");
                if (x) {
                  // setClicked(true);
                  await performWithdrawl(loc);
                  setClicked(true);
                  window.location = "/";
                } else {
                  setClicked(true);
                  toast.warn("Transaction Cancelled!!", {
                    position: "top-center",
                  });
                  addNotification({
                    title: "The Transaction is declined",
                    native: true,
                    duration: 10000,
                  });
                }
              },
            });

            setTimeout(() => {
              if (!clicked) {
                toast.error("Transaction Not Approved", {
                  position: "top-center",
                });
                addNotification({
                  title:
                    "The Transaction was not approved in time and is marked as declined",
                  native: true,
                  duration: 10000,
                });
                setClicked(false);
              }
            }, 10000);
          }
        }
      } else {
        toast.error("Transaction failed", { position: "top-center" });
      }
    });
  };

  return (
    <main>
      <UserSidebar active={2} acDetails={client} />
      <section
        style={{
          display: "flex",
          height: "100vh",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form id="form" onSubmit={processTransfer}>
          <h1>{props.page}</h1>

          <label>Select ATM</label>
          <select required name="atm" onChange={(e) => setAtm(e.target.value)}>
            <option value="0" disabled selected>
              Select ATM
            </option>
            {options}
          </select>
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

          <label>Amount to withdraw</label>
          <input
            type="text"
            name="amount"
            value={amount}
            onChange={onDeposit}
            autoComplete="off"
            className="right big-input"
          />
          <button type="submit" className="btn blue">
            {props.page}
          </button>
        </form>
      </section>
    </main>
  );
};
