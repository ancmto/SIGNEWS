import React from 'react';
import { Typography, Card, Button, Space, Row, Col } from 'antd';
import { PlusOutlined, VideoCameraOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <Card className="mb-6 rounded-xl shadow-sm border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2} className="m-0">Olá, Ana! 👋</Title>
            <Text type="secondary">Panorama geral da produção.</Text>
          </div>
          <Space>
            <Button type="primary" size="large" icon={<PlusOutlined />}>Nova Pauta</Button>
            <Button size="large" icon={<VideoCameraOutlined />}>Nova Reportagem</Button>
          </Space>
        </div>
      </Card>

      {/* Grid de Conteúdo (Cards de Métricas e Gráficos viriam aqui) */}
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card title="Status dos Espelhos" className="shadow-sm">
            {/* Conteúdo do Grid de Espelhos */}
            <p className="text-gray-400 italic">Lista de espelhos em tempo real...</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Atividade Recente" className="shadow-sm">
            {/* Timeline de atividades */}
            <p className="text-gray-400 italic">Logs do sistema...</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;