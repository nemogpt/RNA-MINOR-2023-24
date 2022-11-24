import React, {useState} from 'react';
import { UserContent } from './UserContent';
import { TransferPage } from './TransferPage';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { Logo } from "./Logo";


export const UserDashboard = (props) => {

    const { logout, users, currUser, setCurrUser} = props;
    // const [users, setUsers] = useState(props.users);

    // React Router
    return (
      <BrowserRouter>
      <main>
      <section id="side-menu">
          <Logo />
          <ul>
              <li><Link to="home" ><i className="bx bx-home"></i> Home</Link></li>
              <li><Link to="transfer" ><i className="bx bx-transfer"></i> Fund Transfer</Link></li>
              <li><Link onClick={logout} ><i className="bx bx-log-out"></i> Logout</Link></li>
          </ul>
      </section>
        <Routes>
          <Route path="/home" element = { <UserContent client={currUser} />} />
          <Route path="/transfer" element = { <TransferPage isClient="true" users={users} client={currUser} setClient={setCurrUser}  />} />
        </Routes>
      </main>
      </BrowserRouter>
  );
  
}
