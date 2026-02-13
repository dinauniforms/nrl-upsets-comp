import React from 'react';
import { COLORS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white mt-12 py-12 px-4 border-t-4" style={{ borderTopColor: COLORS.NRL_GREEN }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-400">How to Play</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="w-6 h-6 flex-shrink-0 bg-green-900/50 rounded-full flex items-center justify-center text-xs font-bold text-green-400">1</span>
                <span>Browse the fixtures for the current round. Only underdogs (teams ranked lower on the ladder) are selectable.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 flex-shrink-0 bg-green-900/50 rounded-full flex items-center justify-center text-xs font-bold text-green-400">2</span>
                <span>Select exactly <strong>one</strong> team you think will pull off an upset victory.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 flex-shrink-0 bg-green-900/50 rounded-full flex items-center justify-center text-xs font-bold text-green-400">3</span>
                <span>Confirm your pick before the first kickoff of the round. Once it starts, all tipping is locked!</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-400">Scoring</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Points are awarded based on the rank differential between the underdog and the favourite. If your selected underdog wins, you earn 
              <span className="text-white font-bold mx-1">(Underdog Rank - Favourite Rank)</span> points.
            </p>
            <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 italic">Example: Picking Rank 8 to beat Rank 5 yields (8 - 5) = 3 points!</p>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex justify-center items-center text-xs text-slate-500 font-medium">
          <p className="text-center">NRL Upsets Comp 2026© all rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;