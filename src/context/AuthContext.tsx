import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkSession, login, logout, register } from '../api/apiService';

// 1. Define the User interface based on your Backend Entity
interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
}

// 2. Define what the Context will provide to the rest of the app
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<any>;
  handleLogout: () => Promise<void>;
}

// 3. Initialize the context with 'undefined' and a proper Type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Custom hook for easier access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 5. The Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await checkSession();
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<User> => {
    const response = await login({ email, password });
    setUser(response.data.user);
    return response.data.user;
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    const response = await register({ username, email, password });
    // Attempt automatic login after registration
    await handleLogin(email, password);
    return response.data;
  };

  const onLogout = async () => {
    await logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    handleLogout: onLogout, // Renamed for clarity
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};