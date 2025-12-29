import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Início', icon: 'dashboard', path: '/dashboard', active: true },
    { section: 'Planejamento' },
    { label: 'Pautas', icon: 'article', path: '/pautas' },
    { label: 'Agenda', icon: 'calendar_month', path: '/agenda' },
    { section: 'Produção' },
    { label: 'Reportagens', icon: 'videocam', path: '/reportagens' },
    { label: 'Mídias & Ingest', icon: 'folder_open', path: '/ingest' },
    { section: 'Exibição' },
    { label: 'Espelhos', icon: 'view_timeline', path: '/espelhos' },
    { label: 'Teleprompter', icon: 'live_tv', path: '/tp' },
    { section: 'Administração' },
    { label: 'Configurações', icon: 'settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-[250px] flex-shrink-0 flex flex-col bg-menu-dark h-full z-30 hidden md:flex transition-all duration-300 shadow-xl relative">
      <div className="h-16 flex items-center gap-3 px-5 bg-[#001529] shadow-sm flex-shrink-0 z-10 border-b border-white/5">
        <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(127,19,236,0.5)]">
          <span className="material-symbols-outlined text-[20px]">hub</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-[15px] font-bold leading-none tracking-tight font-display">SGI NEWSROOM</h1>
          <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest mt-1">Sistema de Gestão</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2 flex flex-col gap-0.5 text-[14px]">
        {menuItems.map((item, index) => (
          item.section ? (
            <div key={index} className="sidebar-section-label">{item.section}</div>
          ) : (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-2.5 transition-colors mx-2 rounded ${
                location.pathname === item.path ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${location.pathname === item.path ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        ))}
      </nav>

      <div className="p-0 border-t border-white/5 bg-[#000c17]">
        <div className="flex items-center gap-3 p-4 hover:bg-white/5 cursor-pointer transition-colors group relative">
          <div 
            className="size-9 rounded-full bg-cover bg-center ring-2 ring-primary/30 relative" 
            style={{ backgroundImage: `url('https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=7f13ec&color=fff')` }}
          >
            <span className="absolute bottom-0 right-0 size-2.5 bg-success border-2 border-[#001529] rounded-full"></span>
          </div>
          <div className="flex flex-col overflow-hidden max-w-[120px]">
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
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
