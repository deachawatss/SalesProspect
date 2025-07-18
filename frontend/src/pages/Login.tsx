import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaWindows, FaUser, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: string;
  user: {
    username: string;
    displayName: string;
    email?: string;
    role: string;
    department?: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5102';
      console.log('Attempting login with:', { username: credentials.username, baseUrl });
      
      const response = await axios.post<LoginResponse>(`${baseUrl}/api/auth/login`, credentials);
      console.log('Login response received:', { 
        status: response.status, 
        hasToken: !!response.data.token,
        user: response.data.user 
      });

      if (response.data.token) {
        console.log('Token received, updating auth context...');
        
        // Use AuthContext login method instead of direct localStorage
        login(response.data.token, {
          username: response.data.user.username,
          role: response.data.user.role
        });
        
        console.log('Auth context updated, navigating to home...');
        navigate('/', { replace: true });
        // Remove window.location.reload() to prevent losing authentication state
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response) {
        // Use the backend error message if available, otherwise fall back to generic message
        const backendMessage = err.response.data?.message || err.response.data?.error;
        setError(backendMessage || 'Login failed. Please check your domain credentials.');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="prospect-sync-logo">
          <img 
            src="https://img2.pic.in.th/pic/logo14821dedd19c2ad18.png" 
            alt="Company Logo" 
            className="company-logo"
          />
          <h1>Sales Prospect Transfer System</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <FaExclamationCircle className="error-icon" />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="windows-login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner">⌛</span>
                Signing in...
              </>
            ) : (
              <>
                <FaWindows className="windows-icon" />
                Sign in with Domain Account
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;