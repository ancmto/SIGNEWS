import React, { useEffect, useState } from 'react';
import { 
  Form, Input, Button, Select, DatePicker, Row, Col, Card, Space, 
  message, Typography, Divider, Badge, Avatar, Modal, AutoComplete,
  Steps, Timeline
} from 'antd';
import { 
  SaveOutlined, ArrowLeftOutlined, SendOutlined, UserOutlined, 
  TeamOutlined, MessageOutlined, EnvironmentOutlined, 
  CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { pautaService } from './pauta.service';
import { contactsService } from '@/features/contacts/contacts.service';
import MainLayout from '@/components/shared/MainLayout';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PautaFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEdit = !!id;
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [coverageConfig, setCoverageConfig] = useState(null);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        // Load settings and contacts
        const [contactsData, config] = await Promise.all([
          contactsService.getContacts(),
          pautaService.getAppSettings('coverage_country')
        ]);
        
        setAllContacts(contactsData || []);
        setCoverageConfig(config);

        if (isEdit) {
          const pauta = await pautaService.getById(id);
          if (pauta) {
            form.setFieldsValue({
              ...pauta,
              dataVeiculacao: pauta.dataVeiculacao ? dayjs(pauta.dataVeiculacao) : null,
              contatosNodes: pauta.contatosNodes || []
            });
            setComments(pauta.comments || []);
            
            // Map selected contacts objects
            const selected = contactsData.filter(c => pauta.contatosNodes?.includes(c.id));
            setSelectedContacts(selected);
          }
        } else {
          form.setFieldsValue({
            status: 'rascunho',
            prioridade: 'normal',
            dataVeiculacao: dayjs(),
            contatosNodes: []
          });
        }
      } catch (err) {
        message.error('Erro ao carregar dados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, isEdit, form]);

  const onFinish = async (values) => {
    setSaveLoading(true);
    try {
      const pautaData = {
        ...values,
        id: id || null,
        dataVeiculacao: values.dataVeiculacao ? values.dataVeiculacao.format('YYYY-MM-DD') : null,
        // Map any extra fields if needed
      };
      
      await pautaService.save(pautaData);
      message.success(isEdit ? 'Pauta atualizada!' : 'Pauta criada com sucesso!');
      navigate('/pautas');
    } catch (err) {
      message.error('Erro ao salvar pauta');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    if (!isEdit) {
      const tempComment = {
        id: Date.now(),
        user: 'Eu',
        text: newComment,
        date: new Date().toISOString()
      };
      setComments([tempComment, ...comments]);
      setNewComment('');
    } else {
      try {
        const commentObj = { user: 'Eu', text: newComment };
        const savedComment = await pautaService.addComment(id, commentObj);
        setComments([savedComment, ...comments]);
        setNewComment('');
        message.success('Comentário adicionado');
      } catch (err) {
        message.error('Erro ao adicionar comentário');
      }
    }
  };

  const handleSearchLocations = async (value) => {
    if (value.length > 2) {
      try {
        const results = await pautaService.getLocations(value);
        setLocations(results.map(l => ({ value: l.name, label: `${l.name} (${l.province})` })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleContactChange = (ids) => {
    const selected = allContacts.filter(c => ids.includes(c.id));
    setSelectedContacts(selected);
  };

  const removeContact = (cid) => {
    const currentIds = form.getFieldValue('contatosNodes') || [];
    const newIds = currentIds.filter(id => id !== cid);
    form.setFieldsValue({ contatosNodes: newIds });
    handleContactChange(newIds);
  };

  const disabledDate = (current) => {
    if (isEdit) return false;
    return current && current < dayjs().startOf('day');
  };

  return (
    <MainLayout>
      <div className="max-w-[1500px] mx-auto pb-10">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          
          {/* TOP ACTION BAR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sticky top-0 z-20 bg-[#f0f2f5]/90 backdrop-blur-sm py-4 border-b border-gray-200">
            <div className="mb-4 md:mb-0">
              <Space direction="vertical" size={1}>
                <Space>
                  <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/pautas')} className="hover:bg-gray-200" />
                  <Title level={3} style={{ margin: 0 }} className="text-slate-800">
                    {isEdit ? form.getFieldValue('titulo') : 'Nova Pauta Editorial'}
                  </Title>
                  {isEdit && <Badge count={`#${id.slice(0,4)}`} style={{ backgroundColor: '#f0f0f0', color: '#8c8c8c', boxShadow: 'none' }} />}
                </Space>
                <Text type="secondary">Zona de cobertura ativa: <Text strong className="text-primary">{coverageConfig?.name || 'Moçambique'}</Text></Text>
              </Space>
            </div>
            <Space size="middle">
              <Button onClick={() => navigate('/pautas')}>Cancelar</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saveLoading} size="large" className="bg-[#7f13ec] hover:!bg-[#5e0eb0] shadow-lg shadow-purple-200 h-11 px-8 rounded-md font-bold">
                {isEdit ? 'Salvar Alterações' : 'Criar Pauta'}
              </Button>
            </Space>
          </div>

          <Row gutter={24}>
            {/* MAIN CONTENT AREA */}
            <Col span={16}>
              <Space direction="vertical" size="large" className="w-full">
                
                {/* DADOS DA PAUTA CARD */}
                <Card className="shadow-sm border-gray-100 overflow-hidden" bodyStyle={{ padding: 24 }}>
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                  <Title level={5} className="mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">edit_document</span>
                    Informações Centrais
                  </Title>
                  
                  <Form.Item name="titulo" label="Título" rules={[{ required: true, message: 'Insira o título' }]}>
                    <Input placeholder="Título conciso para identificação rápida" size="large" className="rounded-md font-bold text-slate-800" />
                  </Form.Item>

                  <Form.Item name="descricao" label="Descrição Detalhada" rules={[{ required: true, message: 'Insira a descrição' }]}>
                    <TextArea rows={10} placeholder="Detalhamento da pauta, orientações para equipe externa e pontos chaves da matéria..." className="rounded-md" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item name="localizacaoTexto" label="Localização / Referência">
                        <AutoComplete
                          options={locations}
                          onSearch={handleSearchLocations}
                          placeholder="Ex: Maputo, Av. 24 de Julho..."
                        >
                          <Input prefix={<EnvironmentOutlined className="text-primary" />} size="large" />
                        </AutoComplete>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* EQUIPE DESIGNADA CARD - UPDATED LAYOUT */}
                <Card className="shadow-sm border-gray-100 overflow-hidden" bodyStyle={{ padding: 24 }}>
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-info"></div>
                   <Title level={5} className="mb-6 flex items-center gap-2">
                    <TeamOutlined className="text-info" />
                    Equipe Operacional
                  </Title>
                  
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item name="editor" label={<Text strong className="text-[11px] uppercase text-gray-400">Editor Responsável</Text>}>
                        <Select placeholder="Selecione..." size="large" className="w-full">
                          <Select.Option value="1">
                            <Space><Avatar size="small" src="https://i.pravatar.cc/150?u=1" /> Carlos Mendes</Space>
                          </Select.Option>
                          <Select.Option value="2">
                            <Space><Avatar size="small" src="https://i.pravatar.cc/150?u=2" /> Marta Silva</Space>
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="jornalista" label={<Text strong className="text-[11px] uppercase text-gray-400">Repórter / Jornalista</Text>}>
                        <Select placeholder="Selecione..." size="large">
                          <Select.Option value="Ana Souza">
                            <Space><Avatar size="small" src="https://i.pravatar.cc/150?u=ana" /> Ana Souza</Space>
                          </Select.Option>
                          <Select.Option value="Roberto Justus">
                            <Space><Avatar size="small" src="https://i.pravatar.cc/150?u=rob" /> Roberto Justus</Space>
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="camera" label={<Text strong className="text-[11px] uppercase text-gray-400">Técnico de Imagem</Text>}>
                        <Select placeholder="Selecione..." size="large">
                          <Select.Option value="Ricardo Zoom">
                            <Space><Avatar size="small" icon={<UserOutlined />} /> Ricardo Zoom</Space>
                          </Select.Option>
                          <Select.Option value="João Paulo">
                            <Space><Avatar size="small" icon={<UserOutlined />} /> João Paulo</Space>
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* CONTATOS ENVOLVIDOS CARD - UPDATED UI */}
                <Card className="shadow-sm border-gray-100" bodyStyle={{ padding: 24 }}>
                  <div className="flex justify-between items-center mb-6">
                    <Title level={5} style={{ margin: 0 }} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-success text-[20px]">contacts</span>
                      Fontes e Personagens
                    </Title>
                  </div>
                  
                  <Form.Item name="contatosNodes" label="Relacionar contatos do banco">
                    <Select
                      mode="multiple"
                      placeholder="Pesquisar contatos..."
                      size="large"
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      onChange={handleContactChange}
                      suffixIcon={<SearchOutlined />}
                    >
                      {allContacts.map(c => (
                        <Select.Option key={c.id} value={c.id}>
                          {c.name} - <Text type="secondary" size="small">{c.role}</Text>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {selectedContacts.map(c => (
                      <div key={c.id} className="relative group p-4 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-4 hover:border-success/30 transition-all">
                        <Avatar size={48} src={c.photo_url || `https://ui-avatars.com/api/?name=${c.name}&background=random`} className="shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <Paragraph strong className="m-0 truncate text-slate-800">{c.name}</Paragraph>
                          <Text type="secondary" className="block text-[11px] mb-2">{c.role} @ {c.institution}</Text>
                          <div className="flex flex-col gap-1">
                            <Text className="text-[11px] flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">call</span> {c.phone}</Text>
                            <Text className="text-[11px] flex items-center gap-1.5 truncate"><span className="material-symbols-outlined text-[14px]">mail</span> {c.email}</Text>
                          </div>
                        </div>
                        <Button 
                          type="text" 
                          icon={<DeleteOutlined />} 
                          danger 
                          className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 transition-all"
                          onClick={() => removeContact(c.id)}
                        />
                      </div>
                    ))}
                    {selectedContacts.length === 0 && (
                      <div className="md:col-span-2 py-8 border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-[32px] mb-2 opacity-30">contact_support</span>
                        <Text type="secondary">Nenhum contato selecionado ainda.</Text>
                      </div>
                    )}
                  </div>
                </Card>
              </Space>
            </Col>

            {/* SIDEBAR AREA */}
            <Col span={8}>
              <Space direction="vertical" size="large" className="w-full">
                
                {/* FLUXO DE APROVAÇÃO CARD */}
                <Card title={<Text strong className="text-[11px] uppercase tracking-wider text-gray-400">Fluxo de Ciclo de Vida</Text>} size="small" className="shadow-sm">
                  <div className="py-2 px-1">
                    <Timeline 
                      items={[
                        {
                          color: 'green',
                          children: (
                            <div>
                              <Text strong className="text-[12px]">Pauta Criada</Text>
                              <br />
                              <Text type="secondary" className="text-[11px]">Por Sistema - 09:00</Text>
                            </div>
                          ),
                          dot: <CheckCircleOutlined className="text-green-500" />
                        },
                        {
                          color: form.getFieldValue('status') === 'aprovado' ? 'green' : 'blue',
                          children: (
                            <div>
                              <Text strong className="text-[12px]">{form.getFieldValue('status') === 'aprovado' ? 'Aprovado' : 'Em Produção'}</Text>
                              <br />
                              <Text type="secondary" className="text-[11px]">Status atual no sistema</Text>
                            </div>
                          ),
                          dot: <ClockCircleOutlined className="text-primary animate-pulse" />
                        },
                        {
                          color: 'gray',
                          children: (
                            <Text className="text-[12px] text-gray-400">Transformar em Reportagem</Text>
                          ),
                        }
                      ]}
                    />
                  </div>
                </Card>

                {/* DETALHES TÉCNICOS CARD */}
                <Card title={<Text strong className="text-[11px] uppercase tracking-wider text-gray-400">Classificação e Prazos</Text>} size="small" className="shadow-sm">
                  <Form.Item name="status" label="Status Editorial" rules={[{ required: true }]}>
                    <Select className="w-full h-10">
                      <Select.Option value="rascunho">Rascunho</Select.Option>
                      <Select.Option value="producao">Em Produção</Select.Option>
                      <Select.Option value="aguardando">Aguardando Aprovação</Select.Option>
                      <Select.Option value="aprovado">Aprovado p/ Exibição</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="editoria" label="Editoria / Vertical" rules={[{ required: true }]}>
                    <Select placeholder="Selecione..." className="h-10">
                      <Select.Option value="Nacional">Nacional</Select.Option>
                      <Select.Option value="Economia">Economia</Select.Option>
                      <Select.Option value="Cultura">Cultura</Select.Option>
                      <Select.Option value="Sociedade">Sociedade / Local</Select.Option>
                      <Select.Option value="Desporto">Desporto</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="dataVeiculacao" label="Data de Veiculação" rules={[{ required: true }]}>
                    <DatePicker 
                      className="w-full h-10" 
                      format="DD/MM/YYYY" 
                      disabledDate={disabledDate}
                    />
                  </Form.Item>

                  <Form.Item name="prioridade" label="Nível de Prioridade">
                    <Select className="h-10">
                      <Select.Option value="low">Baixa</Select.Option>
                      <Select.Option value="normal">Normal</Select.Option>
                      <Select.Option value="high">Urgente / Lead</Select.Option>
                    </Select>
                  </Form.Item>
                </Card>

                {/* COMENTÁRIOS CARD */}
                <Card 
                  title={
                    <div className="flex items-center gap-2">
                       <span className="material-symbols-outlined text-[18px]">forum</span>
                      <Text strong className="text-[11px] uppercase tracking-wider text-gray-400">Comentários de Produção</Text>
                    </div>
                  } 
                  size="small" 
                  className="shadow-sm"
                >
                  <div className="max-h-[350px] overflow-y-auto mb-4 space-y-4 pr-1">
                    {comments.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-xs italic bg-gray-50 rounded border border-dashed border-gray-100">
                        Nenhuma instrução adicional.
                      </div>
                    ) : (
                      comments.map((c) => (
                        <div key={c.id} className="flex gap-2">
                          <Avatar size="small" src={`https://ui-avatars.com/api/?name=${c.user}&background=random`} />
                          <div className="flex-1 bg-gray-50 p-2 rounded-lg rounded-tl-none border border-gray-100 relative">
                            <div className="flex justify-between items-center mb-0.5">
                              <Text strong className="text-[11px] text-primary">{c.user}</Text>
                              <Text className="text-[9px] text-gray-400">{dayjs(c.date).format('HH:mm')}</Text>
                            </div>
                            <p className="m-0 text-[12px] text-slate-700 leading-tight">{c.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input 
                      placeholder="Instrução..." 
                      variant="filled"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onPressEnter={handleAddComment}
                    />
                    <Button 
                      type="primary" 
                      icon={<SendOutlined />} 
                      onClick={handleAddComment}
                      className="bg-[#7f13ec]"
                    />
                  </div>
                </Card>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>
    </MainLayout>
  );
};

export default PautaFormPage;