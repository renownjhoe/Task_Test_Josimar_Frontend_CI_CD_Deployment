// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import VerificationPage from './components/VerificationPage';
import NotificationPopup from './components/NotificationPopup';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify-email" element={<VerificationPage />} />
        </Route>
      </Routes>
      <NotificationPopup />
    </Router>
  );
};

export default App;