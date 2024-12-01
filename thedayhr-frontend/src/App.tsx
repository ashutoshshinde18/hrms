import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import logo from './logo.svg';
import './App.css';
import Layout from './pages/LayOut';
import SignupPage from './pages/SignUpPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import { UserProvider } from './pages/UserContext';
import UserProfile from './pages/UserProfile';
import ProfileSection from './pages/UserProfileNew';
import HRMSDashboard from './pages/UserProfileFinal';
import ReportsAnalytics from './pages/Reports&Analytics';
import Payroll from './pages/Payroll';
import LeaveManagement from './pages/LeaveManagement';
import Attendance from './pages/Attendance';

function App() {
  return (
    <Router>
      <UserProvider>
      <Routes>
        {/* Define the route for the login page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email/:verificationCode" element={<VerifyEmailPage />} />
        <Route path="/" element={<Layout />}>
          {/* You can add other routes here, for example: */}
          <Route index element={<DashboardPage />} />
          <Route path="user-profile" element={<HRMSDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave-management" element={<LeaveManagement />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="reports-analytics" element={<ReportsAnalytics />} />
        </Route>
      </Routes>
      </UserProvider>
    </Router>
  );

}

export default App;
