import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Space, Modal, message, Avatar, Tooltip, Select } from 'antd';
import { 
  PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, 
  CheckCircleOutlined, HistoryOutlined, MessageOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { pautaService } from '../../services/pautaService';

const PautasListPage = () => {
  const [pautas, setPautas] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadPautas();
  }, []);

  const loadPautas = () => {
    setPautas(pautaService.getAll());
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Excluir Pauta',
      content: 'Tem certeza que deseja mover esta pauta para a lixeira?',
      okText: 'Sim, Excluir',
      okType: 'danger',
      onOk: () => {
        pautaService.delete(id);
        message.success('Pauta excluída com sucesso');
        loadPautas();
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
          <span className="font-bold text-slate-800 hover:text-[#7f13ec] cursor-pointer" 
                onClick={() => navigate(`/pautas/editar/${record.id}`)}>
            {text}
          </span>
          <Space className="mt-1">
            <Tag className="text-[10px] uppercase font-bold">{record.editoria}</Tag>
            {record.prioridade === 'high' && <Tag color="error" className="text-[10px] font-bold">URGENTE</Tag>}
          </Space>
        </div>
      ),
    },
    {
      title: 'Jornalista',
      dataIndex: 'jornalista',
      key: 'jornalista',
      render: (name) => (
        <Space>
          <Avatar size="small" src={`https://i.pravatar.cc/150?u=${name}`} />
          <span className="text-sm">{name}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusMap[status]?.color} className="font-medium">
          {statusMap[status]?.label}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
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
    },
  ];

  return (
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
        dataSource={pautas.filter(p => p.titulo.toLowerCase().includes(searchText.toLowerCase()))} 
        rowKey="id"
        className="shadow-sm border border-gray-200 rounded-b-lg overflow-hidden"
      />
    </div>
  );
};

export default PautasListPage;