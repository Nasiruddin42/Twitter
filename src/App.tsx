import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

// Simple placeholders
//const HomePage: React.FC = () => <h1 className="text-2xl font-bold">Welcome to the Murmur Feed!</h1>; 
const ProfilePage: React.FC = () => <h1 className="text-2xl font-bold">User Profile Page</h1>; 
const NotFoundPage: React.FC = () => <h1 className="text-2xl font-bold">404 Not Found</h1>; 

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;