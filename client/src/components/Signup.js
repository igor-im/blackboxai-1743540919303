import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Show loading state in button
      console.log('Attempting signup with email:', formData.email);
      document.activeElement.blur(); // Remove focus from the button

      
      const response = await axios.post('http://localhost:3001/api/signup', {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Signup response:', response.data);
      
      if (response.data.success) {
        console.log('Signup successful:', response.data);
        // Call onSignup with the expected data structure
        onSignup({
          userId: response.data.userId,
          message: response.data.message
        });
        // Navigate to dashboard after successful signup
        navigate('/');
      } else {
        console.error('Signup failed:', response.data.error);
        setError(response.data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error details:', {
        message: err.message,
        response: err.response,
        request: err.request
      });
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.error || 'Server error during signup');
      } else if (err.request) {
        // Request made but no response
        setError('Could not connect to server. Please try again.');
      } else {
        // Error in request setup
        setError('Error preparing signup request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join us to track your favorite cryptocurrencies</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-75 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Create a password"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Confirm your password"
            />
          </div>

          {/* Submit Button */}
                    <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              loading
                ? 'bg-green-700 cursor-not-allowed opacity-75'
                : 'bg-green-600 hover:bg-green-700'
            } transition-all duration-200 flex items-center justify-center space-x-2 relative`}
          >

            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                <span>Sign Up</span>
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;