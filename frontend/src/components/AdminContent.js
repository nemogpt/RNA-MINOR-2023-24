import { Account } from "./Account";
import React, { useEffect, useState } from "react";

export const MainContent = (props) => {

    const users = props.users;
    const {editingUser, setEditingUser, setEditModal, setDeleteUser} = props;
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
        {bankAccounts}
      </section>
    )
    
  }

