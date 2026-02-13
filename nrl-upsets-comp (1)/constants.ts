export const COLORS = {
  NRL_GREEN: '#004e33',
  NRL_DARK_BLUE: '#002b5c',
  NRL_GOLD: '#f9d31d',
  WHITE: '#ffffff',
  GRAY: '#64748b'
};

export const TEAM_STYLING: Record<string, { primary: string; secondary: string; logo: string }> = {
  'panthers': { 
    primary: '#000000', 
    secondary: '#008291', 
    logo: 'https://www.nrl.com/.theme/panthers/badge.svg?bust=202601300854' 
  },
  'storm': { 
    primary: '#4b2a82', 
    secondary: '#002b5c', 
    logo: 'https://www.nrl.com/.theme/storm/badge.svg?bust=202601300854' 
  },
  'roosters': { 
    primary: '#002b5c', 
    secondary: '#e31b23', 
    logo: 'https://www.nrl.com/.theme/roosters/badge.svg?bust=202601300854' 
  },
  'sharks': { 
    primary: '#0082ca', 
    secondary: '#ffffff', 
    logo: 'https://www.nrl.com/.theme/sharks/badge.svg?bust=202601300854' 
  },
  'cowboys': { 
    primary: '#002b5c', 
    secondary: '#ffc222', 
    logo: 'https://www.nrl.com/.theme/cowboys/badge.svg?bust=202601300854' 
  },
  'bulldogs': { 
    primary: '#0055a4', 
    secondary: '#ffffff', 
    logo: 'https://www.nrl.com/.theme/bulldogs/badge.svg?bust=202510310458' 
  },
  'sea eagles': { 
    primary: '#6f163d', 
    secondary: '#ffffff', 
    logo: 'https://images.seeklogo.com/logo-png/52/1/manly-warringah-sea-eagles-logo-png_seeklogo-526032.png' 
  },
  'knights': { 
    primary: '#ee333e', 
    secondary: '#0055a4', 
    logo: 'https://www.nrl.com/.theme/knights/badge.svg?bust=202601300854' 
  },
  'raiders': { 
    primary: '#96d61d', 
    secondary: '#ffffff', 
    logo: 'https://www.nrl.com/.theme/raiders/badge.svg?bust=202601300854' 
  },
  'dolphins': { 
    primary: '#e31b23', 
    secondary: '#ffc222', 
    logo: 'https://www.nrl.com/.theme/dolphins/badge.svg?bust=202601300854' 
  },
  'dragons': { 
    primary: '#e31b23', 
    secondary: '#ffffff', 
    logo: 'https://www.nrl.com/.theme/dragons/badge.svg?bust=202601300854' 
  },
  'broncos': { 
    primary: '#6f163d', 
    secondary: '#ffc222', 
    logo: 'https://www.nrl.com/.theme/broncos/badge.svg?bust=202512042316' 
  },
  'warriors': { 
    primary: '#000000', 
    secondary: '#0055a4', 
    logo: 'https://www.nrl.com/.theme/warriors/badge.svg?bust=202601300854' 
  },
  'eels': { 
    primary: '#006ab3', 
    secondary: '#ffc222', 
    logo: 'https://www.nrl.com/.theme/eels/badge.svg?bust=202601300854' 
  },
  'rabbitohs': { 
    primary: '#004e33', 
    secondary: '#e31b23', 
    logo: 'https://www.nrl.com/.theme/rabbitohs/badge.svg?bust=202601300854' 
  },
  'titans': { 
    primary: '#00a9e0', 
    secondary: '#ffc222', 
    logo: 'https://www.nrl.com/.theme/titans/badge.svg?bust=202601300854' 
  },
  'tigers': { 
    primary: '#f4821f', 
    secondary: '#000000', 
    logo: 'https://www.nrl.com/.theme/wests-tigers/badge-light.svg?bust=202601300854' 
  }
};

export const getTeamStyle = (name?: string) => {
  const defaultStyle = { primary: '#cbd5e1', secondary: '#94a3b8', logo: 'https://www.nrl.com/symbol/nrl/badge.svg' };
  if (!name) return defaultStyle;
  const normalized = name.toLowerCase();
  for (const [key, style] of Object.entries(TEAM_STYLING)) {
    if (normalized.includes(key)) return style;
  }
  return defaultStyle;
};

// Ladder using simplified names exactly as per user preference
export const LADDER_2026_START = [
  { name: 'Raiders', rank: 1, played: 24, points: 44, differential: 148 },
  { name: 'Storm', rank: 2, played: 24, points: 40, differential: 212 },
  { name: 'Bulldogs', rank: 3, played: 24, points: 38, differential: 120 },
  { name: 'Broncos', rank: 4, played: 24, points: 36, differential: 172 },
  { name: 'Sharks', rank: 5, played: 24, points: 36, differential: 109 },
  { name: 'Warriors', rank: 6, played: 24, points: 34, differential: 21 },
  { name: 'Panthers', rank: 7, played: 24, points: 33, differential: 107 },
  { name: 'Roosters', rank: 8, played: 24, points: 32, differential: 132 },
  { name: 'Dolphins', rank: 9, played: 24, points: 30, differential: 125 },
  { name: 'Sea Eagles', rank: 10, played: 24, points: 30, differential: 21 },
  { name: 'Eels', rank: 11, played: 24, points: 26, differential: -76 },
  { name: 'Cowboys', rank: 12, played: 24, points: 25, differential: -146 },
  { name: 'Tigers', rank: 13, played: 24, points: 24, differential: -135 },
  { name: 'Rabbitohs', rank: 14, played: 24, points: 24, differential: -181 },
  { name: 'Dragons', rank: 15, played: 24, points: 22, differential: -130 },
  { name: 'Titans', rank: 16, played: 24, points: 18, differential: -199 },
  { name: 'Knights', rank: 17, played: 24, points: 18, differential: -300 },
];

export const ROUND_1_FIXTURES = [
  {
    homeTeamName: 'Knights',
    awayTeamName: 'Cowboys',
    kickoff: '2026-03-01T16:05:00',
    venue: 'McDonald Jones Stadium, Newcastle'
  },
  {
    homeTeamName: 'Roosters',
    awayTeamName: 'Rabbitohs',
    kickoff: '2026-03-01T18:15:00',
    venue: 'Allianz Stadium, Sydney'
  },
  {
    homeTeamName: 'Panthers',
    awayTeamName: 'Storm',
    kickoff: '2026-03-02T16:00:00',
    venue: 'BlueBet Stadium, Penrith'
  },
  {
    homeTeamName: 'Broncos',
    awayTeamName: 'Dolphins',
    kickoff: '2026-03-02T19:50:00',
    venue: 'Suncorp Stadium, Brisbane'
  },
  {
    homeTeamName: 'Raiders',
    awayTeamName: 'Warriors',
    kickoff: '2026-03-03T18:00:00',
    venue: 'GIO Stadium, Canberra'
  },
  {
    homeTeamName: 'Eels',
    awayTeamName: 'Bulldogs',
    kickoff: '2026-03-03T20:00:00',
    venue: 'CommBank Stadium, Sydney'
  },
  {
    homeTeamName: 'Sea Eagles',
    awayTeamName: 'Sharks',
    kickoff: '2026-03-04T18:00:00',
    venue: '4 Pines Park, Manly'
  },
  {
    homeTeamName: 'Dragons',
    awayTeamName: 'Tigers',
    kickoff: '2026-03-04T20:00:00',
    venue: 'Netstrata Jubilee Stadium'
  }
];