
import React from 'react';
import { HistoryRecord, Team } from '../types';
import TeamLogo from './TeamLogo';

interface HistoryViewProps {
  history: Record<number, HistoryRecord>;
  teamMap: Record<string, Team>;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, teamMap }) => {
  const sortedRounds = Object.keys(history)
    .map(Number)
    .sort((a, b) => b - a);

  if (sortedRounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <i className="fa-solid fa-clock-rotate-left text-3xl"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-800">No History Yet</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">
          Start tipping to see your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedRounds.map((roundNum) => {
        const record = history[roundNum];
        const team = teamMap[record.selectedTeamId];
        const opponent = teamMap[record.opponentId];

        if (!team || !opponent) return null;

        return (
          <div key={roundNum} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase font-black text-slate-400">Rnd</span>
                <span className="text-lg font-black text-slate-800 leading-none">{roundNum}</span>
              </div>
              <div className="h-10 w-px bg-slate-100"></div>
              <div className="flex items-center gap-3">
                <TeamLogo logoUrl={team.logoUrl} name={team.name} size="sm" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-tight">{team.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Upset Pick vs {opponent.name}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
               <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Locked</span>
               <p className="text-[10px] text-slate-400 mt-1">
                 {new Date(record.timestamp).toLocaleDateString()}
               </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryView;
