import { useEffect, useState } from "react";
import { getDateToday } from "./Utils";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export const TransferPage = (props) => {
  const { isClient, client } = props;
  const users = useLoaderData();
  const token = localStorage.getItem("token");

  // useState Hooks
  const [receivers, setReceivers] = useState(users);
  const [sender, setSender] = useState(isClient ? client : { balance: 0 });
  const [receiver, setReceiver] = useState({ balance: 0 });
  const [transferAmount, setTransferAmount] = useState(0);

  const senderSelected = (event) => {
    const accountNumber = event.target.value;

    let sender = null;

    users.forEach((user) => {
      if (user.account_no === accountNumber) {
        sender = user;
      }
    });

    const newUsers = users.filter((user, index) => {
      return user.account_no !== accountNumber;
    });

    setSender(sender);
    setReceivers(newUsers);
    setReceiver({ account_no: 0, balance: 0 });
  };

  const receiverSelected = (event) => {
    const accountNumber = event.target.value;

    let receiver = null;

    users.forEach((user) => {
      if (user.account_no === accountNumber) {
        receiver = user;
      }
    });

    setReceiver(receiver);
  };

  let senders = null;
  if (!isClient) {
    senders = users.map((user) => {
      return (
        <option value={user.account_no}>
          {user.full_name} #{user.account_no}
        </option>
      );
    });
  }

  const newReceivers = receivers.map((receiver) => {
    if (sender.account_no !== receiver.account_no) {
      return (
        <option value={receiver.account_no}>
          {receiver.full_name} #{receiver.account_no}
        </option>
      );
    } else {
      return <></>;
    }
  });

  const transferFund = async (event) => {
    event.preventDefault();
    const amount = parseFloat(
      event.target.elements.amount.value.replace(/,/g, "")
    );
    if (amount <= 0) return false;

    if (
      sender.account_no !== 0 &&
      receiver.account_no !== 0 &&
      receiver.account_no
    ) {
      // let senderSuccess = false;
      // users.forEach((user) => {
      //   if (user.account_no === sender.account_no) {
      //     if (user.balance - amount >= 0) {
      //       user.balance -= amount;

      //       // console.log(user.transactions);
      //       // user.transactions.unshift({
      //       //   title: `Fund transfer to ${receiver.full_name} #${receiver.account_no}`,
      //       //   amount: amount,
      //       //   type: "debit",
      //       //   date: getDateToday(),
      //       // });

      //       setSender(user);
      //       senderSuccess = true;
      //     }
      //   }
      // });

      // // add to receiver
      // if (senderSuccess) {
      //   users.forEach((user) => {
      //     if (user.account_no === receiver.account_no) {
      //       user.balance += amount;
      //       user.transactions.unshift({
      //         title: `Fund transfer from ${sender.full_name} #${receiver.account_no}`,
      //         amount: amount,
      //         type: "credit",
      //         date: getDateToday(),
      //       });
      //       setReceiver(user);
      //     }
      //   });

      //   toast.success("Transferred Successfully", { position: "top-center" });
      //   setTransferAmount(0);
      // } else {
      //   toast.error("Transactions Failed", { position: "top-center" });
      // }

      const request = await axios.post(
        "http://localhost:5000/txn/transferadmin",
        {
          from_acc: sender.account_no,
          to_acc: receiver.account_no,
          amount,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      console.log(request.data);
      if (request.status === 200) {
        toast.success(request.data?.msg, { position: "top-center" });
        setSender({...sender, balance: request.data?.f_bal})
        setReceiver({...receiver, balance: request.data?.t_bal})
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
        value={`${client.full_name} #${client.acc_no}`}
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
        <input type="text" className="right" value={sender.balance} disabled />
        <label>Amount to Transfer</label>
        <input
          type="text"
          name="amount"
          value={transferAmount}
          onChange={onTransfer}
          autoComplete="off"
          className="right"
        />
        <hr />
        <select
          value={receiver.account_no || 0}
          onChange={receiverSelected}
          name="receiver"
        >
          <option>Select Receiver</option>
          {newReceivers}
        </select>
        <label>Current balance</label>
        <input
          type="text"
          className="right"
          value={receiver.balance}
          disabled
        />
        <input type="submit" className="btn" value="Transfer Fund" />
      </form>
    </section>
  );
};
