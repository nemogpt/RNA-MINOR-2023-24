import React from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import {
  RouterProvider,
  Route
} from 'react-router-dom'



function App() {
  const token = localStorage.getItem('token')
  if (token) {
    window.location = '/dashboard'
  } else {
    window.location = '/login'
  }
  return (
    <div></div>
  );
}

export default App;