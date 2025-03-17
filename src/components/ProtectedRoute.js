// src/components/ProtectedRoute.js
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { fetchUser } from '../services/authService';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetchUser();
          if (!response.email_verified_at) {
            navigate('/verify-email'); // Redirect to verification page if email is not verified
          }
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      }
    };

    checkEmailVerification();
  }, [isAuthenticated, navigate]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render the protected component if authenticated and email is verified
  return <Outlet />;
};

export default ProtectedRoute;