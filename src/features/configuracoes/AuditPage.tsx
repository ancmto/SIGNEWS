
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/shared/MainLayout';
import { configuracoesService } from './configuracoes.service';
import { AuditEntry } from './types';

const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configuracoesService.getAuditLogs().then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Registro de Auditoria</h2>
            <p className="text-slate-500">Histórico completo e cronológico de atividades dos usuários no sistema.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white hover:bg-gray-50 text-slate-700 border border-gray-300 h-10 px-4 rounded-md font-medium text-sm flex items-center gap-2 shadow-sm transition-all">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            <Link to="/configuracoes/usuarios" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 px-1 pb-3 text-sm font-medium flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[18px]">group</span>
              Listagem de Usuários
            </Link>
            <button className="border-b-2 border-primary text-primary px-1 pb-3 text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">history</span>
              Auditoria Global
            </button>
            <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 px-1 pb-3 text-sm font-medium flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Perfis de Acesso
            </button>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-lg shadow-card border border-gray-200 flex flex-col xl:flex-row gap-4 items-center justify-between">
          <div className="relative w-full xl:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder:text-gray-400" placeholder="Buscar no log de auditoria..." type="text"/>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="material-symbols-outlined text-[18px] text-gray-400">filter_list</span>
              <span className="hidden sm:inline">Filtrar:</span>
            </div>
            <select className="form-select py-2 pl-3 pr-8 text-sm bg-gray-50 border-gray-200 rounded-md focus:border-primary focus:ring-primary/20 text-gray-700 min-w-[140px]">
              <option>Últimos 30 dias</option>
              <option>Última semana</option>
              <option>Hoje</option>
            </select>
            <select className="form-select py-2 pl-3 pr-8 text-sm bg-gray-50 border-gray-200 rounded-md focus:border-primary focus:ring-primary/20 text-gray-700 min-w-[140px]">
              <option>Todos Usuários</option>
              <option>Ricardo Mendes</option>
              <option>Ana Silva</option>
            </select>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-card border border-gray-200 overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Carregando auditoria...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                    <th className="px-6 py-4">Data e Hora</th>
                    <th className="px-6 py-4">Usuário</th>
                    <th className="px-6 py-4">Módulo</th>
                    <th className="px-6 py-4">Tipo de Ação</th>
                    <th className="px-6 py-4">Detalhes da Alteração</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map(log => {
                     const [date, time] = log.timestamp.split(' ');
                     const dateStr = log.timestamp.slice(0, 11);
                     const timeStr = log.timestamp.slice(12);

                     return (
                      <tr key={log.id} className="group hover:bg-primary/[0.02] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">{dateStr}</span>
                            <span className="text-xs text-slate-500">{timeStr}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-cover bg-center border border-gray-200" style={{backgroundImage: `url('${log.userAvatar}')`}}></div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-900">{log.userName}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                            <span className="size-1.5 rounded-full bg-primary mr-1.5"></span>
                            {log.module}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-purple-700">{log.actionType}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {log.details}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AuditPage;
