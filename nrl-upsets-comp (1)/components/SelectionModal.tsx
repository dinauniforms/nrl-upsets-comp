import React from 'react';
import { Team } from '../types';
import TeamLogo from './TeamLogo';

interface SelectionModalProps {
  team: Team;
  opponent: Team;
  onConfirm: () => void;
  onCancel: () => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ team, opponent, onConfirm, onCancel }) => {
  const potentialPoints = Math.max(0, team.rank - opponent.rank);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-6 mb-6">
                <TeamLogo logoUrl={team.logoUrl} name={team.name} size="md" />
                <span className="text-2xl font-black text-slate-200 italic">VS</span>
                <TeamLogo logoUrl={opponent.logoUrl} name={opponent.name} size="md" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4">Confirm Your Tip</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              You are picking <span className="font-bold text-slate-900">{team.name}</span> to upset the <span className="font-bold text-slate-900">{opponent.name}</span>.
            </p>
            <div className="mt-4 inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 font-black text-sm uppercase tracking-tight">
              That's a potential {potentialPoints} points!
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onCancel}
              className="py-4 px-4 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Change Tip
            </button>
            <button
              onClick={onConfirm}
              className="py-4 px-4 rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all"
            >
              Confirm Pick
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;