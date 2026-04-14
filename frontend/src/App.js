import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import Notes from './Notes';
import Profile from './Profile';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowRegister(false);
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowRegister(false);
    setCurrentPage('dashboard');
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`App app-shell ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      {isLoggedIn && (
        <div className="top-bar">
          <button
            className={`nav-pill ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            Notes
          </button>
          <button
            className={`nav-pill ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentPage('profile')}
          >
            Profile
          </button>
          <button className="top-button" onClick={toggleTheme}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}

      {!isLoggedIn ? (
        showRegister ? (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onToggleForm={() => setShowRegister(false)}
          />
        ) : (
          <div style={{ position: 'relative' }}>
            <Login onLoginSuccess={handleLoginSuccess} />
            <button className="top-button" onClick={() => setShowRegister(true)}>
              Sign Up
            </button>
          </div>
        )
      ) : currentPage === 'profile' ? (
        <Profile onLogout={handleLogout} />
      ) : (
        <Notes onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
