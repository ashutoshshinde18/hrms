import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './components/UserManagementComponent/LoginPage';
import logo from './logo.svg';
import './App.css';
import Layout from './components/MainComponent/LayOut';
import SignupPage from './components/UserManagementComponent/SignUpPage';
import VerifyEmailPage from './components/UserManagementComponent/VerifyEmailPage';
import DashboardPage from './components/MainComponent/DashboardPage';
import { UserProvider } from './components/UserManagementComponent/UserContext';
import HRMSDashboard from './components/UserManagementComponent/UserProfileFinal';
import ReportsAnalytics from './components/Reports&Analytics';
import Payroll from './components/Payroll';
import LeaveManagement from './components/LeaveManagement';
import Attendance from './components/AttendanceComponent/Attendance';

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
