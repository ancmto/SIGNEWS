import React, { useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col, Card, Space, message, Typography, Divider, Badge } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, SendOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { pautaService } from '../../services/pautaService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PautaFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      const pauta = pautaService.getById(id);
      if (pauta) {
        form.setFieldsValue({
          ...pauta,
          dataVeiculacao: dayjs(pauta.dataVeiculacao)
        });
      }
    }
  }, [id, isEdit, form]);

  const onFinish = (values) => {
    const pautaData = {
      ...values,
      id: id || null,
      dataVeiculacao: values.dataVeiculacao.format('YYYY-MM-DD'),
      status: isEdit ? values.status : 'rascunho'
    };
    
    pautaService.save(pautaData);
    message.success(isEdit ? 'Pauta atualizada!' : 'Pauta criada com sucesso!');
    navigate('/pautas');
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-10">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* HEADER FIXO DE AÇÕES */}
        <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-[#f0f2f5] py-2">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pautas')}>Voltar</Button>
            <Title level={4} style={{ margin: 0 }}>{isEdit ? 'Editar Pauta' : 'Nova Pauta'}</Title>
          </Space>
          <Space>
            <Button icon={<SendOutlined />}>Submeter</Button>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} className="bg-[#7f13ec]">
              {isEdit ? 'Salvar Alterações' : 'Criar Pauta'}
            </Button>
          </Space>
        </div>

        <Row gutter={24}>
          {/* COLUNA PRINCIPAL */}
          <Col span={16}>
            <Card className="shadow-sm border-gray-100" style={{ borderLeft: '4px solid #722ED1' }}>
              <Title level={5} className="mb-4"><Badge status="processing" color="#722ED1" /> Dados da Pauta</Title>
              
              <Form.Item name="titulo" label="Título da Pauta" rules={[{ required: true, message: 'Insira o título' }]}>
                <Input placeholder="Digite um título claro e conciso" size="large" />
              </Form.Item>

              <Form.Item name="descricao" label="Descrição Detalhada" rules={[{ required: true, message: 'Insira a descrição' }]}>
                <TextArea rows={10} placeholder="Descreva os detalhes, fontes e locais..." />
              </Form.Item>

              <Divider orientation="left">Equipe Designada</Divider>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="editor" label="Editor Responsável">
                    <Select placeholder="Selecione..." prefix={<UserOutlined />}>
                      <Select.Option value="1">Carlos Mendes</Select.Option>
                      <Select.Option value="2">Marta Silva</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="jornalista" label="Jornalista">
                    <Select placeholder="Selecione...">
                      <Select.Option value="Ana Souza">Ana Souza</Select.Option>
                      <Select.Option value="Roberto Justus">Roberto Justus</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="camera" label="Operador de Câmera">
                    <Select placeholder="Selecione...">
                      <Select.Option value="Ricardo Zoom">Ricardo Zoom</Select.Option>
                      <Select.Option value="João Paulo">João Paulo</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* SIDEBAR DE DETALHES */}
          <Col span={8}>
            <Space direction="vertical" size="large" className="w-full">
              <Card title="Detalhes Técnicos" size="small" className="shadow-sm">
                <Form.Item name="editoria" label="Editoria" rules={[{ required: true }]}>
                  <Select placeholder="Selecione...">
                    <Select.Option value="Sociedade">Sociedade</Select.Option>
                    <Select.Option value="Politica">Política</Select.Option>
                    <Select.Option value="Economia">Economia</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="dataVeiculacao" label="Previsão de Veiculação" rules={[{ required: true }]}>
                  <DatePicker className="w-full" format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item name="prioridade" label="Prioridade">
                  <Select>
                    <Select.Option value="low">Baixa</Select.Option>
                    <Select.Option value="normal">Normal</Select.Option>
                    <Select.Option value="high">Urgente</Select.Option>
                  </Select>
                </Form.Item>

                {isEdit && (
                  <Form.Item name="status" label="Status Atual">
                    <Select>
                      <Select.Option value="rascunho">Rascunho</Select.Option>
                      <Select.Option value="producao">Em Produção</Select.Option>
                      <Select.Option value="aguardando">Aguardando Aprovação</Select.Option>
                      <Select.Option value="aprovado">Aprovado</Select.Option>
                    </Select>
                  </Form.Item>
                )}
              </Card>

              <Card title="Comentários Internos" size="small" className="shadow-sm">
                <div className="bg-gray-50 p-3 rounded mb-4 text-xs">
                  <Text strong>Carlos Mendes:</Text>
                  <p className="m-0 text-gray-500 italic">Precisamos de imagens aéreas se possível.</p>
                </div>
                <Input.Search placeholder="Adicionar comentário..." enterButton="Enviar" size="small" />
              </Card>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PautaFormPage;