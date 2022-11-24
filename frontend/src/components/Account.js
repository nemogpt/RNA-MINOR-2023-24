import React from "react";
import { ActionButtons } from "./ActionButtons";
import { formatNumber } from "./Utils";

export const Account = (props) => {

    const {type, accountNumber, balance, fullname, editingUser, setEditingUser, setDeleteUser, index, isAdmin, setEditModal} = props;
    
    let action = null
    if(isAdmin)
      action = <ActionButtons 
      index={index} 
      editingUser={editingUser} 
      setEditingUser={setEditingUser} 
      setEditModal={setEditModal} 
      setDeleteUser={setDeleteUser} />

    return (
      <div className="account">
          <div className="details">
              <h1>{fullname}</h1>
              <h3>{type}</h3>
              <div>{accountNumber}</div>
              {action}
          </div>
          <div className="balance">{balance}</div>
      </div>
    )
  }

