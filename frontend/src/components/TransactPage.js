import { useLayoutEffect, useState } from "react";
import { formatNumber, findAccount, transact, trim } from "./Utils";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useLoaderData, useLocation } from "react-router-dom";
import addNotification from "react-push-notification";

toast.configure();

export const TransactPage = (props) => {
  // useState Hooks
  const user = useLoaderData();
  // const [accounts, setAccounts] = useState(users);
  // const [selectedAccount, setSelectedAccount] = useState({balance: 0});
  const [amount, setAmount] = useState(0);
  const [cardNo, setCardNo] = useState("");
  const [pin, setPin] = useState("");
  const [cvv, setCVV] = useState("");
  const [expDate, setExpDate] = useState("");
//   const [latlng, setLatLng] = useState({ lat: 0.0, lng: 0.0 });

  const [atms, setAtms] = useState([]);
  const [atm, setAtm] = useState("");

  const token = localStorage.getItem("token");

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
    console.log(wRequest.data);
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
        // for(const user of accounts) {
        //     if(user.number === accountNumber) {
        //         transact(user.number, amount, props.type, props.setUsers);
        //         setSelectedAccount(findAccount(user.number));
        //         setAccounts(JSON.parse(localStorage.getItem('users')));
        //         setAmount(0);
        //         toast.success("Transaction successful", {position:"top-center"})
        //         break;
        //     }
        // }
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
            // PUSH NOtification
            addNotification({
              title: "Transaction Request",
              subtitle:
                "A Card Transaction was requested from location? Press or Touch to approve, ignore if not initiated by you",
              native: true,
              duration: 10000,
              onClick: async () => {
                const x = window.confirm("Confirm Transaction Approval?");
                if (x) {
                  await performWithdrawl(loc);
                } else {
                  toast.warn("Transaction Cancelled!!", {
                    position: "top-center",
                  });
                }
              },
            });
            // alert(`Are you approving this transaction from ${atm.location} ?`);
          }
        }
      } else {
        toast.error("Transaction failed", { position: "top-center" });
      }
    });
  };

  return (
    <section id="main-content">
      <form id="form" onSubmit={processTransfer}>
        <h1>{props.page}</h1>

        <label>Select ATM</label>
        <select name="atm" onChange={(e) => setAtm(e.target.value)}>
          <option value="0">Select ATM</option>
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
  );
};
