import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Space, Modal, message, Avatar, Tooltip, Select } from 'antd';
import { 
  PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, 
  CheckCircleOutlined, HistoryOutlined, MessageOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { pautaService } from './pauta.service';
import MainLayout from '@/components/shared/MainLayout';

const PautasListPage = () => {
  const [pautas, setPautas] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPautas();
  }, []);

  const loadPautas = async () => {
    setLoading(true);
    try {
      const data = await pautaService.getAll();
      setPautas(data);
    } catch (err) {
      message.error('Erro ao carregar pautas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Excluir Pauta',
      content: 'Tem certeza que deseja mover esta pauta para a lixeira?',
      okText: 'Sim, Excluir',
      okType: 'danger',
      onOk: async () => {
        try {
          await pautaService.delete(id);
          message.success('Pauta excluída com sucesso');
          loadPautas();
        } catch (err) {
          message.error('Erro ao excluir pauta');
        }
      }
    });
  };

  const statusMap = {
    rascunho: { color: 'default', label: 'Rascunho' },
    producao: { color: 'blue', label: 'Em Produção' },
    aguardando: { color: 'orange', label: 'Aguardando Aprovação' },
    aprovado: { color: 'green', label: 'Aprovado' },
  };

  const columns = [
    {
      title: 'Título da Pauta',
      dataIndex: 'titulo',
      key: 'titulo',
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 hover:text-[#7f13ec] cursor-pointer truncate max-w-[300px]" 
                onClick={() => navigate(`/pautas/editar/${record.id}`)}>
            {text}
          </span>
          <div className="mt-1">
            {record.prioridade === 'high' && <Tag color="error" className="text-[9px] font-bold">URGENTE</Tag>}
          </div>
        </div>
      ),
      width: 350,
      fixed: 'left',
    },
    {
      title: 'Editoria',
      dataIndex: 'editoria',
      key: 'editoria',
      render: (text) => <Tag className="text-[11px] font-medium px-2 py-0 border-primary/20 bg-primary/5 text-primary">{text}</Tag>,
      width: 150,
    },
    {
      title: 'Local / Referência',
      dataIndex: 'localizacao_texto',
      key: 'localizacao_texto',
      render: (text) => (
        <Space className="text-gray-500 text-xs">
          <EnvironmentOutlined className="text-primary opacity-60" />
          <span className="truncate max-w-[150px]">{text || 'N/D'}</span>
        </Space>
      ),
      width: 200,
    },
    {
      title: 'Jornalista',
      dataIndex: 'jornalista',
      key: 'jornalista',
      render: (name) => (
        <Space>
          <Avatar size="small" src={`https://ui-avatars.com/api/?name=${name || '?'}&background=random`} />
          <span className="text-sm whitespace-nowrap">{name || 'Não atribuído'}</span>
        </Space>
      ),
      width: 180,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusMap[status]?.color} className="font-medium px-3 rounded-full">
          {statusMap[status]?.label}
        </Tag>
      ),
      width: 150,
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/pautas/editar/${record.id}`)} />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
      width: 120,
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Pautas</h2>
            <p className="text-gray-500">Gerencie o fluxo de produção jornalística.</p>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/pautas/nova')}
            className="bg-[#7f13ec] hover:!bg-[#5e0eb0]"
          >
            Nova Pauta
          </Button>
        </div>

        <div className="bg-white p-4 rounded-t-lg border border-b-0 border-gray-200 flex justify-between items-center">
          <Input 
            placeholder="Pesquisar pautas..." 
            prefix={<SearchOutlined />} 
            style={{ width: 300 }}
            onChange={e => setSearchText(e.target.value)}
          />
          <Space>
            <Button icon={<HistoryOutlined />}>Histórico</Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={pautas.filter(p => (p.titulo || '').toLowerCase().includes(searchText.toLowerCase()))} 
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          className="shadow-sm border border-gray-200 rounded-b-lg overflow-hidden"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </div>
    </MainLayout>
  );
};

export default PautasListPage;