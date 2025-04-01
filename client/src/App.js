import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = (userData) => {
    console.log('Login/Signup successful:', userData);
    setIsAuthenticated(true);
    setUserId(userData.userId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard isAuthenticated={isAuthenticated} userId={userId} />} 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Signup onSignup={handleLogin} />
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-black bg-opacity-50 text-center py-4">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Crypto Pricing App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;