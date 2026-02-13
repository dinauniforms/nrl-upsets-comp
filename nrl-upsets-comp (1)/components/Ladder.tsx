import React from 'react';
import { LadderEntry, Team } from '../types';
import TeamLogo from './TeamLogo';

interface LadderProps {
  ladder: LadderEntry[];
  teamMap: Record<string, Team>;
}

const Ladder: React.FC<LadderProps> = ({ ladder, teamMap }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-list-ol"></i>
          NRL Ladder
        </h2>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Live 2026</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase font-bold">
              <th className="px-4 py-2">Pos</th>
              <th className="px-2 py-2">Team</th>
              <th className="px-2 py-2 text-center">P</th>
              <th className="px-2 py-2 text-center">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ladder.map((entry) => {
              const team = teamMap[entry.teamId];
              if (!team) return null;
              return (
                <tr key={entry.teamId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-400">{entry.rank}</td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <TeamLogo logoUrl={team.logoUrl} name={team.name} size="sm" />
                      <span className="font-semibold text-slate-700 hidden lg:inline">{team.name}</span>
                      <span className="font-semibold text-slate-700 lg:hidden">{team.shortName}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center text-slate-600">{entry.played}</td>
                  <td className="px-2 py-3 text-center font-bold text-slate-800">{entry.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ladder;