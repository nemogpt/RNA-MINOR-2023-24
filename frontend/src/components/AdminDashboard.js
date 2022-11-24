import { useEffect, useState } from "react";
import { MainContent } from "./AdminContent";
import { CreateAccount } from "./CreateAccount";
import { TransferPage } from "./TransferPage";
import { TransactPage } from "./TransactPage";
import { Logo } from "./Logo";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure()


export const AdminDashboard = (props) => {

    // useState Hooks
    const [users, setUsers] = useState(props.users);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [editUser, setEditUser] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false); 
    const [newAccount, setNewAccount] = useState(null); 

    let overlay = null;
    if(editingUser && editUser) {
        const user = users[editingUser];
        overlay = <AccountEdit 
            accountName={user.fullname} 
            accountNumber={user.number} 
            balance={user.balance} 
            setEditUser={setEditUser} 
            setIsUpdate={setIsUpdate} 
            setNewAccount={setNewAccount} 
        />
    }

    // React Router
    return (
        <BrowserRouter>
        <main>
        <section id="side-menu">
            <Logo />
            <ul>
                <li><Link to="home" ><i className="bx bx-home"></i> Home</Link></li>
                <li><Link to="create-account"><i className="bx bx-user-pin"></i> Create Account</Link></li>
                <li><Link to="transfer" ><i className="bx bx-transfer"></i> Fund Transfer</Link></li>
                <li><Link to="deposit" ><i className="bx bx-money"></i> Deposit</Link></li>
                <li><Link to="withdraw" ><i className="bx bx-log-out-circle"></i> Withdraw</Link></li>
                <li><Link onClick={props.logout} ><i className="bx bx-log-out"></i> Logout</Link></li>
            </ul>
        </section>
          <Routes>

            <Route path="/home" 
                element = { 
                <>
                    <MainContent users={users} editingUser={editingUser} setEditModal={setEditUser} 
                        setEditingUser={setEditingUser} setDeleteUser={setDeleteUser} />
                    {overlay}
                </>
                } />
            <Route path="/create-account" 
                element = { 
                <>
                    <CreateAccount users={users} setUsers={setUsers} />
                </>
                } />
            <Route path="/transfer" 
                element = { 
                <>
                    <TransferPage users={users} setUsers={setUsers} />
                </>
                } />
            <Route path="/deposit" 
                element = { 
                <>
                    <TransactPage users={users} setUsers={setUsers} type="add" page="deposit"/>
                </>
                } />
            <Route path="/withdraw" 
                element = { 
                <>
                    <TransactPage users={users} setUsers={setUsers} type="subtract" page="withdraw"/>
                </>
                } />
          </Routes>
        </main>

        </BrowserRouter>
    );
    
}

const AccountEdit = (props) => {
    const { accountName, accountNumber, balance, setEditUser, setNewAccount, setIsUpdate } = props;
    const [account, setAccount] = useState({fullname: accountName, number: accountNumber, balance: balance});

    const closeUser = () => {
        setEditUser(false);
    }

    const updateAccount = (event) => {
        event.preventDefault();
        setNewAccount(account);
        setIsUpdate(true);
        setEditUser(false);
    }

    const editAccountName = (event) => {
        const name = event.target.value;
        setAccount({...account, ...{fullname: name}});
    }
    const editAccountNumber = (event) => {
        const number = event.target.value;
        setAccount({...account, ...{number: number}});
    }
    const editAccountBalance = (event) => {
        const balance = event.target.value;
        setAccount({...account, ...{balance: parseFloat(balance) || 0}});
    }
 
    // default return
    return (
        <div className="overlay">
        <div className="modal">
            <form onSubmit = {updateAccount}>
                <h2 className="title">Edit Account</h2>

                <label>Account name</label>
                <input name="account-name" onChange={editAccountName} value={account.fullname} autoComplete="off" />
                
                <label>Account number</label>
                <input type="text" name="amount" onChange={editAccountNumber} disabled value={account.number} autoComplete="off" />

                <label>Balance</label>
                <input type="text" name="balance" onChange={editAccountBalance} value={account.balance} autoComplete="off" />

                <button type="button" onClick = {closeUser} className="btn2 btn-muted">Cancel</button>
                <button type="submit" className="btn2">Update Account</button>
            </form>
        </div>
    </div>
    )
}
