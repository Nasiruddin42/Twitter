import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* This MUST have the :userId suffix */}
        <Route path="profile/:userId" element={<ProfilePage />} />
        
        <Route path="*" element={<div className="p-10 text-center text-2xl font-bold">404 - Page Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;