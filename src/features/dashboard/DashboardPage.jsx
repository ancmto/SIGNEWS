import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/shared/MainLayout';
import { useAuth } from '@/components/common/AuthContext';
import { dashboardService } from './dashboard.service';
import styles from './dashboard.module.css';

// Funções auxiliares
const getStatusConfig = (status) => {
  const configs = {
    'rascunho': { label: 'Rascunho', color: 'bg-gray-300', labelColor: 'bg-gray-100 text-slate-500' },
    'aprovado': { label: 'Aprovado', color: 'bg-info', labelColor: 'bg-blue-50 text-info border-blue-100' },
    'no_ar': { label: 'NO AR', color: 'bg-error', labelColor: 'bg-error/10 text-error border-error/20' },
    'encerrado': { label: 'Encerrado', color: 'bg-gray-300', labelColor: 'bg-gray-100 text-slate-500' }
  };
  return configs[status] || { label: 'Preparação', color: 'bg-warning', labelColor: 'bg-warning/10 text-amber-700 border-warning/20' };
};

const formatTime = (time) => {
  if (!time) return '--:--';
  return time.substring(0, 5);
};

const calculateProgress = (espelho) => {
  if (!espelho.tempo_total_previsto || !espelho.tempo_total_real) return 0;
  return Math.min(Math.round((espelho.tempo_total_real / espelho.tempo_total_previsto) * 100), 100);
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.email?.split('@')[0] || 'Usuário';

  const [stats, setStats] = useState({ pautas: 0, pautasPending: 0, pautasApproved: 0, reportagens: 0, espelhos: 0, contacts: 0 });
  const [activities, setActivities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [espelhosStatus, setEspelhosStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, activitiesData, teamsData, espelhosData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentActivity(),
          dashboardService.getExternalTeams(),
          dashboardService.getEspelhosStatus()
        ]);
        setStats(statsData);
        setActivities(activitiesData);
        setTeams(teamsData);
        setEspelhosStatus(espelhosData);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* GREETING & ACTIONS */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-6 rounded-lg border border-gray-100 shadow-card">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Olá, {userName}! 👋</h2>
          <p className="text-slate-500 text-sm mt-1">Aqui está o panorama geral da produção hoje.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/pautas/nova')}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm shadow-purple-200 transition-all hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nova Pauta
          </button>
          <button className="inline-flex items-center gap-2 bg-white hover:border-primary text-slate-600 hover:text-primary border border-gray-200 text-sm font-medium px-4 py-2 rounded-md transition-all hover:-translate-y-0.5 hover:shadow-sm">
            <span className="material-symbols-outlined text-[18px]">videocam</span>
            Nova Reportagem
          </button>
          <button className="inline-flex items-center gap-2 bg-white hover:border-primary text-slate-600 hover:text-primary border border-gray-200 text-sm font-medium px-4 py-2 rounded-md transition-all hover:-translate-y-0.5 hover:shadow-sm">
            <span className="material-symbols-outlined text-[18px]">view_timeline</span>
            Novo Espelho
          </button>
        </div>
      </div>

      {/* EDITORIAL ALERT */}
      <div className="rounded-md bg-[#fffbe6] border border-[#ffe58f] p-4 flex items-start gap-3 shadow-sm relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#faad14]"></div>
        <span className="material-symbols-outlined text-[#faad14] mt-0.5 font-variation-settings-fill-1">warning</span>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-800">Alerta Editorial: Chuvas SP</h4>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">Cobertura prioritária das chuvas na região metropolitana. Equipes devem focar em alagamentos na Zona Leste. Atualizações de trânsito e defesa civil a cada 30 min no sistema.</p>
        </div>
        <div className="flex gap-4">
          <button className="text-sm text-[#faad14] font-medium hover:text-orange-600 whitespace-nowrap transition-colors">Ignorar</button>
          <button className="text-sm bg-[#faad14] text-white px-3 py-1 rounded font-medium hover:bg-orange-500 whitespace-nowrap transition-colors shadow-sm">Ver detalhes</button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pautas Card */}
        <div className="ant-card p-5 group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pautas do Dia</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-bold text-slate-800">{loading ? '...' : stats.pautas}</h3>
                <span className="text-xs font-medium text-success flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +4
                </span>
              </div>
            </div>
            <div className="size-10 rounded-full bg-purple-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">article</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-medium">Pendentes / Em Análise</span>
                <span className="font-bold text-slate-800">{loading ? '...' : stats.pautasPending}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-400 rounded-full relative overflow-hidden transition-all duration-500"
                  style={{ width: `${stats.pautas > 0 ? (stats.pautasPending / stats.pautas) * 100 : 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-medium">Aprovadas</span>
                <span className="font-bold text-slate-800">{loading ? '...' : stats.pautasApproved}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${stats.pautas > 0 ? (stats.pautasApproved / stats.pautas) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Reportagens Card */}
        <div className="ant-card p-5 group cursor-pointer border-l-4 border-l-transparent hover:border-l-info">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Reportagens</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-bold text-slate-800">{loading ? '...' : stats.reportagens}</h3>
              </div>
            </div>
            <div className="size-10 rounded-full bg-blue-50 text-info flex items-center justify-center group-hover:bg-info group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">video_library</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-medium">Em Produção / Edição</span>
                <span className="font-bold text-slate-800">12</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-info w-[66%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-medium">Prontas para Exibição</span>
                <span className="font-bold text-slate-800">6</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-success w-[33%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Espelhos Card */}
        <div className="ant-card p-5 group cursor-pointer border-l-4 border-l-transparent hover:border-l-error">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Espelhos do Dia</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-bold text-slate-800">{loading ? '...' : stats.espelhos}</h3>
              </div>
            </div>
            <div className="size-10 rounded-full bg-red-50 text-error flex items-center justify-center group-hover:bg-error group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">live_tv</span>
            </div>
          </div>
          <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-red-50/50 rounded border border-red-100">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-error animate-pulse shadow-[0_0_8px_rgba(245,34,45,0.6)]"></span>
                <span className="text-xs font-bold text-slate-800">SGI Meio Dia</span>
              </div>
              <span className="text-[10px] font-bold text-error border border-error/20 px-2 py-0.5 rounded bg-white">NO AR</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-white rounded border border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-warning"></span>
                <span className="text-xs font-medium text-slate-600">Jornal da Tarde</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-gray-50 px-1.5 py-0.5 rounded">18:30</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">view_kanban</span>
              Status dos Espelhos
            </h3>
            <button
              onClick={() => navigate('/espelhos')}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              Ver grade completa
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 text-center text-sm text-slate-500 py-8">
                Carregando espelhos...
              </div>
            ) : espelhosStatus.length === 0 ? (
              <div className="col-span-2 text-center text-sm text-slate-500 py-8">
                Nenhum espelho criado para hoje.
              </div>
            ) : (
              espelhosStatus.map((espelho) => {
                const statusConfig = getStatusConfig(espelho.status);
                return (
                  <MirrorStatusCard
                    key={espelho.id}
                    title={espelho.programa?.nome || 'Programa'}
                    time={formatTime(espelho.horario_previsto)}
                    status={statusConfig.label}
                    statusColor={statusConfig.color}
                    statusLabelColor={statusConfig.labelColor}
                    editor={espelho.editor_responsavel}
                    progress={espelho.status === 'no_ar' ? calculateProgress(espelho) : undefined}
                    isLive={espelho.status === 'no_ar'}
                    showLink={true}
                    onClickLink={() => navigate(`/espelhos/${espelho.id}`)}
                  />
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* RECENT ACTIVITY */}
          <div className="ant-card">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-lg">
              <h3 className="text-sm font-bold text-slate-800">Atividade Recente</h3>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
            <div className="p-0">
              {loading ? (
                <div className="p-4 text-center text-xs text-slate-500">Carregando atividades...</div>
              ) : activities.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">Nenhuma atividade recente.</div>
              ) : (
                activities.map((activity, index) => (
                  <ActivityItem 
                    key={activity.id}
                    title={activity.title}
                    desc={activity.description}
                    meta={activity.meta}
                    type={activity.type}
                    isLast={index === activities.length - 1}
                  />
                ))
              )}
            </div>
          </div>

          {/* EXTERNAL TEAMS */}
          <div className="ant-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Equipes Externas</h3>
              <span className="bg-gray-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">3 Ativas</span>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-xs text-slate-500">Carregando equipes...</div>
              ) : teams.length === 0 ? (
                <div className="text-center text-xs text-slate-500">Nenhuma equipe ativa.</div>
              ) : (
                teams.map((team) => (
                  <TeamItem 
                    key={team.id}
                    name={team.name} 
                    loc={team.location} 
                    status={team.status} 
                    statusLabel={team.status_label} 
                    img={team.image_url}
                  />
                ))
              )}
            </div>
            <button className="w-full mt-4 py-2 text-xs text-slate-600 font-medium bg-white hover:bg-gray-50 rounded border border-gray-200 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[14px]">map</span>
              Ver mapa de equipes
            </button>
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
};

// HELPER COMPONENTS FOR DASHBOARD
const MirrorStatusCard = ({ title, time, status, statusColor, statusLabelColor, editor, progress, isLive, stats, showLink, onClickLink }) => (
  <div
    className="ant-card p-4 flex flex-col justify-between hover:shadow-floating transition-all duration-300 cursor-pointer relative overflow-hidden group"
    onClick={onClickLink}
  >
    <div className={`absolute top-0 left-0 w-1 h-full ${statusColor} group-hover:w-1.5 transition-all`}></div>
    <div className="flex justify-between items-start mb-3 pl-2">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          {isLive && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {time}
        </div>
      </div>
      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide border border-current ${statusLabelColor}`}>
        {status}
      </span>
    </div>

    <div className="mt-2 pl-2">
      {progress !== undefined ? (
        <>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Progresso</span>
            <span className={`font-bold ${statusColor.replace('bg-', 'text-')}`}>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className={`${statusColor} h-1.5 rounded-full transition-all duration-1000 ease-out relative`} style={{ width: `${progress}%` }}>
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 size-2 bg-white border-2 ${statusColor.replace('bg-', 'border-')} rounded-full shadow`}></div>
            </div>
          </div>
        </>
      ) : stats ? (
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-gray-50">
          <div className="bg-gray-50 rounded p-1.5">
            <span className="block text-xs font-bold text-slate-700">{stats.items}</span>
            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Matérias</span>
          </div>
          <div className="bg-gray-50 rounded p-1.5">
            <span className="block text-xs font-bold text-slate-700">{stats.time}</span>
            <span className="block text-[9px] text-slate-400 uppercase font-semibold">Tempo</span>
          </div>
          <div className="bg-red-50 rounded p-1.5 border border-red-100">
            <span className="block text-xs font-bold text-error">{stats.overflow}</span>
            <span className="block text-[9px] text-error uppercase font-semibold">Estouro</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <span className="text-xs text-slate-400">
            {editor ? (
              <>Editor: <strong className="text-slate-700">{editor}</strong></>
            ) : (
              <span className="text-slate-400">Sem editor definido</span>
            )}
          </span>
          {showLink && <button className="text-xs text-primary hover:underline font-medium">Abrir Espelho</button>}
        </div>
      )}
    </div>
  </div>
);

const ActivityItem = ({ title, desc, meta, type, isLast }) => {
  const colors = {
    success: 'bg-success ring-green-50',
    info: 'bg-info ring-blue-50',
    warning: 'bg-warning ring-yellow-50'
  };
  
  return (
    <div className={`flex gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 relative`}>
      {!isLast && <div className="absolute left-4 top-4 bottom-0 w-px bg-gray-100 ml-1 z-0"></div>}
      <div className="mt-1 flex-shrink-0 z-10 relative bg-white p-0.5">
        <div className={`size-2.5 rounded-full ring-4 ${colors[type]}`}></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-800">{title}</span>
        {desc && <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{desc}</p>}
        <span className="text-[10px] text-slate-400 mt-1">{meta}</span>
      </div>
    </div>
  );
};

const TeamItem = ({ name, loc, status, statusLabel, img }) => {
  const statusColors = {
    success: 'bg-success text-success',
    error: 'bg-error text-error',
    warning: 'bg-warning text-warning-700'
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-cover shadow-sm bg-gray-200" style={{ backgroundImage: `url(${img})` }}></div>
        <div>
          <p className="text-xs font-bold text-slate-700">{name}</p>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <span className="material-symbols-outlined text-[10px]">location_on</span>
            {loc}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`size-2 rounded-full mb-1 ${statusColors[status].split(' ')[0]}`} title={statusLabel}></span>
        <span className={`text-[9px] font-medium ${statusColors[status].split(' ')[1]}`}>{statusLabel}</span>
      </div>
    </div>
  );
};

export default DashboardPage;