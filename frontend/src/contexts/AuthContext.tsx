import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isTokenValid: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isTokenValid = (): boolean => {
    const storedToken = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    
    if (!storedToken || !tokenExpiration) {
      return false;
    }

    const expirationTime = parseInt(tokenExpiration, 10);
    const currentTime = Date.now();

    // Check if token has expired
    if (currentTime >= expirationTime) {
      // Token expired, clear storage
      logout();
      return false;
    }

    return true;
  };

  const login = (newToken: string, newUser: User) => {
    const expirationTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // 1 week in milliseconds
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    localStorage.setItem('userRole', newUser.role);
    localStorage.setItem('username', newUser.username);
    
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole');

    if (storedToken && storedUsername && storedRole && isTokenValid()) {
      setToken(storedToken);
      setUser({ username: storedUsername, role: storedRole });
      setIsAuthenticated(true);
    } else {
      // Clear invalid/expired token
      logout();
    }

    // Set up interval to check token expiration every minute
    const tokenCheckInterval = setInterval(() => {
      if (!isTokenValid()) {
        console.log('Token expired, logging out...');
      }
    }, 60000); // Check every minute

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    isTokenValid
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;