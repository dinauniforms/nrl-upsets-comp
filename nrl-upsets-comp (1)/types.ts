export interface Team {
  id: string;
  name: string;
  shortName: string;
  rank: number;
  played: number;
  points: number;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

export interface Fixture {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  kickoff: string; // ISO String
  venue: string;
}

export interface Member {
  id: string;
  name: string;
  totalPoints: number;
  password?: string; // Optional password for tip protection
}

export interface HistoryRecord {
  round: number;
  selectedTeamId: string;
  opponentId: string;
  timestamp: string;
  status?: 'pending' | 'won' | 'lost';
  pointsEarned?: number;
}

export interface LadderEntry {
  teamId: string;
  rank: number;
  played: number;
  won: number;
  lost: number;
  drawn: number;
  points: number;
  differential: number;
}