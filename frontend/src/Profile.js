import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Profile = ({ onLogout }) => {
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [username, setUsername] = useState(storedUser.username || '');
  const [email, setEmail] = useState(storedUser.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5001/api/auth/profile',
        { username, email, password: password || undefined },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      localStorage.setItem('user', JSON.stringify(response.data.user));
      setMessage('Profile saved successfully');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <h1>Profile</h1>
        <p>Update your account details and manage your login.</p>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password (leave empty to keep current)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="primary">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
        <button
          type="button"
          className="primary"
          style={{ marginTop: '14px', width: '100%', background: '#ff8a57' }}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
