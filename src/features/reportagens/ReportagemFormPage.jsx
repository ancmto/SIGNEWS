import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, Card, Space, Divider, Steps, Badge, message } from 'antd';
import {
  SaveOutlined, SendOutlined, CloseOutlined,
  HistoryOutlined, FileTextOutlined, CustomerServiceOutlined,
  FolderOpenOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/shared/MainLayout';
import { reportagemService } from './reportagem.service';
import { pautaService } from '@/features/pautas/pauta.service';

const { TextArea } = Input;

const ReportagemFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pautas, setPautas] = useState([]);
  const isEdit = !!id;

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch pautas for link
      const pautasList = await pautaService.getAll();
      setPautas(pautasList.map(p => ({ value: p.id, label: `${p.id.slice(0,4)}: ${p.titulo}` })));

      if (isEdit) {
        const data = await reportagemService.getById(id);
        if (data) form.setFieldsValue(data);
      }
    } catch (err) {
      console.error(err);
      message.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await reportagemService.save({ ...values, id });
      message.success('Reportagem salva com sucesso');
      navigate('/producao/reportagens');
    } catch (err) {
      console.error(err);
      message.error('Erro ao salvar reportagem');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmeter = async () => {
    try {
      const values = await form.validateFields();
      await onFinish({ ...values, status: 'revisao' });
    } catch (err) {
      // Form validation error
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1400px] mx-auto pb-10">
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'redacao', programa: 'jn' }}>
          
          {/* Top Actions Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="bg-primary/10 text-primary p-3 rounded-xl flex items-center justify-center">
                <FileTextOutlined className="text-xl" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 m-0">{isEdit ? 'Editar Reportagem' : 'Nova Reportagem'}</h1>
                <p className="text-slate-500 text-sm">Dados editoriais, técnicos e vinculação à pauta.</p>
              </div>
            </div>
            <Space size="middle" className="self-end md:self-auto">
              <Button icon={<CloseOutlined />} onClick={() => navigate('/producao/reportagens')}>Cancelar</Button>
              <Button icon={<SaveOutlined />} onClick={() => form.submit()} loading={loading} className="text-primary border-primary/20 bg-primary/5">Salvar Rascunho</Button>
              <Button type="primary" icon={<SendOutlined />} onClick={handleSubmeter} loading={loading} className="bg-primary h-10 px-6 shadow-lg shadow-primary/30">
                Submeter para Aprovação
              </Button>
            </Space>
          </div>

          <Row gutter={24}>
            {/* Main Content Column */}
            <Col lg={16} className="space-y-6">
              <Card className="shadow-sm rounded-xl">
                <Form.Item name="titulo" label={<span className="text-xs font-bold uppercase text-slate-500">Título da Matéria</span>} rules={[{required: true}]}>
                  <Input placeholder="Insira um título impactante..." className="text-lg font-bold py-2 border-slate-200" />
                </Form.Item>

                <Form.Item name="lead" label={
                  <div className="flex justify-between w-full">
                    <span className="text-xs font-bold uppercase text-slate-500">Lead (Resumo)</span>
                    <span className="text-[10px] text-slate-400">0/250 caracteres</span>
                  </div>
                }>
                  <TextArea rows={3} placeholder="O resumo que será lido pelo apresentador..." className="border-slate-200" />
                </Form.Item>

                <Form.Item name="corpo" label={<span className="text-xs font-bold uppercase text-slate-500">Corpo da Matéria</span>}>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1">
                      {/* Fake Editor Toolbar */}
                      <Button size="small" type="text" className="font-bold">B</Button>
                      <Button size="small" type="text" className="italic">I</Button>
                      <Button size="small" type="text" className="underline">U</Button>
                      <Divider type="vertical" />
                      <Button size="small" type="text" icon={<HistoryOutlined />} className="ml-auto text-[10px]">Histórico</Button>
                    </div>
                    <TextArea rows={15} className="border-none focus:ring-0 text-base leading-relaxed p-4" placeholder="Escreva o conteúdo da reportagem aqui..." />
                  </div>
                </Form.Item>
              </Card>

              {/* Versioning Section */}
              <Card title={<Space><HistoryOutlined /> Versionamento Recente</Space>} className="shadow-sm rounded-xl" size="small">
                 <div className="space-y-4 p-2">
                    <div className="flex gap-4 border-l-2 border-primary/20 pl-4 py-1">
                       <Badge status="processing" color="#7f13ec" />
                       <div>
                          <div className="text-sm font-bold">Versão Atual (Rascunho) <span className="text-[10px] font-normal text-slate-400 ml-2">Agora</span></div>
                          <div className="text-xs text-slate-500">Editado por João D.</div>
                       </div>
                    </div>
                 </div>
              </Card>
            </Col>

            {/* Side Info Column */}
            <Col lg={8} className="space-y-6">
              {/* Editorial Workflow */}
              <Card className="shadow-sm rounded-xl" title={<span className="text-xs font-bold uppercase text-slate-500">Fluxo Editorial</span>}>
                <Steps
                  direction="vertical"
                  current={0}
                  size="small"
                  items={[
                    { title: 'Produção', description: 'Em edição' },
                    { title: 'Revisão', description: 'Aguardando envio' },
                    { title: 'Aprovado', description: '' },
                  ]}
                />
              </Card>

              {/* Ficha Técnica */}
              <Card className="shadow-sm rounded-xl" title={<span className="text-xs font-bold uppercase text-slate-500">Ficha Técnica</span>}>
                <Form.Item name="pauta_id" label="Pauta Vinculada" className="mb-4">
                  <Select placeholder="Selecione a pauta..." className="w-full" options={pautas} allowClear />
                </Form.Item>
                <Form.Item name="programa" label="Programa">
                  <Select options={[{value: 'jn', label: 'Jornal da Noite'}]} />
                </Form.Item>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="reporter" label="Repórter">
                      <Select options={[{value: 'Ana Silva', label: 'Ana Silva'}]} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="editor" label="Editor">
                      <Select options={[{value: 'João D.', label: 'João D.'}]} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="duracao" label="Duração Estimada">
                   <Input prefix={<ClockCircleOutlined />} placeholder="00:00:00" />
                </Form.Item>
              </Card>

              {/* Multimedia NAS Links */}
              <Card className="shadow-sm rounded-xl" title={<Space><FolderOpenOutlined /> Multimédia (NAS)</Space>}>
                <div className="space-y-3">
                  <Form.Item name={['nas_links', 'video']} label={<span className="text-[10px] font-bold text-slate-400 uppercase">Vídeo</span>} className="mb-2">
                    <Input size="small" placeholder="\\nas01\prod\video\..." className="bg-slate-50 text-[11px]" prefix={<FolderOpenOutlined className="text-gray-400" />} />
                  </Form.Item>
                  <Form.Item name={['nas_links', 'audio']} label={<span className="text-[10px] font-bold text-slate-400 uppercase">Áudio</span>} className="mb-2">
                    <Input size="small" placeholder="\\nas01\prod\audio\..." className="bg-slate-50 text-[11px]" prefix={<FolderOpenOutlined className="text-gray-400" />} />
                  </Form.Item>
                  <Form.Item name={['nas_links', 'imagens']} label={<span className="text-[10px] font-bold text-slate-400 uppercase">Imagens</span>} className="mb-0">
                    <Input size="small" placeholder="\\nas01\prod\img\..." className="bg-slate-50 text-[11px]" prefix={<FolderOpenOutlined className="text-gray-400" />} />
                  </Form.Item>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    </MainLayout>
  );
};


export default ReportagemFormPage;