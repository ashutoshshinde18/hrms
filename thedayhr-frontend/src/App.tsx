import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import logo from './logo.svg';
import './App.css';
import SignupPage from './pages/SignUpPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import { UserProvider } from './pages/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
      <Routes>
        {/* Define the route for the login page */}
        <Route path="/" element={<LoginPage />} />
        {/* You can add other routes here, for example: */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email/:verificationCode" element={<VerifyEmailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      </UserProvider>
    </Router>
  );

}

export default App;
