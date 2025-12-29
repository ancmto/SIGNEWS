import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard da Redação</h1>
      <p className="text-gray-600 mb-8">Bem-vindo ao Sistema de Gestão de Informação.</p>
      <Link to="/login" className="text-purple-600 hover:text-purple-500 underline font-medium">
        Sair / Voltar para Login
      </Link>
    </div>
  );
};

export default DashboardPage;
