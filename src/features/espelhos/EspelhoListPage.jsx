import React, { useState, useEffect } from 'react';
import { Card, Button, Empty, Spin } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/shared/MainLayout';
import { espelhoService } from './espelho.service';

const EspelhoListPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [espelhos, setEspelhos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Define a data de hoje como padrão
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadEspelhos();
    }
  }, [selectedDate]);

  const loadEspelhos = async () => {
    setLoading(true);
    try {
      const result = await espelhoService.getAll();
      // Filtra espelhos pela data selecionada
      const filtered = result.filter(e => e.data === selectedDate);
      setEspelhos(filtered);
    } catch (err) {
      console.error('Erro ao carregar espelhos:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    rascunho: { color: 'bg-yellow-50 border-yellow-200 text-yellow-700', label: 'Rascunho', dot: 'bg-yellow-500' },
    no_ar: { color: 'bg-red-50 border-red-200 text-red-700', label: 'NO AR', dot: 'bg-red-500', pulse: true },
    encerrado: { color: 'bg-slate-50 border-slate-200 text-slate-700', label: 'Encerrado', dot: 'bg-slate-500' },
    preparacao: { color: 'bg-blue-50 border-blue-200 text-blue-700', label: 'Preparação', dot: 'bg-blue-500' },
  };

  return (
    <MainLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">

        {/* Cabeçalho */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Espelhos de Jornal</h1>
          <p className="text-slate-500">Selecione uma data para visualizar os programas agendados.</p>
        </div>

        {/* Seletor de Data - DESTAQUE PRINCIPAL */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarOutlined className="text-2xl text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Exibição</span>
                <span className="text-lg font-semibold text-slate-800">Selecione o dia</span>
              </div>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-14 px-6 text-lg font-mono font-bold border-2 border-primary/30 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm bg-white"
            />
          </div>
        </div>

        {/* Lista de Programas */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : espelhos.length === 0 ? (
          <Card className="rounded-xl shadow-sm border-gray-200">
            <Empty
              description={
                <div className="flex flex-col gap-2">
                  <span className="text-slate-700 font-medium">Nenhum programa agendado para esta data</span>
                  <span className="text-slate-500 text-sm">Selecione outra data ou crie um novo espelho.</span>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <div className="flex justify-center mt-4">
              <Button
                type="primary"
                size="large"
                className="bg-primary h-12 px-8"
                onClick={() => navigate(`/espelhos/editar/novo?data=${selectedDate}`)}
              >
                Criar Novo Espelho
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {espelhos.map((espelho) => {
              const config = statusConfig[espelho.status] || statusConfig.rascunho;

              return (
                <Card
                  key={espelho.id}
                  className="rounded-xl shadow-sm border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => navigate(`/espelhos/editar/${espelho.id}`)}
                >
                  <div className="flex flex-col gap-4">

                    {/* Header com Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                          {espelho.titulo}
                        </h3>
                        <span className="text-xs font-mono text-slate-400">#{espelho.id}</span>
                      </div>

                      <div className={`flex items-center gap-2 px-3 py-1 ${config.color} border rounded-full shrink-0`}>
                        <span className={`size-2 rounded-full ${config.dot} ${config.pulse ? 'animate-pulse' : ''}`}></span>
                        <span className="text-xs font-bold uppercase tracking-wide">{config.label}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-primary" />
                        <span className="font-medium">{espelho.data}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockCircleOutlined className="text-slate-500" />
                        <span className="font-mono font-bold text-slate-700">{espelho.tempo_total}</span>
                      </div>
                    </div>

                    {/* Footer - Botão Editar */}
                    <div className="pt-3 border-t border-slate-100">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group-hover:bg-primary group-hover:text-white">
                        <EditOutlined />
                        Abrir Espelho
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EspelhoListPage;
