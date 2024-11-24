import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import logo from './logo.svg';
import './App.css';
import SignupPage from './pages/SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the route for the login page */}
        <Route path="/" element={<LoginPage />} />
        {/* You can add other routes here, for example: */}
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );

}

export default App;
