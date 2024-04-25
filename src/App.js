import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css";
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
          <Route path="/" element={<Navigate to="/home" replace={true} />}/>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
