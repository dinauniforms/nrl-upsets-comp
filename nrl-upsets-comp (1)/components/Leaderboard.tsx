import React from 'react';
import { Member, HistoryRecord } from '../types';

interface LeaderboardProps {
  members: Member[];
  allHistory: Record<string, Record<number, HistoryRecord>>;
  currentRound: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ members, allHistory, currentRound }) => {
  const rounds = Array.from({ length: 9 }, (_, i) => i + 1);

  // Calculate scores for each member
  const memberScores = members.map(member => {
    const history = allHistory[member.id] || {};
    const roundPoints: Record<number, number> = {};
    let total = 0;

    rounds.forEach(r => {
      const tip = history[r];
      // Points are ONLY rewarded if the match is finished and the status is 'won'
      // If the tip is 'pending' (match not played yet) or 'lost', points are 0.
      const pts = tip?.status === 'won' ? (tip.pointsEarned || 0) : 0;
      roundPoints[r] = pts;
      total += pts;
    });

    return {
      ...member,
      roundPoints,
      total
    };
  }).sort((a, b) => {
    // Primary sort: Total Points (descending)
    // Secondary sort: Name (ascending) for consistency
    if (b.total !== a.total) return b.total - a.total;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-black text-xl tracking-tight uppercase">2026 Season Leaderboard</h2>
          <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mt-1">Competition Rounds 1 — 9</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Live Updates</span>
           </div>
        </div>
      </div>
      
      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-wider sticky left-0 bg-slate-50 z-20 border-r border-slate-100 min-w-[180px]">
                Member Name
              </th>
              {rounds.map(r => (
                <th key={r} className={`px-2 py-4 text-[10px] font-black uppercase text-center tracking-wider min-w-[60px] ${r === currentRound ? 'text-green-600 bg-green-50/50' : 'text-slate-400'}`}>
                  R{r}
                </th>
              ))}
              <th className="px-6 py-4 text-[10px] font-black uppercase text-center text-slate-800 tracking-wider bg-slate-100 border-l border-slate-200 min-w-[100px]">
                Total Pts
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {memberScores.map((ms, index) => (
              <tr key={ms.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-[11px] font-black ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-orange-400' : 'text-slate-300'}`}>
                      {index + 1}.
                    </span>
                    <span className="font-bold text-slate-800 text-sm whitespace-nowrap">{ms.name}</span>
                    {index === 0 && ms.total > 0 && <i className="fa-solid fa-crown text-amber-400 text-xs ml-auto"></i>}
                  </div>
                </td>
                {rounds.map(r => {
                  const pts = ms.roundPoints[r];
                  const hasTip = allHistory[ms.id]?.[r];
                  return (
                    <td key={r} className="px-2 py-4 text-center">
                      {pts > 0 ? (
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-black text-green-600">+{pts}</span>
                        </div>
                      ) : hasTip ? (
                        <div className="flex flex-col items-center">
                          {hasTip.status === 'pending' ? (
                            <span className="text-[9px] font-black text-slate-300 uppercase italic">Pending</span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-200">—</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-100">•</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-6 py-4 text-center bg-slate-50/30 border-l border-slate-100">
                  <span className={`inline-block min-w-[40px] py-1.5 px-3 rounded-lg font-black text-sm shadow-sm ${
                    ms.total > 0 
                      ? 'bg-slate-900 text-white shadow-slate-200' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {ms.total}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Won Tip</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-slate-300"></div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Pending Match</span>
           </div>
        </div>
        <p className="text-[10px] text-slate-400 font-medium italic text-center md:text-right max-w-md">
          Points are only awarded after the match concludes.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;