import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';

// Simple placeholder for other routes
const Placeholder = ({ title }) => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <Link to="/login" className="text-purple-600 underline">Voltar para o Login</Link>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/register" element={<Placeholder title="Cadastro de Usuário" />} />
      <Route path="/forgot-password" element={<Placeholder title="Recuperar Senha" />} />
      
      {/* Default redirect to login for now */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
