import React, {useState} from 'react';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';
import { LocalData } from '../Data';
import { Logo } from './Logo';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure()

export default function LoginPage() {
  
    // useState hooks
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currUser, setCurrUser] = useState(null);
    
    const localUsers = localStorage.getItem('users');
    
    // set local storage data
    if(!localUsers) {
      localStorage.setItem('users', JSON.stringify(LocalData));
    }

    // change state
    const changeUsername = (event) => {
      setUsername(event.target.value);
    }
    const changeEmail = (event) => {
      setEmail(event.target.value)
    }
    const changePassword = (event) => {
      setPassword(event.target.value);
    }
    const onSubmit = (event) => {
      event.preventDefault();    // prevents jumping to url
      return login(username, password);
    }
    
    // Login function
    const login = (username, password) => {
        if(loginSuccess(username, password)) {
            setIsLoggedIn(true);
            return true;
        }
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users'));

    // Login success
    const loginSuccess = (username, password) => {
      let isFound = false;
      users.forEach(user => {
        if(user.username === username && user.password === password) {
          if(user.isAdmin) {
            setIsAdmin(true);
            setCurrUser(user);
            isFound = true;
          }
          else {
            setIsAdmin(false);
            setCurrUser(user)
            isFound = true;
          }
        }
      });
      
      // Login fail  
      if(!isFound) {
        toast.error("Invalid username or password", {
          position: "top-center"
        })
        return false;
      }
      return true;
    }
    
    // Logout function
    const logout = () => {
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem('currUser')
        toast.success("You have logged out", {position:'top-center'})
    }
  
    // Redirect to corresponding pages
    if(isLoggedIn) {
      localStorage.setItem('currUser', JSON.stringify(currUser));
      if(isAdmin)
        return <AdminDashboard users={users} logout={logout} />
      else
        return <UserDashboard users={users} currUser={currUser} setCurrUser={setCurrUser} logout={logout} />
    }
    
    return (
      <div id="login-page">
        <div id="login">   
        <Logo />       
          <form onSubmit={onSubmit}>
            <label htmlFor="username">Name</label>
            <input id="username" autoComplete="off" onChange={changeUsername}  value={username} type="text" />

            <label htmlFor='email'>Email</label>
            <input id="email" autoComplete='off' onChange={changeEmail} value={email} type="text" />

            <label htmlFor="password">Password</label>
            <input id="password" autoComplete="off" onChange={changePassword} value={password} type="password" />

            <button type="submit" className="btn">Login</button>
          </form>
        </div>
      </div>
    )
}
