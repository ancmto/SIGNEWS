import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { contactsService } from '../../services/contactsService';

const EditContactPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingParticipation, setAddingParticipation] = useState(false);
  const [participations, setParticipations] = useState([]);
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
    social_linkedin: '',
    type: 'primary'
  });

  const [newParticipation, setNewParticipation] = useState({
    date: new Date().toISOString().split('T')[0],
    program: '',
    type: 'estudio',
    subject: ''
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const data = await contactsService.getContactById(id);
        if (data) {
          setFormData({
            name: data.name || '',
            role: data.role || '',
            institution: data.institution || '',
            email: data.email || '',
            phone: data.phone || '',
            specialty: data.specialty || '',
            location: data.location || '',
            social_x: data.social_x || '',
            social_instagram: data.social_instagram || '',
            social_linkedin: data.social_linkedin || '',
            type: data.type || 'primary'
          });
          setParticipations(data.contact_participations || []);
        }
      } catch (error) {
        console.error('Erro ao carregar contato:', error);
        alert('Erro ao carregar contato.');
        navigate('/contatos');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContact();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipationChange = (e) => {
    const { name, value } = e.target;
    setNewParticipation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await contactsService.updateContact(id, formData);
      navigate('/contatos');
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      alert('Erro ao salvar contato. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddParticipation = async () => {
    if (!newParticipation.program || !newParticipation.subject) {
      alert('Por favor, preencha o programa e o assunto.');
      return;
    }

    try {
      setAddingParticipation(true);
      const data = await contactsService.addParticipation({
        ...newParticipation,
        contact_id: id
      });
      setParticipations(prev => [data, ...prev]);
      setNewParticipation({
        date: new Date().toISOString().split('T')[0],
        program: '',
        type: 'estudio',
        subject: ''
      });
    } catch (error) {
      console.error('Erro ao adicionar participação:', error);
      alert('Erro ao adicionar participação.');
    } finally {
      setAddingParticipation(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/contatos" 
              className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 text-slate-500 hover:text-primary transition-colors hover:border-primary/30"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-[24px] font-bold text-slate-800">Editar Contato</h1>
              <p className="text-slate-500 text-[14px]">Atualize as informações do contato abaixo</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate('/contatos')}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all text-[14px]"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              form="edit-contact-form"
              disabled={saving}
              className={`px-8 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center gap-2 text-[14px] ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-8 pb-12">
          <form id="edit-contact-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna da Esquerda: Info Básica & Foto */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-[120px] h-[120px] rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-slate-50 ring-1 ring-slate-200">
                    <span className="material-symbols-outlined text-slate-300 text-[64px]">person</span>
                  </div>
                  <button type="button" className="absolute bottom-1 right-1 w-10 h-10 bg-primary text-white rounded-full border-4 border-white shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  </button>
                </div>
                <h3 className="text-[18px] font-bold text-slate-800 mb-1">{formData.name || 'Novo Contato'}</h3>
                <p className="text-slate-500 text-[14px]">{formData.role || 'Cargo não definido'}</p>
              </div>

              <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-6 space-y-4">
                <h4 className="text-[15px] font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">share</span>
                  Redes Sociais
                </h4>
                
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">@</span>
                    <input 
                      type="text"
                      name="social_x"
                      value={formData.social_x}
                      onChange={handleChange}
                      placeholder="X (Twitter)"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">social_leaderboard</span>
                    </span>
                    <input 
                      type="text"
                      name="social_instagram"
                      value={formData.social_instagram}
                      onChange={handleChange}
                      placeholder="Instagram"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] material-symbols-outlined">link</span>
                    <input 
                      type="text"
                      name="social_linkedin"
                      value={formData.social_linkedin}
                      onChange={handleChange}
                      placeholder="LinkedIn"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Formulário Completo */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                  <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                  <h2 className="text-[15px] font-semibold text-slate-800">Informações Pessoais</h2>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Nome Completo</label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Dr. Roberto Silva"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Cargo / Função</label>
                    <input 
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Ex: Cientista Político"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Instituição</label>
                    <input 
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="Ex: USP / ECOTV"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                  <span className="material-symbols-outlined text-primary text-[20px]">contact_mail</span>
                  <h2 className="text-[15px] font-semibold text-slate-800">Contato e Especialidade</h2>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">E-mail</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Telefone / WhatsApp</label>
                    <input 
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Área de Especialidade</label>
                    <select 
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                    >
                      <option value="">Selecione uma área</option>
                      <option value="pol">Política</option>
                      <option value="sau">Saúde</option>
                      <option value="eco">Economia</option>
                      <option value="seg">Segurança</option>
                      <option value="edu">Educação</option>
                      <option value="tec">Tecnologia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Localidade (Cidade/UF)</label>
                    <input 
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ex: São Paulo - SP"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Participações */}
          <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">mic</span>
                <h2 className="text-[15px] font-semibold text-slate-800">Participações no Canal</h2>
              </div>
            </div>

            <div className="p-6">
              {/* Form Participação */}
              <div className="bg-slate-50/80 rounded-2xl p-6 mb-8 border border-slate-100">
                <h3 className="text-[14px] font-bold text-slate-700 mb-4 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Nova Participação
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Data</label>
                    <input 
                      type="date"
                      name="date"
                      value={newParticipation.date}
                      onChange={handleParticipationChange}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Programa</label>
                    <input 
                      type="text"
                      name="program"
                      value={newParticipation.program}
                      onChange={handleParticipationChange}
                      placeholder="Ex: Jornal da Eco"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Tipo</label>
                    <select 
                      name="type"
                      value={newParticipation.type}
                      onChange={handleParticipationChange}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option value="estudio">Estúdio</option>
                      <option value="sonora">Sonora</option>
                      <option value="ligacao">Ligação</option>
                      <option value="video">Videochamada</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Assunto / Tema</label>
                    <input 
                      type="text"
                      name="subject"
                      value={newParticipation.subject}
                      onChange={handleParticipationChange}
                      placeholder="Resumo do assunto abordado"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <button 
                      onClick={handleAddParticipation}
                      disabled={addingParticipation}
                      className="w-full h-[38px] bg-primary text-white rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center shadow-md shadow-primary/20 disabled:opacity-50"
                    >
                      {addingParticipation ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">add</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista Participações */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-4 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-tight">Data</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-tight">Programa</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-tight">Tipo</th>
                      <th className="px-4 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-tight">Assunto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {participations.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-slate-400 text-[14px] italic">
                          Nenhuma participação registrada para este contato.
                        </td>
                      </tr>
                    ) : (
                      participations.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 text-[14px] text-slate-600 font-medium">
                            {new Date(p.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-[14px] text-slate-800 font-semibold">{p.program}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ring-1 ring-inset ${
                              p.type === 'estudio' ? 'bg-purple-50 text-purple-700 ring-purple-600/10' :
                              p.type === 'video' ? 'bg-blue-50 text-blue-700 ring-blue-600/10' :
                              p.type === 'sonora' ? 'bg-amber-50 text-amber-700 ring-amber-600/10' :
                              'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
                            }`}>
                              {p.type}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[14px] text-slate-600">{p.subject}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditContactPage;
