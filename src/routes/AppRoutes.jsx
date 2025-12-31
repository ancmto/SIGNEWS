import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from '@/features/auth/LoginPage';
import DashboardPage from '@/features/dashboard/DashboardPage';

import ContactsPage from '@/features/contacts/ContactsPage';
import AddContactPage from '@/features/contacts/AddContactPage';
import EditContactPage from '@/features/contacts/EditContactPage';

import PautasListPage from '@/features/pautas/PautasListPage';
import PautaFormPage from '@/features/pautas/PautaFormPage';

// --- NOVOS IMPORTS DE REPORTAGENS ---
import ReportagemListPage from '@/features/reportagens/ReportagemListPage';
import ReportagemFormPage from '@/features/reportagens/ReportagemFormPage';

import LixeiraGlobal from '@/features/lixeira/LixeiraGlobal';

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
      
      {/* Pautas Routes */}
      <Route path="/pautas" element={<Navigate to="/planejamento/pautas" />} />
      <Route path="/planejamento/pautas" element={<PautasListPage />} />
      <Route path="/planejamento/pautas/nova" element={<PautaFormPage />} />
      <Route path="/planejamento/pautas/editar/:id" element={<PautaFormPage />} />


      {/* --- ROTAS DE REPORTAGENS --- */}
      <Route path="/reportagens" element={<Navigate to="/producao/reportagens" />} />
      <Route path="/producao/reportagens" element={<ReportagemListPage />} />
      <Route path="/producao/reportagens/nova" element={<ReportagemFormPage />} />
      <Route path="/producao/reportagens/editar/:id" element={<ReportagemFormPage />} />

      {/* Sistema */}
      <Route path="/sistema/lixeira" element={<LixeiraGlobal />} />
      
      {/* Configuração Routes */}
      <Route path="/register" element={<Placeholder title="Cadastro de Usuário" />} />
      <Route path="/forgot-password" element={<Placeholder title="Recuperar Senha" />} />
      
      {/* Default redirect to login for now */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;