import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SaveOutlined, PrinterOutlined, PlusOutlined,
  PlayCircleOutlined, DragOutlined, CheckOutlined,
  VideoCameraOutlined, FileTextOutlined, CoffeeOutlined,
  SendOutlined, ClockCircleOutlined, BellOutlined,
  MoreOutlined, DownOutlined, UpOutlined, InfoCircleOutlined,
  TeamOutlined, UserOutlined, CloseOutlined, LoadingOutlined
} from '@ant-design/icons';
import { Tabs, message } from 'antd';
import TopInfoBar from '@/components/shared/TopInfoBar';
import Sidebar from '@/components/shared/Sidebar';
import TimingBar from './components/TimingBar';
import { espelhoService } from './espelho.service';

const EspelhoPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new');
  const [tabs, setTabs] = useState([
    { key: 'new', label: 'Novo Espelho', loaded: false }
  ]);

  // Form states for new/unloaded tab
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [loading, setLoading] = useState(false);
  const [programas, setProgramas] = useState([]);

  // Loaded espelho data per tab
  const [loadedEspelhos, setLoadedEspelhos] = useState({});

  // Carrega lista de programas ao montar o componente
  useEffect(() => {
    loadProgramas();
  }, []);

  const loadProgramas = async () => {
    try {
      console.log('🔄 Carregando programas...');
      const data = await espelhoService.getProgramas();
      console.log('✅ Programas carregados:', data);
      setProgramas(data);
      console.log('📊 Total de programas:', data?.length || 0);
    } catch (error) {
      console.error('❌ Erro ao carregar programas:', error);
      message.error('Erro ao carregar lista de programas: ' + error.message);
    }
  };

  const handleLoadEspelho = async () => {
    if (!selectedProgram) {
      message.warning('Selecione um programa');
      return;
    }

    setLoading(true);
    try {
      // Busca espelho existente ou cria um novo
      let espelhoData = await espelhoService.getByDateAndProgram(selectedDate, selectedProgram);

      const programa = programas.find(p => p.id === selectedProgram);

      if (!espelhoData) {
        // Cria novo espelho vazio
        espelhoData = await espelhoService.create({
          programa_id: selectedProgram,
          data_exibicao: selectedDate,
          horario_previsto: '20:00:00',
          editor_responsavel: '',
          apresentadores: '',
          modo: 'vivo',
          status: 'rascunho'
        });

        // Recarrega com os dados completos incluindo blocos
        espelhoData = await espelhoService.getById(espelhoData.id);
        message.success('Novo espelho criado!');
      } else {
        message.success('Espelho carregado!');
      }

      const newTabKey = `${espelhoData.id}`;
      const tabLabel = `${programa?.nome || 'Programa'} - ${selectedDate}`;

      // Converte dados do Supabase para formato do componente
      const formattedData = {
        id: espelhoData.id,
        date: espelhoData.data_exibicao,
        program: espelhoData.programas?.nome || programa?.nome,
        programId: espelhoData.programa_id,
        editor: espelhoData.editor_responsavel || '',
        presenters: espelhoData.apresentadores || '',
        mode: espelhoData.modo || 'vivo',
        status: espelhoData.status,
        blocos: espelhoData.blocos?.map(bloco => ({
          id: bloco.id,
          titulo: bloco.titulo,
          duracao: espelhoService.secondsToHMS(bloco.duracao_prevista || 0),
          items: bloco.rundown_items?.map(item => ({
            id: item.id,
            type: item.tipo,
            titulo: item.titulo,
            detalhes: item.detalhes,
            talento: item.talento,
            reporter: item.reporter,
            editor: item.editor_video,
            origem: item.origem,
            duracao: espelhoService.secondsToHMS(item.duracao_prevista || 0),
            status: item.status === 'aprovado' ? 'Aprovado' :
                    item.status === 'produzindo' ? 'Produzindo' : 'Aguardando'
          })) || []
        })) || []
      };

      const newTab = {
        key: newTabKey,
        label: tabLabel,
        loaded: true
      };

      setTabs([...tabs.filter(t => t.key !== 'new'), newTab, { key: 'new', label: 'Novo Espelho', loaded: false }]);
      setLoadedEspelhos({ ...loadedEspelhos, [newTabKey]: formattedData });
      setActiveTab(newTabKey);

      // Reset form
      setSelectedProgram('');
    } catch (err) {
      console.error('Erro ao carregar espelho:', err);
      message.error('Erro ao carregar espelho: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTab = (targetKey) => {
    const newTabs = tabs.filter(t => t.key !== targetKey);
    setTabs(newTabs);

    if (activeTab === targetKey) {
      setActiveTab(newTabs[newTabs.length - 1]?.key || 'new');
    }

    // Remove loaded data
    const newLoaded = { ...loadedEspelhos };
    delete newLoaded[targetKey];
    setLoadedEspelhos(newLoaded);
  };

  const currentTabData = tabs.find(t => t.key === activeTab);
  const isLoaded = currentTabData?.loaded;
  const espelhoData = loadedEspelhos[activeTab];

  return (
    <div className="h-screen flex overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopInfoBar />

      {/* Header com Breadcrumb */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a href="#" className="hover:text-primary transition-colors">Home</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-slate-900 font-medium">Espelhos</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors relative">
            <BellOutlined className="text-[18px]" />
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 pt-2 shrink-0 shadow-sm">
        <Tabs
          type="editable-card"
          activeKey={activeTab}
          onChange={setActiveTab}
          onEdit={(targetKey, action) => {
            if (action === 'remove') handleCloseTab(targetKey);
          }}
          hideAdd
          items={tabs.map(tab => ({
            key: tab.key,
            label: tab.label,
            closable: tab.key !== 'new'
          }))}
          className="espelho-tabs"
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-100/50 relative">

          {/* Form Header - SEMPRE VISÍVEL */}
          <div className="bg-white border-b border-gray-200 shrink-0 z-20 shadow-sm">
            <div className="px-6 py-4 flex flex-col gap-4">

              {/* Linha Principal */}
              <div className="flex items-end justify-between gap-4">
                {/* Esquerda: Data + Programa + Carregar */}
                <div className="flex items-end gap-4">
                  {/* Data */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                      Data de Exibição
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      disabled={isLoaded}
                      className="h-10 px-3 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Programa */}
                  <div className="w-64">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                      Programa {programas.length > 0 && `(${programas.length})`}
                    </label>
                    <select
                      value={selectedProgram}
                      onChange={(e) => {
                        console.log('📝 Programa selecionado:', e.target.value);
                        setSelectedProgram(e.target.value);
                      }}
                      disabled={isLoaded}
                      className="h-10 w-full px-3 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Selecione...</option>
                      {programas.map(programa => {
                        console.log('🔹 Renderizando opção:', programa.nome, programa.id);
                        return (
                          <option key={programa.id} value={programa.id}>
                            {programa.nome}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Botão Carregar */}
                  {!isLoaded && (
                    <button
                      onClick={handleLoadEspelho}
                      disabled={loading || !selectedProgram}
                      className="h-10 flex items-center gap-2 px-6 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-hover shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <LoadingOutlined /> : <PlayCircleOutlined />}
                      {loading ? 'Carregando...' : 'Carregar Espelho'}
                    </button>
                  )}
                </div>

                {/* Direita: Ações Principais */}
                {isLoaded && (
                  <div className="flex items-center gap-2">
                    <button className="h-10 px-4 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <PlusOutlined /> Adicionar Bloco
                    </button>
                    <button className="h-10 px-4 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2">
                      <CheckOutlined /> Aprovar Espelho
                    </button>
                    <button className="h-10 px-4 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <PrinterOutlined /> Imprimir
                    </button>
                  </div>
                )}
              </div>

              {/* Linha Secundária - Só aparece quando carregado */}
              {isLoaded && espelhoData && (
                <div className="flex items-center gap-6 pt-2 border-t border-slate-200">
                  {/* Editor Responsável */}
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                      Editor Responsável
                    </label>
                    <div className="relative">
                      <UserOutlined className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                      <input
                        type="text"
                        defaultValue={espelhoData.editor}
                        className="w-full h-9 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg focus:ring-primary focus:border-primary pl-8 px-2"
                      />
                    </div>
                  </div>

                  {/* Apresentadores */}
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                      Apresentador(es)
                    </label>
                    <div className="relative">
                      <TeamOutlined className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                      <input
                        type="text"
                        defaultValue={espelhoData.presenters}
                        className="w-full h-9 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg focus:ring-primary focus:border-primary pl-8 px-2"
                      />
                    </div>
                  </div>

                  {/* Ao Vivo / Gravado */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                      Modo
                    </label>
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                      <button className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${espelhoData.mode === 'gravado' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-500'}`}>
                        GRAV
                      </button>
                      <button className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 ${espelhoData.mode === 'vivo' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-500'}`}>
                        <span className="size-1.5 bg-white rounded-full animate-pulse"></span> VIVO
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Timing Bar - Só aparece quando carregado */}
            {isLoaded && <TimingBar />}
          </div>

          {/* Área de Conteúdo - Só aparece quando carregado */}
          {isLoaded && espelhoData ? (
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 scroll-smooth">
              {/* Header da Grid */}
              <div className="hidden md:grid rundown-grid gap-2 px-4 py-2 mb-2 bg-slate-200/50 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider items-center sticky top-0 z-10 backdrop-blur-sm">
                <div className="text-center">#</div>
                <div className="text-center">Ord</div>
                <div>Tipo</div>
                <div>Slug / Detalhes</div>
                <div className="hide-compact">Talento</div>
                <div className="hide-compact">Repórter</div>
                <div className="hide-compact">Ed. Vídeo</div>
                <div>Origem</div>
                <div className="text-right">Duração</div>
                <div className="text-center">Status</div>
              </div>

              {/* Blocos */}
              {espelhoData.blocos.map((bloco, idx) => (
                <BlocoCard key={idx} bloco={bloco} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-5xl text-primary">view_timeline</span>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum espelho carregado</h3>
                <p className="text-slate-500 mb-6">
                  Selecione uma data e programa acima e clique em "Carregar Espelho" para começar.
                </p>
              </div>
            </div>
          )}

          {/* Bottom Drawer - Só aparece quando carregado */}
          {isLoaded && <BottomDrawer />}
        </div>

        {/* Sidebar Direita - Só aparece quando carregado */}
        {isLoaded && <CommentsSidebar />}
      </div>
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTES
// ============================================

const BlocoCard = ({ bloco }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-6 overflow-hidden">
      {/* Header do Bloco */}
      <div
        className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm transition-colors">
            <PlayCircleOutlined className="text-[14px]" /> Start
          </button>
          {expanded ? (
            <DownOutlined className="text-slate-400 group-hover:text-slate-600 text-[14px]" />
          ) : (
            <UpOutlined className="text-slate-400 group-hover:text-slate-600 text-[14px]" />
          )}
          <span className="font-bold text-slate-700">{bloco.titulo}</span>
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium">{bloco.duracao}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-medium uppercase mr-2">{bloco.items.length} itens</span>
          <button className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600">
            <MoreOutlined className="text-[18px]" />
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {/* Toolbar de Adicionar */}
          <div className="px-4 py-2 border-b border-slate-100 bg-white flex items-center gap-4 shadow-sm">
            <span className="text-sm font-bold text-slate-700 uppercase">Adicionar:</span>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium bg-white">
                <FileTextOutlined className="text-blue-500 text-[18px]" /> Matéria
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium bg-white">
                <VideoCameraOutlined className="text-red-500 text-[18px]" /> Vivo
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium bg-white">
                <FileTextOutlined className="text-orange-500 text-[18px]" /> Nota
              </button>
              <div className="w-px h-6 bg-slate-200"></div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium bg-slate-100">
                <CoffeeOutlined className="text-slate-700 text-[18px]" /> Intervalo
              </button>
            </div>
          </div>

          {/* Items do Bloco */}
          <div className="p-2 flex flex-col gap-1 bg-slate-50/30">
            {bloco.items.map((item, idx) => (
              <RundownItem key={idx} item={item} index={idx + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const RundownItem = ({ item, index }) => {
  const borderColor = item.type === 'REP' ? 'border-l-blue-500' :
                      item.type === 'VIVO' ? 'border-l-red-500' :
                      item.type === 'NOTA' ? 'border-l-yellow-400' : '';

  const isBreak = item.type === 'BREAK';

  if (isBreak) {
    return (
      <div className="group relative rundown-grid gap-2 items-center bg-gray-100 border border-gray-300 border-dashed p-1 rounded-md shadow-inner opacity-80">
        <div className="flex items-center justify-center h-full">
          <DragOutlined className="text-slate-400 text-[20px]" />
        </div>
        <div className="text-center text-xs font-mono text-slate-400 font-medium">{index}</div>
        <div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px] font-bold border border-gray-300 uppercase">
            BREAK
          </span>
        </div>
        <div className="flex flex-col min-w-0 pr-2">
          <span className="font-semibold text-gray-600 text-sm italic">{item.titulo}</span>
        </div>
        <div className="col-span-4 hide-compact"></div>
        <div className="text-right col-span-2 md:col-span-1">
          <span className="font-mono text-sm font-bold text-gray-600 bg-gray-200 px-1 rounded">{item.duracao}</span>
        </div>
        <div className="flex justify-center">
          <button className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 text-slate-600 border border-slate-300 text-[10px] font-bold uppercase">
            Pausa <DownOutlined className="text-[14px]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative rundown-grid gap-2 items-center bg-white ${borderColor ? `border-l-4 ${borderColor}` : ''} border-y border-r border-slate-200 p-2 ${borderColor ? 'rounded-r-md' : 'rounded-md'} shadow-sm hover:border-primary/50 hover:shadow-md transition-all active:scale-[0.995]`}>
      <div className="flex items-center justify-center h-full">
        <DragOutlined className="text-slate-300 group-hover:text-slate-500 text-[20px] cursor-grab" />
      </div>
      <div className="text-center text-xs font-mono text-slate-400 font-medium">{index}</div>
      <div>
        <ItemTypeBadge type={item.type} />
      </div>
      <div className="flex flex-col min-w-0 pr-2">
        <span className="font-semibold text-slate-800 text-sm truncate">{item.titulo}</span>
        {item.detalhes && (
          <div className="text-[10px] text-slate-500 truncate">{item.detalhes}</div>
        )}
      </div>
      <div className="flex items-center gap-2 overflow-hidden hide-compact">
        <div className="size-5 rounded-full bg-slate-200 shrink-0"></div>
        <span className="text-xs text-slate-600 truncate">{item.talento || '-'}</span>
      </div>
      <div className="text-xs text-slate-600 truncate hide-compact">{item.reporter || '-'}</div>
      <div className="text-xs text-slate-600 truncate hide-compact">{item.editor || '-'}</div>
      <div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 rounded border border-slate-200">{item.origem}</span>
      </div>
      <div className="text-right">
        <span className="font-mono text-sm font-medium text-slate-800">{item.duracao}</span>
      </div>
      <div className="flex justify-center">
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
};

const ItemTypeBadge = ({ type }) => {
  const configs = {
    VT: { color: 'blue', icon: 'movie', label: 'VT' },
    REP: { color: 'indigo', icon: 'article', label: 'REP' },
    VIVO: { color: 'red', icon: 'live_tv', label: 'VIVO' },
    NOTA: { color: 'yellow', icon: 'description', label: 'NOTA' }
  };

  const config = configs[type] || configs.VT;

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-${config.color}-50 text-${config.color}-700 text-[10px] font-bold border border-${config.color}-100 uppercase`}>
      <span className="material-symbols-outlined text-[12px]">{config.icon}</span> {config.label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const configs = {
    'Aprovado': { color: 'green', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'Produzindo': { color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Aguardando': { color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
  };

  const config = configs[status] || configs['Aguardando'];

  return (
    <button className={`flex items-center gap-1 px-2 py-0.5 rounded ${config.bg} ${config.text} border ${config.border} text-[10px] font-bold uppercase hover:opacity-80 transition-colors`}>
      {status} <DownOutlined className="text-[14px]" />
    </button>
  );
};

const BottomDrawer = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-white border-t border-slate-300 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] z-30 flex flex-col transition-all ${isOpen ? 'max-h-[250px]' : 'max-h-[32px]'}`}>
      <div className="h-8 bg-slate-100 flex items-center justify-between px-4 cursor-pointer border-b border-slate-200" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">assignment</span>
          <span className="text-xs font-bold text-slate-700 uppercase">Reportagens do Dia (Drag &amp; Drop)</span>
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 rounded-full">2</span>
        </div>
        {isOpen ? (
          <DownOutlined className="text-slate-400" />
        ) : (
          <UpOutlined className="text-slate-400" />
        )}
      </div>
      {isOpen && (
        <div className="p-3 overflow-y-auto bg-slate-50 flex-1">
          <div className="text-sm text-slate-500 text-center py-8">
            Arraste reportagens disponíveis aqui para adicionar aos blocos
          </div>
        </div>
      )}
    </div>
  );
};

const CommentsSidebar = () => (
  <aside className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 z-10 hidden xl:flex">
    <div className="p-4 border-b border-gray-100 bg-white">
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-primary">chat</span>
        Comentários da Produção
      </h3>
    </div>

    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50">
      <div className="text-sm text-slate-400 text-center py-8">
        Nenhum comentário ainda
      </div>
    </div>

    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="relative">
        <input
          className="w-full pl-4 pr-10 py-2.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          placeholder="Digite uma observação..."
          type="text"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10 rounded-full p-1 transition-colors">
          <SendOutlined className="text-[20px]" />
        </button>
      </div>
    </div>
  </aside>
);

// ============================================
// ESTILOS CSS
// ============================================
const styles = `
.rundown-grid {
  display: grid;
  grid-template-columns: 32px 32px 60px 1fr 90px 90px 90px 70px 80px 110px;
  gap: 0.5rem;
  align-items: center;
}
@media (max-width: 1400px) {
  .rundown-grid {
    grid-template-columns: 32px 32px 60px 1fr 80px 80px 70px 110px;
  }
  .hide-compact {
    display: none;
  }
}

.espelho-tabs .ant-tabs-nav {
  margin-bottom: 0 !important;
}

.espelho-tabs .ant-tabs-tab {
  padding: 8px 12px !important;
  font-size: 13px !important;
}
`;

// Injetar estilos
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default EspelhoPage;
