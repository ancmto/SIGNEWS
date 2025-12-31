import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  EyeOutlined, 
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  LockFilled
} from '@ant-design/icons';
import Badge from '@/components/common/Badge';
import { useAuth } from '@/components/common/AuthContext';
import styles from './LoginPage.module.css';

const { Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = (values) => {
    setLoading(true);
    // Simulation of network delay
    setTimeout(() => {
      // Fake validation
      if (values.email && values.password) {
        login(values); // Use context to login
        message.success('Login realizado com sucesso!');
        navigate('/dashboard'); 
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className={`${styles.loginPageContainer} flex overflow-hidden font-['Inter']`}>
      
      {/* LADO ESQUERDO: HERO SECTION (Oculto em mobile) */}
      <div className={`hidden lg:flex lg:w-1/2 relative flex-col justify-between ${styles.loginHeroSection} text-white overflow-hidden`} 
           style={{ 
             backgroundColor: '#4c1d95',
             backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHgUA-LIFxHH-uDTbEw2yWCTKzqADACgTS-ZBGPGNuVrW6HmyzRVaAy49ldBRra_CfP2I5-LAu7PBxkXEkaPbW06wYxkzUWHcKsGDcFMX5BmJrsTQF5gX9EU7WZS_Abq2GMVjesqcjeRVz1F6hG_pS6NOEZb0UftlYBB5RRnaK9aOUlEi0PyAGYSZofpkdZwJ4WY3kEA5Hj2-c9SzR26iHYJL3ArMVfep3t_wQUrttcceRc6UInDMtfYSrdNsCkBs3Gl-GNDG1AHc')`
           }}>
        
        {/* Camada de degradê sobre o pattern */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/95 to-purple-800/80 z-0"></div>
        
        {/* Efeito de Blobs Animados (CSS inline para simplicidade) */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-700 font-bold text-xl shadow-lg">
              SGI
            </div>
            <h2 className="text-xl font-semibold tracking-wide">Eco TV</h2>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Sistema de Gestão de Informação</h1>
          <p className="text-lg text-purple-100 mb-8 font-light">
            O NCRS completo para planejamento, produção, aprovação e exibição de conteúdos jornalísticos. Centralize sua redação com eficiência e segurança.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <Badge icon={<CheckCircleOutlined />} text="Fluxo Unificado" />
            <Badge icon={<SafetyCertificateOutlined />} text="Segurança Total" />
            <Badge icon={<ThunderboltOutlined />} text="Alta Performance" />
          </div>
        </div>

        <div className="relative z-10 text-sm text-purple-200 opacity-80">
          © 2024 Eco TV. Todos os direitos reservados.
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO */}
      <div className={`w-full lg:w-1/2 bg-gray-50 flex flex-col items-center justify-center ${styles.loginFormSide}`}>
        <div className={`w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 ${styles.loginCard}`}>
          
          {/* Header Mobile (Logo aparece apenas aqui) */}
          <div className={`lg:hidden ${styles.loginLogoHeader} text-center`}>
            <div className="w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4">
              SGI
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Eco TV SGI</h1>
          </div>

          <div className={`text-center ${styles.loginLogoHeader}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h2>
            <Text type="secondary">Acesse sua conta para gerenciar conteúdos</Text>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              label="Email ou Usuário"
              name="email"
              rules={[{ required: true, message: 'Por favor, insira seu e-mail!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="seu.nome@ecotv.com.br" 
              />
            </Form.Item>

            <Form.Item
              label="Senha"
              name="password"
              rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="••••••••"
                iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Lembrar-me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" size="small" className="text-purple-600 hover:text-purple-500 font-medium">
                Esqueci minha senha
              </Link>
            </div>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                className="h-12 text-base shadow-md"
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>

          {/* Divider e Footer de Cadastro */}
          <div className={styles.loginDivider}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative px-2 bg-white text-sm text-gray-500">Novo na redação?</span>
          </div>

          <div className={styles.loginRegisterLink}>
            <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500 hover:underline">
              Cadastrar-se no sistema
            </Link>
          </div>

          <div className={`${styles.loginSecurityNotice} flex items-center justify-center gap-2 text-xs text-gray-400`}>
            <LockFilled className="text-[12px]" />
            <span>Conexão Segura SSL 256-bit</span>
          </div>
        </div>
        
        <div className={`${styles.loginFooterText} text-xs text-gray-400 lg:hidden text-center`}>
          © 2024 Sistema de Gestão de Informação
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
