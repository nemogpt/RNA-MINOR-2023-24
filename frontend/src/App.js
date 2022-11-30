import React from 'react';
import './App.css';



function App() {
  const token = localStorage.getItem('token')
  if (token) {
    window.location = '/dashboard'
  } else {
    window.location = '/login'
  }
  return (
    <div>
      
    </div>
  );
}

export default App;