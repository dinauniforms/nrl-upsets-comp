import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Ladder from './components/Ladder';
import FixtureCard from './components/FixtureCard';
import SelectionModal from './components/SelectionModal';
import Footer from './components/Footer';
import RoundSwitcher from './components/RoundSwitcher';
import HistoryView from './components/HistoryView';
import Leaderboard from './components/Leaderboard';
import { Team, Fixture, HistoryRecord, LadderEntry, Member } from './types';
import { getTeamStyle, LADDER_2026_START, ROUND_1_FIXTURES } from './constants';

const STORAGE_KEY = 'nrl_upset_tipping_v7';
const ACTIVE_COMPETITION_ROUND = 1;

const SEED_MEMBERS: Member[] = [
  { id: 'm1', name: 'Doon', totalPoints: 0, password: 'admin' },
  { id: 'm2', name: 'Son of Doon', totalPoints: 0, password: 'son' },
  { id: 'm3', name: 'Steph No. 1', totalPoints: 0, password: 'steph' },
  { id: 'm4', name: 'Mel Meninga', totalPoints: 0, password: 'mal' },
  { id: 'm5', name: 'Dora the Explorer', totalPoints: 0, password: 'map' },
  { id: 'm6', name: 'Sparrow', totalPoints: 0, password: 'jack' },
  { id: 'm7', name: 'Colin', totalPoints: 0, password: 'col' },
  { id: 'm8', name: 'Winthrop', totalPoints: 0, password: 'win' },
  { id: 'm9', name: 'Weekend at Bernies', totalPoints: 0, password: 'bernie' },
  { id: 'm10', name: 'Liv love laugh', totalPoints: 0, password: 'laugh' }
];

const ADMIN_PASSWORD = 'admin'; // Doon's password

const App: React.FC = () => {
  const [currentRound, setCurrentRound] = useState(ACTIVE_COMPETITION_ROUND);
  const [activeTab, setActiveTab] = useState<'tipping' | 'leaderboard' | 'history'>('tipping');
  const [currentMemberId, setCurrentMemberId] = useState<string>(SEED_MEMBERS[0].id);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<boolean>(false);
  
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<Team | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [history, setHistory] = useState<Record<string, Record<number, HistoryRecord>>>({});
  
  const [liveLadder, setLiveLadder] = useState<LadderEntry[]>([]);
  const [liveFixtures, setLiveFixtures] = useState<Fixture[]>([]);
  const [teamMap, setTeamMap] = useState<Record<string, Team>>({});

  const currentMember = SEED_MEMBERS.find(m => m.id === currentMemberId) || SEED_MEMBERS[0];

  const createTeam = (name: string, rank: number = 0, played: number = 0, points: number = 0): Team => {
    const safeName = name || "Unknown Team";
    const style = getTeamStyle(safeName);
    const id = safeName.toLowerCase().replace(/\s+/g, '-');
    return {
      id,
      name: safeName,
      shortName: safeName,
      rank,
      played,
      points,
      primaryColor: style.primary,
      secondaryColor: style.secondary,
      logoUrl: style.logo
    };
  };

  useEffect(() => {
    const newTeamMap: Record<string, Team> = {};
    const formattedLadder: LadderEntry[] = LADDER_2026_START.map((l) => {
      const team = createTeam(l.name, l.rank, l.played, l.points);
      newTeamMap[team.id] = team;
      return {
        teamId: team.id,
        rank: l.rank,
        played: l.played,
        won: 0, lost: 0, drawn: 0, 
        points: l.points,
        differential: l.differential
      };
    });

    const fixturesToProcess = currentRound === 1 ? ROUND_1_FIXTURES : [];
    const formattedFixtures: Fixture[] = fixturesToProcess.map((f, index) => {
      const home = Object.values(newTeamMap).find(t => t.name === f.homeTeamName) || createTeam(f.homeTeamName);
      const away = Object.values(newTeamMap).find(t => t.name === f.awayTeamName) || createTeam(f.awayTeamName);
      if (!newTeamMap[home.id]) newTeamMap[home.id] = home;
      if (!newTeamMap[away.id]) newTeamMap[away.id] = away;
      return { id: `r${currentRound}-f${index}`, homeTeam: home, awayTeam: away, kickoff: f.kickoff, venue: f.venue };
    });

    setTeamMap(newTeamMap);
    setLiveLadder(formattedLadder);
    setLiveFixtures(formattedFixtures);
  }, [currentRound]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.history) setHistory(data.history);
        if (data.currentMemberId) {
          const exists = SEED_MEMBERS.some(m => m.id === data.currentMemberId);
          if (exists) setCurrentMemberId(data.currentMemberId);
        }
      } catch (e) { console.error(e); }
    } else {
      // Mock history set to 'pending' so everyone starts at 0 points as requested.
      const mockHistory: Record<string, Record<number, HistoryRecord>> = {
        'm1': { 1: { round: 1, selectedTeamId: 'knights', opponentId: 'cowboys', timestamp: new Date().toISOString(), status: 'pending', pointsEarned: 5 } },
        'm4': { 1: { round: 1, selectedTeamId: 'rabbitohs', opponentId: 'roosters', timestamp: new Date().toISOString(), status: 'pending', pointsEarned: 6 } },
        'm6': { 1: { round: 1, selectedTeamId: 'titans', opponentId: 'sharks', timestamp: new Date().toISOString(), status: 'pending', pointsEarned: 11 } }
      };
      setHistory(mockHistory);
    }
  }, []);

  const isLocked = useMemo(() => {
    if (currentRound !== ACTIVE_COMPETITION_ROUND) return true;
    if (liveFixtures.length === 0) return false;
    const sorted = [...liveFixtures].sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
    return Date.now() > new Date(sorted[0].kickoff).getTime();
  }, [liveFixtures, currentRound]);

  const currentMemberHistory = history[currentMemberId] || {};
  const currentRoundTip = currentMemberHistory[currentRound]?.selectedTeamId || null;

  const groupedFixtures = useMemo(() => {
    const groups: Record<string, Fixture[]> = {};
    const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    liveFixtures.forEach(f => {
      const d = new Date(f.kickoff);
      const weekday = d.toLocaleDateString(undefined, { weekday: 'long' });
      const day = d.getDate();
      const month = d.toLocaleDateString(undefined, { month: 'long' });
      const dateKey = `${weekday} ${getOrdinal(day)} ${month}`.toUpperCase();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(f);
    });
    return groups;
  }, [liveFixtures]);

  const checkAuth = () => {
    // Access granted if password matches selected member OR is the admin password (Doon)
    if (passwordInput === currentMember.password || passwordInput === ADMIN_PASSWORD) {
      setAuthError(false);
      return true;
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000); 
      return false;
    }
  };

  const handleSelectTeam = (team: Team, opponent: Team) => {
    if (isLocked || currentRound !== ACTIVE_COMPETITION_ROUND) return;
    if (!checkAuth()) {
      alert("Incorrect password. Please enter the password for " + currentMember.name + " or the admin password.");
      return;
    }
    setSelectedTeam(team);
    setSelectedOpponent(opponent);
    setIsModalOpen(true);
  };

  const handleConfirmTip = () => {
    if (selectedTeam && selectedOpponent) {
      // Re-verify auth for safety before final write
      if (passwordInput !== currentMember.password && passwordInput !== ADMIN_PASSWORD) {
        alert("Authorization failed. Please re-enter your password.");
        setIsModalOpen(false);
        return;
      }

      const potentialPoints = selectedTeam.rank - selectedOpponent.rank;
      const newMemberHistory = { 
        ...currentMemberHistory, 
        [currentRound]: { 
          round: currentRound, 
          selectedTeamId: selectedTeam.id, 
          opponentId: selectedOpponent.id, 
          timestamp: new Date().toISOString(),
          status: 'pending' as const,
          pointsEarned: potentialPoints
        } 
      };
      const newHistory = { ...history, [currentMemberId]: newMemberHistory };
      setHistory(newHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ history: newHistory, currentMemberId }));
    }
    setIsModalOpen(false);
  };

  const handleMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setCurrentMemberId(newId);
    // Keep password if it's the admin password, otherwise clear it
    if (passwordInput !== ADMIN_PASSWORD) {
      setPasswordInput('');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history, currentMemberId: newId }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header isLocked={isLocked} firstKickoff={liveFixtures[0]?.kickoff || new Date().toISOString()} />

      <div className="bg-white border-b border-slate-200 sticky top-[72px] md:top-[88px] z-30">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('tipping')} className={`py-4 px-6 text-sm font-bold transition-all relative flex-shrink-0 ${activeTab === 'tipping' ? 'text-green-700' : 'text-slate-500 hover:text-slate-800'}`}>
              Tipping Board
              {activeTab === 'tipping' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"></div>}
            </button>
            <button onClick={() => setActiveTab('leaderboard')} className={`py-4 px-6 text-sm font-bold transition-all relative flex-shrink-0 ${activeTab === 'leaderboard' ? 'text-green-700' : 'text-slate-500 hover:text-slate-800'}`}>
              Leaderboard
              {activeTab === 'leaderboard' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"></div>}
            </button>
            <button onClick={() => setActiveTab('history')} className={`py-4 px-6 text-sm font-bold transition-all relative flex-shrink-0 ${activeTab === 'history' ? 'text-green-700' : 'text-slate-500 hover:text-slate-800'}`}>
              My Predictions
              {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"></div>}
            </button>
          </div>
          <div className="py-2 md:py-0 flex items-center gap-3">
            <div className="relative group">
               <input 
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`bg-slate-50 border ${authError ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-lg py-1.5 px-3 text-sm font-medium text-slate-800 outline-none focus:border-green-500 transition-all w-32`}
               />
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal w-48 text-center shadow-lg pointer-events-none">
                 Required to tip. Doon (Admin) can use his password for any user.
               </div>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap">Tipping As</span>
            <select 
              value={currentMemberId}
              onChange={handleMemberChange}
              className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-sm font-bold text-slate-800 outline-none focus:border-green-500 transition-colors"
            >
              {SEED_MEMBERS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === 'tipping' ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <RoundSwitcher currentRound={currentRound} maxRound={27} onRoundChange={setCurrentRound} activeCompetitionRound={ACTIVE_COMPETITION_ROUND} />

              <div className="flex items-center justify-between mt-6 mb-8">
                <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <i className="fa-solid fa-calendar-days text-green-600"></i>
                  Fixtures
                </h2>
                {currentRoundTip && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[10px] font-black border border-green-200 flex items-center gap-2 uppercase tracking-wide">
                    <i className="fa-solid fa-check-circle"></i>
                    {currentMember.name}'s Tip Saved
                  </div>
                )}
              </div>

              {liveFixtures.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {(Object.entries(groupedFixtures) as [string, Fixture[]][]).map(([date, fixtures]) => (
                    <div key={date}>
                      <div className="bg-slate-50/50 py-4 text-center border-b border-slate-100">
                        <span className="text-[11px] font-normal text-slate-600 tracking-[0.35em] inline-block pr-[-0.35em]">
                          {date}
                        </span>
                      </div>
                      {fixtures.map(f => (
                        <FixtureCard 
                          key={f.id} 
                          fixture={f} 
                          onSelect={handleSelectTeam} 
                          selectedTeamId={currentRoundTip} 
                          isLocked={isLocked || currentRound !== ACTIVE_COMPETITION_ROUND} 
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                  <i className="fa-solid fa-circle-nodes text-6xl mb-4"></i>
                  <p className="font-bold text-center px-4 max-w-md">This round will become available once the last game has been played from the previous round.</p>
                </div>
              )}
            </div>

            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
              <Ladder ladder={liveLadder} teamMap={teamMap} />
            </div>
          </div>
        ) : activeTab === 'leaderboard' ? (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
                  <i className="fa-solid fa-trophy text-amber-500"></i>
                  The Upset Leaderboard
                </h2>
                <p className="text-slate-500 text-sm mt-1">Scores awarded based on successful underdog rankings differential.</p>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
                <span className="text-[10px] font-black uppercase text-slate-400">Comp Progress</span>
                <div className="flex gap-1">
                  {Array.from({length: 9}).map((_, i) => (
                    <div key={i} className={`w-3 h-1.5 rounded-full ${i+1 <= ACTIVE_COMPETITION_ROUND ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
              </div>
            </div>
            <Leaderboard members={SEED_MEMBERS} allHistory={history} currentRound={ACTIVE_COMPETITION_ROUND} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <i className="fa-solid fa-clock-rotate-left text-green-600"></i>
              {currentMember.name}'s Tips
            </h2>
            <HistoryView history={currentMemberHistory} teamMap={teamMap} />
          </div>
        )}
      </main>

      <Footer />

      {isModalOpen && selectedTeam && selectedOpponent && (
        <SelectionModal 
          team={selectedTeam} 
          opponent={selectedOpponent}
          onConfirm={handleConfirmTip} 
          onCancel={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;