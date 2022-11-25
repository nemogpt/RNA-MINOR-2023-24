import { Account } from "./Account";
import React, { useEffect, useState } from "react";

export const AdminContent = (props) => {
    const {editingUser, setEditingUser, setEditModal, setDeleteUser} = props;
    
    const users = props.users;
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      const localUser = JSON.parse(localStorage.getItem('currUser'));
      setIsAdmin(localUser.isAdmin);
    }, [isAdmin]);
    
      // mapping through every user
      const bankAccounts = users.map((user, index) => {
      return (<Account 
        key={index} 
        index={index} 
        fullname={user.fullname} 
        type={user.type} 
        isAdmin={isAdmin} 
        accountNumber={user.number} 
        balance={user.balance} 
        editingUser={editingUser} 
        setEditingUser={setEditingUser} 
        setEditModal={setEditModal} 
        setDeleteUser={setDeleteUser} />
      )
    });
      
    return (
      <section id="main-content">
        <div id="main-headers">
          <h1>Holder</h1>
          <h1>Type</h1>
          <h1>Number</h1>
          <h1>Balance</h1>
        </div>
        {bankAccounts}
      </section>
    )
    
  }

