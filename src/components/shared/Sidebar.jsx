import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/common/AuthContext';
import { pautaService } from '@/features/pautas/pauta.service';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [width, setWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Load config from DB
    const loadConfig = async () => {
      try {
        const config = await pautaService.getAppSettings('menu_config');
        if (config) {
          setWidth(config.width || 240);
          setIsCollapsed(config.model === 'OnlyButtons');
        }
      } catch (err) {
        console.error('Erro ao carregar menu config:', err);
      }
    };
    loadConfig();
  }, []);

  const saveConfig = useCallback(async (newWidth, collapsed) => {
    try {
      await pautaService.updateAppSettings('menu_config', {
        width: newWidth,
        model: collapsed ? 'OnlyButtons' : 'full'
      });
    } catch (err) {
      console.error('Erro ao salvar menu config:', err);
    }
  }, []);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    saveConfig(width, isCollapsed);
  }, [width, isCollapsed, saveConfig]);

  const resize = useCallback((e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth < 120) {
        setIsCollapsed(true);
        setWidth(64);
      } else if (newWidth < 180) {
        // Between 120 and 180, we force OnlyButtons or jump to 180
        setWidth(64);
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
        const snappedWidth = Math.min(Math.max(newWidth, 180), 320);
        setWidth(snappedWidth);
      }
    }
  }, [isResizing]);

  const handleToggleCollapse = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    const newWidth = newState ? 64 : (width < 180 ? 240 : width);
    if (!newState && width < 180) setWidth(240);
    saveConfig(newState ? 64 : (width < 180 ? 240 : width), newState);
  }, [isCollapsed, width, saveConfig]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const menuItems = [
    { label: 'Início', icon: 'dashboard', path: '/dashboard', implemented: true },
    
    { section: 'Planejamento' },
    { label: 'Pautas', icon: 'article', path: '/planejamento/pautas', implemented: true },
    { label: 'Agenda', icon: 'calendar_month', path: '/agenda', implemented: false },
    { label: 'Contatos/Fontes', icon: 'contacts', path: '/contatos', implemented: true },
    
    { section: 'Produção' },
    { label: 'Reportagens', icon: 'videocam', path: '/producao/reportagens', implemented: true },
    { label: 'Mídias & Ingest', icon: 'folder_open', path: '/ingest', implemented: false },
    
    { section: 'Exibição' },
    { label: 'Espelhos', icon: 'view_timeline', path: '/espelhos', implemented: true },
    { label: 'Teleprompter', icon: 'live_tv', path: '/tp', implemented: false },

    { section: 'Sistema' },
    { label: 'Notificações', icon: 'notifications', path: '/sistema/notificacoes', implemented: false },
    { label: 'Lixeira Global', icon: 'delete', path: '/sistema/lixeira', implemented: true },
    { label: 'Configurações', icon: 'settings', path: '/configuracoes/usuarios', implemented: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentWidth = isCollapsed ? 64 : width;

  return (
    <aside 
      className="flex-shrink-0 flex flex-col bg-menu-dark h-full z-30 hidden md:flex transition-all duration-75 shadow-xl relative select-none"
      style={{ width: currentWidth }}
    >
      {/* Resizer Handle */}
      <div 
        onMouseDown={startResizing}
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-40 active:bg-primary"
      />

      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-5'} bg-[#001529] shadow-sm flex-shrink-0 z-10 border-b border-white/5 overflow-hidden group/header`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-primary size-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(127,19,236,0.5)]">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap opacity-100 transition-opacity duration-300">
              <h1 className="text-white text-[15px] font-bold leading-none tracking-tight font-display text-nowrap">SGI NEWSROOM</h1>
              <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest mt-1">Sistema de Gestão</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button 
            onClick={() => handleToggleCollapse()}
            className="material-symbols-outlined text-white/20 hover:text-white/60 transition-colors text-[20px] cursor-pointer"
            title="Recolher Menu"
          >
            menu_open
          </button>
        )}
        {isCollapsed && (
          <button 
            onClick={() => handleToggleCollapse()}
            className="absolute -right-3 top-20 bg-primary/80 text-white rounded-full size-6 flex items-center justify-center shadow-lg opacity-0 group-hover/header:opacity-100 transition-opacity z-50 border border-white/10"
          >
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2 flex flex-col gap-0.5 text-[14px] custom-scrollbar">
        {menuItems.map((item, index) => (
          item.section ? (
            !isCollapsed && <div key={index} className="sidebar-section-label px-6 mt-4 mb-2 text-white/30 text-[10px] uppercase font-bold tracking-widest">{item.section}</div>
          ) : (
            <Link
              key={index}
              to={item.implemented ? item.path : '#'}
              title={isCollapsed ? item.label : ''}
              onClick={(e) => !item.implemented && e.preventDefault()}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 transition-all mx-2 rounded group relative ${
                location.pathname.startsWith(item.path) && item.implemented 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              } ${!item.implemented ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`material-symbols-outlined text-[20px] flex-shrink-0 ${location.pathname.startsWith(item.path) && item.implemented ? 'filled' : ''}`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
              {!item.implemented && !isCollapsed && (
                <span className="absolute right-2 px-1 rounded bg-white/10 text-[8px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">Breve</span>
              )}
            </Link>
          )
        ))}
      </nav>

      <div className="p-0 border-t border-white/5 bg-[#000c17]">
        <div className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 p-4'} hover:bg-white/5 cursor-pointer transition-all group relative overflow-hidden h-14`}>
          <div 
            className="size-8 rounded-full bg-cover bg-center ring-2 ring-primary/30 relative flex-shrink-0" 
            style={{ backgroundImage: `url('https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=7f13ec&color=fff')` }}
          >
            <span className="absolute bottom-0 right-0 size-2.5 bg-success border-2 border-[#001529] rounded-full"></span>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex flex-col overflow-hidden flex-1">
                <span className="text-sm font-semibold text-white truncate">{user?.email?.split('@')[0] || 'Usuário'}</span>
                <span className="text-[11px] text-white/50 truncate">Editor/Produtor</span>
              </div>
              <button 
                onClick={handleLogout}
                className="material-symbols-outlined text-white/30 ml-auto text-[18px] hover:text-error transition-colors"
                title="Sair"
              >
                logout
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
