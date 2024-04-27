import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css";
import HomePage from './components/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import Services from './components/Services';
import ContactUs from './components/ContactUs';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
          <Route path="/" element={<Navigate to="/home" replace={true} />}/>
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<ContactUs />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
