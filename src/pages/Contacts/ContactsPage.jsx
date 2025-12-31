import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { contactsService } from '../../services/contactsService';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsService.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await contactsService.deleteContact(id);
        fetchContacts();
      } catch (error) {
        console.error('Erro ao excluir contato:', error);
      }
    }
  };
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <header className="flex-none bg-white border-b border-gray-200 sticky top-0 z-10 rounded-lg mb-6 shadow-sm">
          <div className="px-8 py-6 w-full">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-800 text-3xl font-black leading-tight tracking-tight">Contatos e Fontes</h1>
                <p className="text-slate-500 text-sm font-normal">Gerencie sua base de fontes jornalísticas e contatos especializados.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-white border border-gray-200 text-slate-800 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm gap-2">
                  <span className="material-symbols-outlined text-[20px]">ios_share</span>
                  <span className="hidden sm:inline">Exportar</span>
                </button>
                <Link to="/contatos/novo" className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-purple-200 transition-all gap-2">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>Novo Contato</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
              <div className="w-full md:flex-1">
                <label className="flex flex-col w-full">
                  <span className="text-xs font-semibold text-slate-500 mb-1.5 ml-1">Buscar</span>
                  <div className="relative flex w-full items-center">
                    <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
                      <span className="material-symbols-outlined text-[20px]">search</span>
                    </div>
                    <input className="flex w-full rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none" placeholder="Pesquisar por nome, telefone, cargo ou tags..." defaultValue="" />
                  </div>
                </label>
              </div>
              <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <label className="flex flex-col min-w-[160px]">
                  <span className="text-xs font-semibold text-slate-500 mb-1.5 ml-1">Especialidade</span>
                  <div className="relative">
                    <select className="w-full rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-3 pr-8 text-sm text-slate-800 cursor-pointer appearance-none outline-none">
                      <option value="">Todas as áreas</option>
                      <option value="pol">Política</option>
                      <option value="sau">Saúde</option>
                      <option value="eco">Economia</option>
                      <option value="seg">Segurança</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                      <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    </div>
                  </div>
                </label>
                <label className="flex flex-col min-w-[160px]">
                  <span className="text-xs font-semibold text-slate-500 mb-1.5 ml-1">Localidade</span>
                  <div className="relative">
                    <select className="w-full rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-3 pr-8 text-sm text-slate-800 cursor-pointer appearance-none outline-none">
                      <option value="">Todas</option>
                      <option value="sp">São Paulo</option>
                      <option value="rj">Rio de Janeiro</option>
                      <option value="mg">Minas Gerais</option>
                      <option value="df">Brasília</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                      <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16"></th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Contato</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[240px]">Cargo / Instituição</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[180px]">Telefone</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Email</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[180px]" title="Calculado a partir do bloco de 'Participações no Canal'">Participações (unidades)</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[140px]">Tags</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-10 text-center text-slate-500">
                        Carregando contatos...
                      </td>
                    </tr>
                  ) : contacts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-10 text-center text-slate-500">
                        Nenhum contato encontrado.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr key={contact.id} className="group hover:bg-purple-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div 
                            className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-1 ring-gray-200 flex items-center justify-center bg-gray-100 text-primary font-bold text-sm"
                            style={contact.photo_url ? {backgroundImage: `url("${contact.photo_url}")`} : {}}
                          >
                            {!contact.photo_url && contact.name.charAt(0)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-800 text-sm font-semibold">{contact.name}</p>
                          <p className="text-slate-500 text-xs">
                            {contact.created_at ? `Cadastrado em ${new Date(contact.created_at).toLocaleDateString()}` : ''}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-slate-800 text-sm">{contact.role || '-'}</span>
                            <span className="text-slate-500 text-xs">{contact.institution || '-'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 group/phone">
                            <span className="text-slate-800 text-sm font-medium">{contact.phone || '-'}</span>
                            {contact.phone && (
                              <button 
                                className="opacity-0 group-hover/phone:opacity-100 text-primary hover:bg-purple-50 rounded p-1 transition-all" 
                                title="Copiar"
                                onClick={() => navigator.clipboard.writeText(contact.phone)}
                              >
                                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {contact.email ? (
                            <a className="text-slate-500 hover:text-primary text-sm underline decoration-dotted underline-offset-4" href={`mailto:${contact.email}`}>
                              {contact.email}
                            </a>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-slate-800 text-sm font-medium bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                              {contact.participations_count || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {contact.specialty && (
                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 uppercase">
                              {contact.specialty}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link 
                              to={`/contatos/editar/${contact.id}`}
                              className="text-slate-400 hover:text-primary hover:bg-purple-50 rounded-full p-2 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </Link>
                            <button 
                              onClick={() => handleDelete(contact.id)}
                              className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full p-2 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <span>Exibir</span>
                  <div className="relative">
                    <select className="appearance-none bg-gray-50 border border-gray-200 text-slate-800 text-xs rounded-md pl-2 pr-6 py-1 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer outline-none">
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-slate-500">
                      <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    </div>
                  </div>
                  <span>itens por página</span>
                </div>
                <span className="hidden sm:inline-block h-4 w-px bg-gray-200"></span>
                <span>Mostrando <span className="font-medium text-slate-800">1-50</span> de <span className="font-medium text-slate-800">328</span></span>
              </div>
              <div className="flex items-center gap-1">
                <button className="flex items-center justify-center size-8 rounded border border-gray-200 text-slate-500 hover:bg-gray-50 hover:text-primary disabled:opacity-50 transition-colors" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="flex items-center justify-center size-8 rounded bg-primary text-white text-sm font-medium shadow-sm">1</button>
                <button className="flex items-center justify-center size-8 rounded border border-transparent text-slate-500 text-sm font-medium hover:bg-gray-50 hover:text-primary transition-colors">2</button>
                <button className="flex items-center justify-center size-8 rounded border border-transparent text-slate-500 text-sm font-medium hover:bg-gray-50 hover:text-primary transition-colors">3</button>
                <span className="flex items-center justify-center size-8 text-slate-500">...</span>
                <button className="flex items-center justify-center size-8 rounded border border-transparent text-slate-500 text-sm font-medium hover:bg-gray-50 hover:text-primary transition-colors">7</button>
                <button className="flex items-center justify-center size-8 rounded border border-gray-200 text-slate-500 hover:bg-gray-50 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactsPage;
