import React from 'react';

const Header = () => {
  return (
    <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="hidden md:flex max-w-lg w-full relative group">
          <input 
            className="w-[320px] bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-md px-4 py-2 pl-10 focus:ring-1 focus:ring-primary focus:border-primary focus:w-[400px] outline-none transition-all placeholder:text-gray-400 group-hover:bg-white group-hover:border-gray-300" 
            placeholder="Buscar pauta, vídeo ou espelho..." 
            type="text"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[18px]">search</span>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400">Ctrl K</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 flex-1 justify-end">
        <button className="size-9 flex items-center justify-center rounded-full hover:bg-gray-50 text-slate-500 relative transition-colors group" title="Notificações">
          <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-error rounded-full border border-white"></span>
        </button>
        <button className="size-9 flex items-center justify-center rounded-full hover:bg-gray-50 text-slate-500 transition-colors group" title="Ajuda">
          <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">help</span>
        </button>
        <div className="h-8 w-px bg-gray-200 mx-1"></div>
        <div className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full border border-purple-100 cursor-pointer transition-colors">
          <span className="size-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-bold text-primary">Redação SP</span>
          <span className="material-symbols-outlined text-primary text-[16px]">expand_more</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
