import React from "react";

export const ActionButtons = (props) => {
    const {index, editingUser, setEditingUser, setEditModal, setDeleteUser} = props;

    return (
      <div id="actions">
        <ActionButton 
          icon="bx bx-edit" 
          text="Edit" 
          index={index}
          actionType="edit"
          editingUser={editingUser} 
          setEditingUser={setEditingUser} 
          setEditModal={setEditModal} />

        <ActionButton 
          icon="bx bxs-x-square"  
          text="Delete" 
          index={index} 
          actionType='delete'
          editingUser={editingUser} 
          setDeleteUser={setDeleteUser} />
      </div>
    )
  }
  
export const ActionButton = (props) => {
    const {icon, text, actionType, setEditingUser, index, setEditModal, setDeleteUser} = props;

    const click = (event, index) => {
      event.preventDefault();
      
      if(actionType === 'edit') {
        setEditingUser(index);
        setEditModal(true);
      }

      if(actionType === 'delete') {
        setDeleteUser(index);
      }
    }

    return (
      <button onClick={(event) => click(event, index)}><i className={icon} ></i> {text}</button>
    )
  }
