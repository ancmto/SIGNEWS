import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { contactsService } from '../../services/contactsService';

const AddContactPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    institution: '',
    email: '',
    phone: '',
    specialty: '',
    location: '',
    social_x: '',
    social_instagram: '',
    social_linkedin: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await contactsService.createContact(formData);
      navigate('/contatos');
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
      alert('Erro ao salvar contato. Verifique o console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <header className="flex-none bg-white border-b border-gray-200 sticky top-0 z-10 rounded-lg mb-6 shadow-sm">
          <div className="px-8 py-6 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(-1)} 
                  className="flex items-center justify-center size-10 rounded-full hover:bg-gray-50 text-slate-500 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex flex-col gap-1">
                  <h1 className="text-slate-800 text-3xl font-black leading-tight tracking-tight">Adicionar Novo Contato</h1>
                  <p className="text-slate-500 text-sm font-normal">Preencha as informações para cadastrar uma nova fonte jornalística no sistema.</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 px-8 py-8 max-w-[1000px] mx-auto w-full">
          <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-8 space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
                <div className="relative group cursor-pointer">
                  <div className="size-28 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:text-primary transition-colors overflow-hidden">
                    <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-md border-2 border-white">
                    <span className="material-symbols-outlined text-[16px] block">edit</span>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-slate-800 font-semibold text-lg">Foto do Contato</h3>
                  <p className="text-slate-500 text-sm mb-3">Carregue uma imagem de perfil. Aceitamos JPG, PNG ou GIF.</p>
                  <div className="flex gap-3 justify-center sm:justify-start">
                    <button className="px-4 py-2 text-sm font-medium text-primary bg-purple-50 rounded-lg hover:bg-primary/20 transition-colors" type="button">
                      Escolher arquivo
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors" type="button">
                      Remover
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h4 className="text-slate-800 font-bold text-base mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">person</span>
                    Informações Pessoais
                  </h4>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-800 mb-1.5">Nome Completo <span className="text-red-500">*</span></label>
                  <input 
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary h-10 px-3 text-sm text-slate-800 placeholder:text-slate-400/50 transition-all outline-none" 
                    placeholder="Ex: Maria da Silva" 
                    type="text" 
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="role" className="block text-sm font-semibold text-slate-800 mb-1.5">Cargo / Função</label>
                  <input 
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary h-10 px-3 text-sm text-slate-800 placeholder:text-slate-400/50 transition-all outline-none" 
                    placeholder="Ex: Analista Financeiro" 
                    type="text" 
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="institution" className="block text-sm font-semibold text-slate-800 mb-1.5">Instituição / Empresa</label>
                  <input 
                    id="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary h-10 px-3 text-sm text-slate-800 placeholder:text-slate-400/50 transition-all outline-none" 
                    placeholder="Ex: Banco Central, Hospital São Lucas" 
                    type="text" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-gray-200">
                <div className="md:col-span-2">
                  <h4 className="text-slate-800 font-bold text-base mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">contact_mail</span>
                    Contato e Especialização
                  </h4>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-1.5">Email Principal <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[18px]">mail</span>
                    <input 
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400/50 transition-all outline-none" 
                      placeholder="contato@exemplo.com" 
                      type="email" 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-800 mb-1.5">Telefone / WhatsApp <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[18px]">call</span>
                    <input 
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400/50 transition-all outline-none" 
                      placeholder="(00) 00000-0000" 
                      type="tel" 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-semibold text-slate-800 mb-1.5">Área de Especialização</label>
                  <div className="relative">
                    <select 
                      id="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-3 pr-8 text-sm text-slate-800 cursor-pointer appearance-none outline-none"
                    >
                      <option value="">Selecione uma área</option>
                      <option value="pol">Política</option>
                      <option value="sau">Saúde</option>
                      <option value="eco">Economia</option>
                      <option value="seg">Segurança</option>
                      <option value="esp">Esportes</option>
                      <option value="cul">Cultura</option>
                      <option value="tec">Tecnologia</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                      <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-slate-800 mb-1.5">Localidade</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[18px]">location_on</span>
                    <input 
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400/50 transition-all outline-none" 
                      placeholder="Cidade - UF" 
                      type="text" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-200">
                <h4 className="text-slate-800 font-bold text-base mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">share</span>
                  Redes Sociais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Twitter / X</label>
                    <div className="flex rounded-lg shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-slate-500 text-sm">@</span>
                      <input className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-gray-200 text-sm focus:ring-primary focus:border-primary placeholder:text-slate-400/50 outline-none" placeholder="usuario" type="text" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Instagram</label>
                    <div className="flex rounded-lg shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-slate-500 text-sm">@</span>
                      <input className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-gray-200 text-sm focus:ring-primary focus:border-primary placeholder:text-slate-400/50 outline-none" placeholder="usuario" type="text" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">LinkedIn</label>
                    <input className="w-full rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary h-[38px] px-3 text-sm text-slate-800 placeholder:text-slate-400/50 transition-all outline-none" placeholder="URL do perfil" type="text" />
                  </div>
                </div>
              </div>

            </div>
            <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex items-center justify-end gap-3">
              <button 
                className="px-6 py-2.5 rounded-lg border border-gray-200 bg-white text-slate-800 font-medium hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm shadow-sm" 
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </button>
              <button 
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold transition-all text-sm shadow-md shadow-primary/20 disabled:opacity-50" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">save</span>
                )}
                {loading ? 'Salvando...' : 'Salvar Contato'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddContactPage;
