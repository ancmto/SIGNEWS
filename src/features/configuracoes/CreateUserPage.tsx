
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/shared/MainLayout';
import { configuracoesService } from './configuracoes.service';
import { UserRole } from './types';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.REPORTER,
    permissionsType: 'Limitado' as const
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await configuracoesService.createUser(formData);
      navigate('/configuracoes/usuarios');
    } catch (error) {
      console.error('Error creating user', error);
      alert('Erro ao criar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 pb-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#140d1b] text-3xl font-bold leading-tight tracking-tight">Cadastro de Usuário</h1>
          <p className="text-[#734c9a] text-base font-normal">Preencha os dados abaixo para conceder acesso a um novo membro da equipe.</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                <h3 className="text-lg font-semibold text-[#140d1b]">Dados de Identificação</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#140d1b]">Nome Completo</span>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="h-12 w-full rounded-lg border border-[#dbcfe7] bg-[#faf8fc] px-4 text-[#140d1b] placeholder:text-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="Ex: Ana Souza"
                    type="text"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#140d1b]">Email Corporativo (Login)</span>
                  <input
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="h-12 w-full rounded-lg border border-[#dbcfe7] bg-[#faf8fc] px-4 text-[#140d1b] placeholder:text-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="Ex: ana.souza@ecotv.com.br"
                    type="email"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </span>
                <h3 className="text-lg font-semibold text-[#140d1b]">Função e Permissões</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#140d1b]">Função do Sistema</span>
                  <div className="relative">
                    <select
                      required
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="h-12 w-full appearance-none rounded-lg border border-[#dbcfe7] bg-[#faf8fc] px-4 text-[#140d1b] focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    >
                      {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </label>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#140d1b]">Configuração de Permissões</span>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        checked={formData.permissionsType === 'Limitado'}
                        onChange={() => setFormData({...formData, permissionsType: 'Limitado'})}
                        className="size-4 text-primary focus:ring-primary border-gray-300"
                        name="permissions"
                        type="radio"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">Perfil Padrão</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        checked={formData.permissionsType === 'Customizado'}
                        onChange={() => setFormData({...formData, permissionsType: 'Customizado'})}
                        className="size-4 text-primary focus:ring-primary border-gray-300"
                        name="permissions"
                        type="radio"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">Personalizado</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
              <Link to="/configuracoes/usuarios" className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors">
                Cancelar
              </Link>
              <button
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
              >
                {isSubmitting ? (
                  <span className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                )}
                {isSubmitting ? 'Criando...' : 'Criar Usuário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateUserPage;
