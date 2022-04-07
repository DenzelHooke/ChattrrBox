import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar';
import Chat from './pages/Chat';
import Register from './pages/Register';
import Login from './pages/Login';


function App() {
  
  return (
    <>
      <Router>
          <Navbar />
          <div className="container">
              <Routes>
                <Route path='/' exact element={<Chat />} />
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
              </Routes>
          </div>
      </Router>
      <ToastContainer/>
    </>
  );
}

export default App;
