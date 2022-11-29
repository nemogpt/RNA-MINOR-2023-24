import { useState } from "react";
import { formatNumber, findAccount, transact, trim } from "./Utils";
import { toast } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

toast.configure()


export const TransactPage = (props) => {

    // useState Hooks
    const users = JSON.parse(localStorage.getItem('users'));
    const [accounts, setAccounts] = useState(users);
    const [selectedAccount, setSelectedAccount] = useState({balance: 0});
    const [depositAmount, setDepositAmount] = useState(0);

    
    const options = accounts.map(user => {
        return <option value={user.number}>{user.fullname} #{user.number}</option>
    });

    const displayBalance = (event) => {
        const selectedNumber = event.target.value;
        
        for(const user of accounts) {
            if(user.number === selectedNumber) {
                setSelectedAccount(user);
                break;
            }
        }
    }

    const onDeposit = (event) => {
        const amount = formatNumber(trim(event.target.value));
        setDepositAmount(amount);
    }

    const processTransfer = (event) => {
        event.preventDefault();
        const amount = trim(event.target.elements.amount.value);
        const accountNumber = event.target.elements.account.value;

        if(amount > 0 && accountNumber !== "0") {
            for(const user of accounts) {
                if(user.number === accountNumber) {
                    transact(user.number, amount, props.type, props.setUsers);
                    setSelectedAccount(findAccount(user.number));
                    setAccounts(JSON.parse(localStorage.getItem('users')));
                    setDepositAmount(0);
                    toast.success("Transaction successful", {position:"top-center"})
                    break;
                }
            }
        } 
        else {
            toast.error("Transaction failed", {position:"top-center"})
        }
    }

    return (
        <section id="main-content">
            <form id="form" onSubmit={processTransfer}>
                <h1>{props.page}</h1>

                <label>Account</label>
                <select name="account" onChange={displayBalance}>
                    <option value="0">Select Account</option>
                    {options}
                </select>

                <label>Current balance</label>
                <input type="text" className="right" value={formatNumber(selectedAccount.balance)} disabled />
                
                <label>Amount to {props.page}</label>
                <input type="text" name="amount" value={depositAmount} onChange={onDeposit} autoComplete="off" className="right big-input" />
                <button type="submit" className="btn">{props.page}</button>
            </form>
        </section>
    )
}
