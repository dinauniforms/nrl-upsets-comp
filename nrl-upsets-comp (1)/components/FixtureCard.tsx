import React from 'react';
import { Fixture, Team } from '../types';
import TeamLogo from './TeamLogo';

interface FixtureCardProps {
  fixture: Fixture;
  onSelect: (team: Team, opponent: Team) => void;
  selectedTeamId: string | null;
  isLocked: boolean;
}

const FixtureCard: React.FC<FixtureCardProps> = ({ fixture, onSelect, selectedTeamId, isLocked }) => {
  const { homeTeam, awayTeam, kickoff } = fixture;
  
  // Underdogs have a HIGHER rank number (e.g., 17 vs 1)
  const isHomeUnderdog = homeTeam.rank > awayTeam.rank;
  const isAwayUnderdog = awayTeam.rank > homeTeam.rank;

  // Calculate potential points: (Upset Team Rank - Favourite Team Rank)
  const homePoints = isHomeUnderdog ? (homeTeam.rank - awayTeam.rank) : 0;
  const awayPoints = isAwayUnderdog ? (awayTeam.rank - homeTeam.rank) : 0;

  const timeStr = new Date(kickoff).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toLowerCase();

  const renderTippingButton = (team: Team, opponent: Team, isUnderdog: boolean, points: number) => {
    const isSelected = selectedTeamId === team.id;
    const canSelect = isUnderdog && !isLocked;

    // If it's not the underdog, we don't show a tipping button at all in this game mode
    if (!isUnderdog) {
      return <div className="flex-1 px-4"></div>;
    }

    // If tipping is locked (past round or lockout), and it's NOT selected, hide the button
    // to emphasize that tipping is impossible.
    if (isLocked && !isSelected) {
       return (
        <div className="flex-1 px-4 flex justify-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight opacity-50">
            Tipping Unavailable
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 px-4">
        <button
          onClick={() => canSelect && onSelect(team, opponent)}
          disabled={!canSelect}
          className={`w-full max-w-[200px] mx-auto py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2
            ${isLocked 
              ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200' 
              : isSelected 
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-100' 
                : 'bg-[#0066b2] text-white hover:bg-[#005594] shadow-blue-100 active:scale-95'
            }`}
        >
          {isSelected ? (
            <>
              <i className="fa-solid fa-check"></i>
              SELECTED ({points})
            </>
          ) : (
            `UPSET TIP (${points})`
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="w-full bg-white py-8 border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
      {/* Team Row */}
      <div className="flex items-center justify-center gap-4 md:gap-12 mb-6 px-4">
        <div className="flex-1 flex items-center justify-end gap-4 text-right">
          <div className="flex flex-col items-end">
            <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{homeTeam.shortName}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rank {homeTeam.rank}</span>
          </div>
          <TeamLogo logoUrl={homeTeam.logoUrl} name={homeTeam.name} size="md" />
        </div>

        <div className="flex flex-col items-center min-w-[100px]">
          <span className="text-lg md:text-2xl font-black text-slate-800 tracking-tighter">{timeStr}</span>
        </div>

        <div className="flex-1 flex items-center justify-start gap-4">
          <TeamLogo logoUrl={awayTeam.logoUrl} name={awayTeam.name} size="md" />
          <div className="flex flex-col items-start">
            <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{awayTeam.shortName}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rank {awayTeam.rank}</span>
          </div>
        </div>
      </div>

      {/* Button Row */}
      <div className="flex items-center justify-center max-w-2xl mx-auto px-4">
        {renderTippingButton(homeTeam, awayTeam, isHomeUnderdog, homePoints)}
        
        <div className="px-4 hidden sm:block">
          <div className="w-12 h-6 flex items-center justify-center opacity-20">
            <i className="fa-solid fa-football text-slate-400"></i>
          </div>
        </div>

        {renderTippingButton(awayTeam, homeTeam, isAwayUnderdog, awayPoints)}
      </div>
    </div>
  );
};

export default FixtureCard;