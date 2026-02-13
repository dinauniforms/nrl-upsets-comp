import React from 'react';

interface RoundSwitcherProps {
  currentRound: number;
  maxRound: number;
  onRoundChange: (round: number) => void;
  activeCompetitionRound?: number;
}

const RoundSwitcher: React.FC<RoundSwitcherProps> = ({ 
  currentRound, 
  maxRound, 
  onRoundChange,
  activeCompetitionRound 
}) => {
  const isActive = currentRound === activeCompetitionRound;

  return (
    <div className="flex items-center justify-center gap-8 py-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
      <button 
        onClick={() => onRoundChange(Math.max(1, currentRound - 1))}
        disabled={currentRound <= 1}
        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all border ${currentRound <= 1 ? 'border-slate-100 text-slate-200 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
      >
        <i className="fa-solid fa-chevron-left text-lg"></i>
      </button>

      <div className="flex flex-col items-center min-w-[160px]">
        <h2 className="text-2xl font-normal text-slate-900 tracking-tighter flex items-center gap-2">
          Round {currentRound}
        </h2>
        {activeCompetitionRound && (
          <div className={`mt-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
            {isActive ? 'Active & Open' : 'Restricted'}
          </div>
        )}
      </div>

      <button 
        onClick={() => onRoundChange(Math.min(maxRound, currentRound + 1))}
        disabled={currentRound >= maxRound}
        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all border ${currentRound >= maxRound ? 'border-slate-100 text-slate-200 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
      >
        <i className="fa-solid fa-chevron-right text-lg"></i>
      </button>
    </div>
  );
};

export default RoundSwitcher;