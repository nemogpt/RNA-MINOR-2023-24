import { useEffect, useState } from "react";
import { getDateToday } from "./Utils";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export const TransferPage = (props) => {
  const { isClient, client } = props;
  const user = useLoaderData();
  const token = localStorage.getItem("token");

  // useState Hooks
  // const [receivers, setReceivers] = useState(users);
  const [sender, setSender] = useState(isClient ? user : "");
  const [receiver, setReceiver] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);

  const senderSelected = (event) => {
    const accountNumber = event.target.value;
    setSender(user);
  };

  const receiverSelected = (event) => {
    const accountNumber = event.target.value;
    setReceiver(accountNumber);
  };

  let senders = null;
  if (!isClient) {
    senders = user.map((user) => {
      return (
        <option value={user.account_no}>
          {user.full_name} #{user.account_no}
        </option>
      );
    });
  }

  // const newReceivers = receivers.map((receiver) => {
  //   if (sender.account_no !== receiver.account_no) {
  //     return (
  //       <option value={receiver.account_no}>
  //         {receiver.full_name} #{receiver.account_no}
  //       </option>
  //     );
  //   } else {
  //     return <></>;
  //   }
  // });

  const transferFund = async (event) => {
    event.preventDefault();
    const amount = parseFloat(
      event.target.elements.amount.value.replace(/,/g, "")
    );
    if (amount <= 0) return false;

    if (sender.length !== 0 && receiver.length !== 0) {
      let request;
      if (!isClient) {
        request = await axios.post(
          "http://localhost:5000/txn/transferadmin",
          {
            from_acc: sender,
            to_acc: receiver,
            amount,
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
      } else {
        request = await axios.post(
          "http://localhost:5000/txn/transfer",
          {
            to_acc: receiver,
            amount,
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
      }

      console.log(request.data);
      if (request.status === 200) {
        toast.success(request.data?.msg, { position: "top-center" });
        // setSender({ ...sender, balance: request.data?.f_bal });
        toast.info(`Your Balance is ${request.data?.balance}`, {
          position: "top-center",
        });
      } else {
        toast.error("Error Occurred", { position: "top-center" });
      }
    } else {
      toast.warn("Incomplete information. Missing sender or receiver", {
        position: "top-center",
      });
    }
  };

  const onTransfer = (e) => {
    const transfer = parseFloat(e.target.value.replace(/,/g, "")) || 0;
    setTransferAmount(transfer);
  };

  let senderField = (
    <select onChange={senderSelected} name="sender">
      <option>Select Sender</option>
      {senders}
    </select>
  );

  if (isClient) {
    senderField = (
      <input
        type="text"
        name="sender"
        value={`${user.full_name} #${user.account_no}`}
        disabled
      />
    );
  }

  return (
    <section id="main-content">
      <form id="form" onSubmit={transferFund}>
        <h1>Fund Transfer</h1>
        {senderField}
        <label>Current balance</label>
        <input
          type="text"
          className="right"
          value={isClient ? user.balance : sender.balance}
          disabled
        />
        <label>Amount to Transfer</label>
        <input
          type="text"
          name="amount"
          value={transferAmount}
          onChange={onTransfer}
          autoComplete="off"
          className="right"
        />
        <label>Receiver A/c Number</label>
        <input
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          name="receiver"
          type={"text"}
          placeholder="Enter A/c No of Reciever"
        />
        <hr />
        <input type="submit" className="btn" value="Transfer Fund" />
      </form>
    </section>
  );
};
