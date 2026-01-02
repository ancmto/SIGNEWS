import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const TopInfoBar = () => {
  const [now, setNow] = useState(dayjs());

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 bg-[#140d1b] text-slate-400 text-[10px] font-mono flex items-center justify-end px-6 border-b border-white/5 shrink-0 z-50">
      <div className="flex items-center gap-4 tracking-wider">
        <span className="opacity-70">SÃO PAULO</span>
        <span className="text-white font-bold">{now.format('HH:mm:ss')}</span>
        <span className="text-slate-600">|</span>
        <span className="uppercase">{now.locale('pt-br').format('DD MMM YYYY')}</span>
      </div>
    </div>
  );
};

export default TopInfoBar;