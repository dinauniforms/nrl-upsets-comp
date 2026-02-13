import React from 'react';

interface HeaderProps {
  isLocked: boolean;
  firstKickoff: string;
}

const Header: React.FC<HeaderProps> = ({ isLocked, firstKickoff }) => {
  const dateStr = new Date(firstKickoff).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">NRL UPSETS COMP</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">2026 Season • Strategy is key</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-normal text-slate-400 tracking-tight">Round 1 lockout</p>
            <p className="text-sm font-bold text-slate-900">{dateStr}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isLocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
              isLocked 
                ? 'bg-red-50 border-red-100 text-red-600' 
                : 'bg-green-50 border-green-100 text-green-600'
            }`}>
              {isLocked ? 'Locked' : 'Open'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;