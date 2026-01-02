
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/shared/MainLayout';
import { configuracoesService } from './configuracoes.service';
import { User } from './types';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    configuracoesService.getUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleOpenDrawer = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  return (
    <MainLayout>
      <div className="relative">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Gestão de Usuários</h2>
              <p className="text-slate-500">Controle total sobre quem acessa o NCRS e seus níveis de permissão.</p>
            </div>
            <Link to="/configuracoes/usuarios/novo" className="bg-primary hover:bg-primary-hover text-white h-10 px-5 rounded-md font-medium text-sm flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Novo Usuário
            </Link>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              <button className="border-b-2 border-primary text-primary px-1 pb-3 text-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">group</span>
                Listagem de Usuários
              </button>
              <Link to="/configuracoes/auditoria" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 px-1 pb-3 text-sm font-medium flex items-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-[18px]">history</span>
                Auditoria e Logs
              </Link>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-lg shadow-card border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder:text-gray-400" placeholder="Buscar por nome, email ou matrícula..." type="text"/>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-card border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                  <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium">Carregando usuários...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                      <th className="px-6 py-4">Usuário</th>
                      <th className="px-6 py-4">Cargo / Função</th>
                      <th className="px-6 py-4 text-center">Permissões</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Último Acesso</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(user => (
                      <tr key={user.id} className={`group hover:bg-primary/[0.02] transition-colors ${selectedUser?.id === user.id && drawerOpen ? 'bg-primary/[0.03] border-l-4 border-l-primary' : ''}`}>
                        <td className={`px-6 py-4 ${selectedUser?.id === user.id && drawerOpen ? 'pl-5' : ''}`}>
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-cover bg-center border border-gray-200" style={{backgroundImage: `url('${user.avatarUrl}')`}}></div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                              <span className="text-xs text-slate-500">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${user.role === 'Editor Chefe' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-teal-100 text-teal-800 border-teal-200'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {user.permissionsType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`size-2 rounded-full ${user.status === 'Ativo' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span className="text-sm text-slate-600">{user.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{user.lastAccess}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleOpenDrawer(user)} className={`p-1.5 rounded-md transition-colors ${selectedUser?.id === user.id && drawerOpen ? 'text-primary bg-primary/10 ring-2 ring-primary/20' : 'text-gray-400 hover:text-primary hover:bg-primary/10'}`} title="Gerenciar Permissões">
                            <span className="material-symbols-outlined text-[20px]">vpn_key</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {!loading && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
                <p className="text-xs text-gray-500">Mostrando {users.length} usuários</p>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Overlay */}
        {drawerOpen && (
          <div className="fixed inset-0 z-20 bg-gray-900/40 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)}></div>
        )}

        {/* Drawer */}
        <div className={`fixed inset-y-0 right-0 w-[480px] bg-surface shadow-drawer z-30 flex flex-col border-l border-gray-200 transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedUser && (
            <>
              <div className="p-6 border-b border-gray-200 flex flex-col bg-gray-50/80">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">Permissões e Função</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="size-6 rounded-full bg-cover bg-center border border-gray-300" style={{backgroundImage: `url('${selectedUser.avatarUrl}')`}}></div>
                      <p className="text-sm text-slate-600">Usuário: <span className="font-semibold text-primary">{selectedUser.name}</span></p>
                    </div>
                  </div>
                  <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] block text-gray-500">badge</span>
                    <span className="font-semibold text-sm text-slate-800">Dados da Função</span>
                  </div>
                  <div className="p-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Função</label>
                    <select className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-sm py-2" defaultValue={selectedUser.role}>
                      <option>Editor Chefe</option>
                      <option>Produtor</option>
                      <option>Repórter</option>
                      <option>Administrador</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex gap-3 shadow-sm">
                  <span className="material-symbols-outlined text-blue-600 shrink-0 mt-0.5">info</span>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Perfil: {selectedUser.role}</h4>
                    <p className="text-sm text-blue-700 mt-0.5">Permissões padrão aplicadas.</p>
                  </div>
                </div>

                {['Planejamento', 'Produção', 'Aprovação'].map(module => (
                  <div key={module} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          {module === 'Planejamento' ? 'calendar_month' : module === 'Produção' ? 'edit_note' : 'check_circle'}
                        </span>
                        <span className="font-semibold text-sm text-slate-800">{module}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer"/>
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-2">
                      {['Visualizar', 'Criar', 'Editar', 'Excluir'].map(perm => (
                        <label key={perm} className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="checkbox" defaultChecked={perm !== 'Excluir'} className="mt-0.5 rounded text-primary border-gray-300 focus:ring-primary"/>
                          <span>{perm} {module}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                <span className="text-xs text-gray-400">Última alteração: <strong>Ricardo</strong></span>
                <div className="flex gap-3">
                  <button onClick={() => setDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Cancelar</button>
                  <button onClick={() => setDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95">Salvar</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UsersPage;
