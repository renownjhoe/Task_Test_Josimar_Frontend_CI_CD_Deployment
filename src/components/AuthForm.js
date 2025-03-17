import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/authSlice';
import { register, login as loginUser } from '../services/authService';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
  
    // Frontend validation: Check if passwords match
    if (!isLogin && formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: ['Passwords do not match.'] });
      return;
    }
  
    setLoading(true); // Start loading
  
    try {
      let response;
      if (isLogin) {
        response = await loginUser({ email: formData.email, password: formData.password });
      } else {
        response = await register(formData);
      }
      console.log('API Response:', response); // Log the response to debug

      // Handle registration response
      if (!isLogin) {
        const { token, user } = response; // Destructure token and user from response.data
  
        // Store the token in local storage
        localStorage.setItem('token', token);
  
        // Dispatch login action to update Redux state
        dispatch(login(user));
  
        // Redirect to verification page
        navigate('/verify-email');
      } else {
        // Handle login response
        const { token, user } = response; // Destructure token and user from response.data
  
        // Store the token in local storage
        localStorage.setItem('token', token);
  
        // Dispatch login action to update Redux state
        dispatch(login(user));
  
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      if (typeof error === 'string') {
        // If error is a string, show it as a general error
        setErrors({ general: [error] });
      } else if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Login/Registration failed:', error);
        setErrors({ general: ['Something went wrong. Please try again.'] });
      }
    } finally {
      setLoading(false);
    }
    
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name[0]}</p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password[0]}</p>
            )}
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChange={(e) =>
                  setFormData({ ...formData, password_confirmation: e.target.value })
                }
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.password_confirmation && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password_confirmation[0]}
                </p>
              )}
            </div>
          )}
          {errors.general && errors.general.map((err, index) => (
                <p key={index} className="text-red-600 text-center mb-4">{err}</p>
          ))}
          <button
            type="submit"
            disabled={loading} // Disable the button when loading
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
          >
            {loading ? (
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
                Processing...
              </>
            ) : (
              isLogin ? 'Login' : 'Register'
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-500 focus:outline-none"
          >
            {isLogin
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;