// src/components/VerificationPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resendVerification, fetchUser } from '../services/authService';
import Loader from './Loader';

const VerificationPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch user details to check email verification status
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetchUser();
        console.log(response);
        setUser(response);

        // Redirect to dashboard if email is verified
        if (response.email_verified_at) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setMessage('Failed to fetch user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Resend verification email
  const handleResendEmail = async () => {
    setResendLoading(true);
    try {
      const response = await resendVerification(); // Call the resendVerification function

      // Check if the email is already verified
      if (!response.success && response.message === 'Email is already verified.') {
        navigate('/dashboard'); // Redirect to dashboard
        return;
      }

      // Display success message
      setMessage(response.message || 'Verification email sent successfully. Please check your inbox.');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setMessage(error.response?.data?.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return <Loader />; // Show the loader while fetching user details
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Verify Your Email</h2>
        <p className="mb-6 text-gray-700">
          A verification email has been sent to <strong>{user?.email}</strong>. Please check your inbox and verify your email address.
        </p>
        {message && <p className="mb-6 text-sm text-green-600">{message}</p>}
        <button
          onClick={handleResendEmail}
          disabled={resendLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
        >
          {resendLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            'Resend Verification Email'
          )}
        </button>
      </div>
    </div>
  );
};

export default VerificationPage;