import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import OvertimeManagement from './pages/OvertimeManagement';
import Benefits from './pages/Benefits';
import Leave from './pages/Leave';
import Incentives from './pages/Incentives';
import AdminProfile from './pages/AdminProfile';
import Login from './components/Login';
import Signup from './components/Signup';
import Shift from './pages/Shift';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar state

  const handleLogin = () => {
    setIsAuthenticated(true); // Set authenticated state on successful login
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setIsAuthenticated(false); // Set authenticated state to false on logout
  };

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState); // Toggle sidebar visibility
  };

  // Protected route component to guard routes
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className={`flex ${isSidebarOpen ? 'pl-64' : ''} transition-all duration-300 font-Poppins`}>
        {isAuthenticated && <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} />}
        <div className="flex-1 bg-[#F0F0F0]">
          {isAuthenticated && <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />}
          <div className="p-4 ">
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/adminprofile" element={<ProtectedRoute element={<AdminProfile />} />} />
              <Route path="/overtimemanagement" element={<ProtectedRoute element={<OvertimeManagement />} />} />
              <Route path="/shift" element={<ProtectedRoute element={<Shift />} />} />
              <Route path="/incentives" element={<ProtectedRoute element={<Incentives />} />} />
              <Route path="/benefits" element={<ProtectedRoute element={<Benefits />} />} />
              <Route path="/leave" element={<ProtectedRoute element={<Leave />} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
