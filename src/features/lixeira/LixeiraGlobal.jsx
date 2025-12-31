import React, { useState, useEffect } from 'react';
import { 
  Table, Tabs, Button, Input, Select, Space, 
  Avatar, Modal, message, Badge, Tooltip, Typography, Tag, Breadcrumb
} from 'antd';
import { 
  FileTextOutlined, 
  FileDoneOutlined, 
  UnorderedListOutlined, 
  TeamOutlined,
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
  ClearOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/shared/MainLayout';
import { trashService } from './trashService';

const { Title, Text } = Typography;

const LixeiraGlobal = () => {
  const [activeTab, setActiveTab] = useState('pautas');
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Sync data on tab change
  useEffect(() => {
    fetchTrashData();
  }, [activeTab]);

  const fetchTrashData = async () => {
    setLoading(true);
    try {
      const data = await trashService.getTrashByType(activeTab);
      setDataSource(data || []);
    } catch (err) {
      message.error('Erro ao carregar itens removidos');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (id) => {
    trashService.restoreItem(id);
    message.success('Item restaurado com sucesso!');
    fetchTrashData();
  };

  const handleEmptyTrash = () => {
    Modal.confirm({
      title: 'Esvaziar Lixeira',
      content: 'Tem certeza? Todos os itens de todas as categorias serão apagados permanentemente.',
      okText: 'Esvaziar',
      okType: 'danger',
      onOk: () => {
        trashService.emptyTrash();
        message.success('Lixeira limpa.');
        fetchTrashData();
      }
    });
  };

  const columns = [
    {
      title: 'Título da Pauta',
      dataIndex: 'titulo',
      key: 'titulo',
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800 line-clamp-1">{text || record.nome || 'Sem título'}</span>
          <span className="text-[11px] text-gray-400 mt-0.5">Criado em: {record.createdAt || 'N/D'}</span>
        </div>
      ),
      width: 400,
    },
    {
      title: 'Categoria',
      dataIndex: 'categoria',
      key: 'categoria',
      render: (text) => {
        let color = 'default';
        if (text === 'Política Local') color = 'green';
        if (text === 'Cultura') color = 'purple';
        if (text === 'Urgente') color = 'red';
        if (text === 'Interno') color = 'blue';

        return (
          <Tag color={color} className="rounded-full px-3 text-[11px] font-medium border-none">
            {text || 'Geral'}
          </Tag>
        );
      },
      width: 150,
    },
    {
      title: 'Removido por',
      dataIndex: 'deletedBy',
      key: 'deletedBy',
      render: (name) => (
        <Space>
          <Avatar 
            size={24} 
            className="bg-gray-200 text-gray-600 text-[10px] font-bold"
          >
            {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'LX'}
          </Avatar>
          <span className="text-sm text-slate-600">{name || 'Sistema'}</span>
        </Space>
      ),
      width: 200,
    },
    {
      title: 'Data da Remoção',
      dataIndex: 'deletedAt',
      key: 'deletedAt',
      render: (date) => <span className="text-xs text-gray-500">{date}</span>,
      width: 180,
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Tooltip title="Restaurar Item">
          <Button 
            type="text" 
            className="text-primary hover:bg-primary/5 flex items-center justify-center" 
            icon={<span className="material-symbols-outlined text-[20px]">restore_page</span>} 
            onClick={() => handleRestore(record.id)} 
          />
        </Tooltip>
      ),
      width: 100,
      fixed: 'right',
    },
  ];

  const tabItems = [
    { 
      key: 'pautas', 
      label: (
        <Space>
          <span className="material-symbols-outlined text-[18px]">event_note</span>
          <span>Pautas</span>
          <Badge count={activeTab === 'pautas' ? dataSource.length : 0} size="small" offset={[5, 0]} overflowCount={99} />
        </Space>
      )
    },
    { 
      key: 'reportagens', 
      label: (
        <Space>
          <span className="material-symbols-outlined text-[18px]">article</span>
          <span>Reportagens</span>
        </Space>
      ) 
    },
    { 
      key: 'espelhos', 
      label: (
        <Space>
          <span className="material-symbols-outlined text-[18px]">view_list</span>
          <span>Espelhos</span>
        </Space>
      ) 
    },
    { 
      key: 'contatos', 
      label: (
        <Space>
          <span className="material-symbols-outlined text-[18px]">contacts</span>
          <span>Contatos</span>
        </Space>
      ) 
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-[#f0f2f5]">
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm mb-6 -mx-8 -mt-8">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2.5 rounded-lg text-primary hidden sm:flex">
                  <span className="material-symbols-outlined text-[28px]">delete_sweep</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Lixeira Global</h1>
                  <p className="text-gray-500 text-sm mt-0.5">Visualize e restaure itens removidos do sistema organizados por categoria. Itens mantidos por 30 dias.</p>
                </div>
              </div>
              <Button 
                danger 
                ghost
                icon={<span className="material-symbols-outlined text-[18px] mr-1">delete_forever</span>} 
                onClick={handleEmptyTrash}
                className="h-10 px-4 rounded-lg flex items-center font-medium border-red-200 hover:bg-red-50"
              >
                Esvaziar Lixeira
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto w-full flex flex-col px-0">
          {/* Tabs Container */}
          <div className="bg-white rounded-t-lg border-b border-gray-200 px-2 pt-2 shadow-sm">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              items={tabItems}
              className="custom-tabs-lixeira"
            />
          </div>

          {/* Table & Filters Container */}
          <div className="bg-white rounded-b-lg shadow-sm border border-t-0 border-gray-200 overflow-hidden flex flex-col">
            {/* Filters Bar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between">
                <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto flex-1">
                  <Input 
                    placeholder={`Buscar ${activeTab} removidas...`}
                    prefix={<SearchOutlined className="text-gray-400" />} 
                    className="md:w-72 h-10 rounded-lg shadow-sm"
                    onChange={e => setSearchText(e.target.value)}
                  />
                  <Select 
                    defaultValue="all" 
                    className="md:w-48 h-10 shadow-sm"
                    suffixIcon={<span className="material-symbols-outlined text-gray-400 text-[18px]">arrow_drop_down</span>}
                  >
                    <Select.Option value="all">Todos os usuários</Select.Option>
                    <Select.Option value="ricardo">Ricardo Mendes</Select.Option>
                  </Select>
                  <Select 
                    defaultValue="any" 
                    className="md:w-48 h-10 shadow-sm"
                    suffixIcon={<span className="material-symbols-outlined text-gray-400 text-[18px]">calendar_today</span>}
                  >
                    <Select.Option value="any">Qualquer data</Select.Option>
                    <Select.Option value="today">Hoje</Select.Option>
                    <Select.Option value="week">Últimos 7 dias</Select.Option>
                    <Select.Option value="month">Últimos 30 dias</Select.Option>
                  </Select>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                  {selectedRowKeys.length > 0 && (
                    <Tag color="purple" className="flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary border-primary/20 rounded-full h-8">
                      <span className="font-bold">{selectedRowKeys.length}</span> selecionados
                    </Tag>
                  )}
                  <Button 
                    type="primary" 
                    disabled={selectedRowKeys.length === 0}
                    className="h-10 px-4 bg-primary hover:bg-primary-hover border-none rounded-lg shadow-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-white text-[18px]">restore_from_trash</span>
                    Restaurar
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Table */}
            <Table 
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              columns={columns} 
              dataSource={dataSource.filter(item => (item.titulo || item.nome || '').toLowerCase().includes(searchText.toLowerCase()))} 
              rowKey="id"
              loading={loading}
              pagination={{ 
                pageSize: 10,
                showTotal: (total, range) => `Mostrando ${range[0]} até ${range[1]} de ${total} itens`,
                className: "px-6 py-4 border-t border-gray-50 bg-gray-50/50 m-0"
              }}
              className="lixeira-table"
              scroll={{ x: 1000 }}
            />
          </div>
          
          <div className="text-center py-8 mt-4">
            <Text type="secondary" className="text-[11px] block opacity-60">
              Sistema de Gestão de Informação - Eco TV © 2024 <br/>
              Versão 2.4.0
            </Text>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LixeiraGlobal;