import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const Breadcrumbs = () => {
  const location = useLocation();
  const path = location.pathname;

  // Define a mapeamento de rotas para nomes amigáveis e seções
  const getBreadcrumbs = () => {
    const items = [
      {
        title: (
          <Link to="/dashboard" className="flex items-center gap-1">
            <HomeOutlined style={{ fontSize: '12px' }} />
            <span>Início</span>
          </Link>
        ),
      },
    ];

    if (path === '/dashboard') return items;

    // Planejamento
    if (path.includes('/pautas')) {
      items.push({ title: 'Planejamento' });
      items.push({ title: <Link to="/planejamento/pautas">Pautas</Link> });
      if (path.endsWith('/nova')) items.push({ title: 'Nova Pauta' });
      if (path.includes('/editar/')) items.push({ title: 'Editar Pauta' });
    } else if (path.startsWith('/contatos')) {
      items.push({ title: 'Planejamento' });
      items.push({ title: <Link to="/contatos">Contatos/Fontes</Link> });
      if (path === '/contatos/novo') items.push({ title: 'Novo Contato' });
      if (path.includes('/editar/')) items.push({ title: 'Editar Contato' });
    } else if (path === '/agenda') {
      items.push({ title: 'Planejamento' });
      items.push({ title: 'Agenda' });
    }
    
    // Produção
    else if (path.includes('/reportagens')) {
      items.push({ title: 'Produção' });
      items.push({ title: <Link to="/producao/reportagens">Reportagens</Link> });
      if (path.endsWith('/nova')) items.push({ title: 'Nova Reportagem' });
      if (path.includes('/editar/')) items.push({ title: 'Editar Reportagem' });
    } else if (path.startsWith('/ingest')) {
      items.push({ title: 'Produção' });
      items.push({ title: 'Mídias & Ingest' });
    }

    // Exibição
    else if (path.startsWith('/espelhos')) {
      items.push({ title: 'Exibição' });
      items.push({ title: 'Espelhos' });
    } else if (path.startsWith('/tp')) {
      items.push({ title: 'Exibição' });
      items.push({ title: 'Teleprompter' });
    }

    // Sistema
    else if (path.includes('/lixeira')) {
      items.push({ title: 'Sistema' });
      items.push({ title: 'Lixeira Global' });
    }

    // Configurações
    else if (path.startsWith('/configuracoes/usuarios')) {
      items.push({ title: 'Sistema' });
      items.push({ title: <Link to="/configuracoes/usuarios">Configurações</Link> });
      items.push({ title: <Link to="/configuracoes/usuarios">Usuários</Link> });
      if (path.endsWith('/novo')) items.push({ title: 'Novo Usuário' });
    } else if (path.startsWith('/configuracoes/auditoria')) {
      items.push({ title: 'Sistema' });
      items.push({ title: <Link to="/configuracoes/usuarios">Configurações</Link> });
      items.push({ title: 'Auditoria' });
    } else if (path === '/settings') {
      items.push({ title: 'Sistema' });
      items.push({ title: 'Configurações' });
    }

    return items;
  };

  return (
    <div className="mb-4">
      <Breadcrumb 
        items={getBreadcrumbs()} 
        className="text-[11px] font-medium"
      />
    </div>
  );
};

export default Breadcrumbs;
