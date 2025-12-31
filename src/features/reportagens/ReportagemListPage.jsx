import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Space, Avatar, Tooltip, Select, Card, Popover, Badge, message } from 'antd';
import { 
  PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, 
  HistoryOutlined, LinkOutlined, VideoCameraOutlined, 
  MessageOutlined, FilterOutlined, DeleteFilled 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/shared/MainLayout';
import { reportagemService } from './reportagem.service';

const ReportagemListPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await reportagemService.getAll();
      setData(result);
    } catch (err) {
      console.error(err);
      message.error('Erro ao carregar reportagens');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    aprovado: { color: 'green', label: 'Aprovado' },
    revisao: { color: 'orange', label: 'Para Aprovação' },
    redacao: { color: 'blue', label: 'Em Redação' },
    exibicao: { color: 'cyan', label: 'Em Exibição' },
    rejeitado: { color: 'red', label: 'Rejeitado' },
  };

  const columns = [
    {
      title: 'Reportagem (Detalhes)',
      key: 'detalhes',
      render: (_, record) => (
        <div className="flex flex-col max-w-sm">
          <span className="font-bold text-slate-800 hover:text-primary cursor-pointer leading-snug"
                onClick={() => navigate(`/producao/reportagens/editar/${record.id}`)}>
            {record.titulo}
          </span>
          <span className="text-xs text-gray-500 mt-1 line-clamp-1">{record.lead}</span>
          <Space className="mt-2 text-gray-400" size={12}>
            <span className="text-[10px] font-bold bg-gray-100 px-1 rounded flex items-center gap-1">
              <LinkOutlined /> {record.pauta_id || 'SEM PAUTA'}
            </span>
            <VideoCameraOutlined className="text-sm" />
            <Popover content={<div>{record.ultimo_comentario || 'Sem comentários'}</div>} title="Comentário Rápido">
              <MessageOutlined className="text-sm hover:text-primary cursor-pointer" />
            </Popover>
            <span className="text-[10px] font-medium uppercase">{record.version || 'V1'}</span>
          </Space>
        </div>
      ),
      width: 400,
    },
    {
      title: 'Programa',
      dataIndex: 'programa',
      render: (prog) => <Tag color="purple" className="border-purple-200 bg-purple-50 text-primary font-medium">{prog}</Tag>,
    },
    {
      title: 'Repórter',
      dataIndex: 'reporter',
      render: (name) => (
        <Space>
          <Avatar size="small" src={`https://ui-avatars.com/api/?name=${name}&background=random`} />
          <span className="text-sm">{name}</span>
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={statusConfig[status]?.color || 'default'} className="rounded-full px-3">
          <Badge status={statusConfig[status]?.color} /> {statusConfig[status]?.label || 'Rascunho'}
        </Tag>
      ),
    },
    {
      title: 'Atualizado',
      dataIndex: 'updatedAt',
      render: (date) => <span className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</span>,
    },
    {
      title: 'Ações',
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Editar"><Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/producao/reportagens/editar/${record.id}`)} /></Tooltip>
          <Tooltip title="Lixeira"><Button type="text" danger icon={<DeleteOutlined />} onClick={async () => {
            try {
              await reportagemService.delete(record.id);
              message.success('Movido para lixeira');
              loadData();
            } catch (err) {
              message.error('Erro ao excluir reportagem');
            }
          }} /></Tooltip>
        </Space>
      ),
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Reportagens</h1>
            <p className="text-slate-500">Gerencie o fluxo editorial, aprovações e conteúdos jornalísticos.</p>
          </div>
          <Button type="primary" size="large" icon={<PlusOutlined />} className="bg-primary h-12 px-8" onClick={() => navigate('/producao/reportagens/nova')}>
            Nova Reportagem
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Reportagens" value="142" trend="+12%" icon="article" />
          <StatCard title="Em Redação" value="18" icon="edit_note" color="text-blue-500" />
          <StatCard title="Para Aprovação" value="7" badge="Ação necess." color="text-amber-500" />
          <StatCard title="Publicadas Hoje" value="24" icon="check_circle" color="text-green-500" />
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
          <Input prefix={<SearchOutlined />} placeholder="Pesquisar por título, lead ou repórter..." className="lg:w-96 rounded-lg" />
          <Space wrap>
            <Select defaultValue="all" className="w-44" options={[{value: 'all', label: 'Todos Programas'}]} />
            <Select defaultValue="all" className="w-44" options={[{value: 'all', label: 'Estado: Todos'}]} />
            <Button icon={<FilterOutlined />} />
          </Space>
        </div>

        {/* Main Table */}
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          loading={loading}
          className="shadow-sm border border-gray-200 rounded-xl overflow-hidden"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </MainLayout>
  );
};

const StatCard = ({ title, value, trend, badge, icon, color = "text-slate-900" }) => (
  <Card className="rounded-xl shadow-sm border-gray-100">
    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]">{icon}</span> {title}
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      {trend && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{trend}</span>}
      {badge && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{badge}</span>}
    </div>
  </Card>
);

export default ReportagemListPage;