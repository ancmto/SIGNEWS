import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';

const TimingBar = () => {
  return (
    <div className="bg-[#140d1b] text-white px-6 py-3 border-t border-slate-800">
      <div className="flex items-center justify-between">

        {/* Horário Previsto */}
        <div className="flex items-center gap-4 border-r border-white/10 pr-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Horário Previsto
            </span>
            <span className="text-2xl font-mono font-bold text-white leading-none tracking-tight">
              20:00:00
            </span>
          </div>
          <ClockCircleOutlined className="text-slate-600 text-[24px]" />
        </div>

        {/* Tempos */}
        <div className="flex items-center gap-8 flex-1 justify-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Tempo Previsto
            </span>
            <span className="text-lg font-mono font-bold text-slate-200">
              00:45:00
            </span>
          </div>

          <div className="flex flex-col items-center relative">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Tempo Corrido
            </span>
            <span className="text-lg font-mono font-bold text-yellow-400">
              00:15:20
            </span>
            <div className="absolute -bottom-2 w-full h-0.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400" style={{ width: '33%' }}></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Tempo Real (Est.)
            </span>
            <span className="text-lg font-mono font-bold text-white">
              00:16:10
            </span>
          </div>
        </div>

        {/* Diferença */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
              Diferença <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
            </span>
            <span className="text-2xl font-mono font-bold text-red-500 leading-none tracking-tight">
              +00:00:50
            </span>
          </div>
          <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">
            ESTOURO
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimingBar;
