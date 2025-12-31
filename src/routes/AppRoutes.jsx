import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';

import ContactsPage from '../pages/Contacts/ContactsPage';
import AddContactPage from '../pages/Contacts/AddContactPage';
import EditContactPage from '../pages/Contacts/EditContactPage';

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
      
      {/* Contacts Routes */}
      <Route path="/contatos" element={<ContactsPage />} />
      <Route path="/contatos/novo" element={<AddContactPage />} />
      <Route path="/contatos/editar/:id" element={<EditContactPage />} />
      
      <Route path="/register" element={<Placeholder title="Cadastro de Usuário" />} />
      <Route path="/forgot-password" element={<Placeholder title="Recuperar Senha" />} />
      
// Adicione os novos caminhos dentro do MainLayout
<Route path="pautas" element={<PautasListPage />} />
<Route path="pautas/nova" element={<PautaFormPage />} />
<Route path="pautas/editar/:id" element={<PautaFormPage />} />


      {/* Default redirect to login for now */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
