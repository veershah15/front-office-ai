export type Status = 'verified' | 'projection' | 'unavailable';
export type Team = {
  id: string; name: string; city: string; abbreviation: string;
  conference: 'East' | 'West'; division: string;
  record: string | null; rank: string | null; rosterSource?: string;
  timeline?: { category: string; confidence: string; rationale: string; priorities: string[]; evidence: string[] };
};
export type Player = { name: string; position: string; age: number; teamId: string; source: string; checkedAt: string };

const rawTeams = [
  ['atlanta-hawks','Atlanta Hawks','Atlanta','ATL','East','Southeast'],
  ['boston-celtics','Boston Celtics','Boston','BOS','East','Atlantic'],
  ['brooklyn-nets','Brooklyn Nets','Brooklyn','BKN','East','Atlantic'],
  ['charlotte-hornets','Charlotte Hornets','Charlotte','CHA','East','Southeast'],
  ['chicago-bulls','Chicago Bulls','Chicago','CHI','East','Central'],
  ['cleveland-cavaliers','Cleveland Cavaliers','Cleveland','CLE','East','Central'],
  ['dallas-mavericks','Dallas Mavericks','Dallas','DAL','West','Southwest'],
  ['denver-nuggets','Denver Nuggets','Denver','DEN','West','Northwest'],
  ['detroit-pistons','Detroit Pistons','Detroit','DET','East','Central'],
  ['golden-state-warriors','Golden State Warriors','Golden State','GSW','West','Pacific'],
  ['houston-rockets','Houston Rockets','Houston','HOU','West','Southwest'],
  ['indiana-pacers','Indiana Pacers','Indiana','IND','East','Central'],
  ['los-angeles-clippers','LA Clippers','Los Angeles','LAC','West','Pacific'],
  ['los-angeles-lakers','Los Angeles Lakers','Los Angeles','LAL','West','Pacific'],
  ['memphis-grizzlies','Memphis Grizzlies','Memphis','MEM','West','Southwest'],
  ['miami-heat','Miami Heat','Miami','MIA','East','Southeast'],
  ['milwaukee-bucks','Milwaukee Bucks','Milwaukee','MIL','East','Central'],
  ['minnesota-timberwolves','Minnesota Timberwolves','Minnesota','MIN','West','Northwest'],
  ['new-orleans-pelicans','New Orleans Pelicans','New Orleans','NOP','West','Southwest'],
  ['new-york-knicks','New York Knicks','New York','NYK','East','Atlantic'],
  ['oklahoma-city-thunder','Oklahoma City Thunder','Oklahoma City','OKC','West','Northwest'],
  ['orlando-magic','Orlando Magic','Orlando','ORL','East','Southeast'],
  ['philadelphia-76ers','Philadelphia 76ers','Philadelphia','PHI','East','Atlantic'],
  ['phoenix-suns','Phoenix Suns','Phoenix','PHX','West','Pacific'],
  ['portland-trail-blazers','Portland Trail Blazers','Portland','POR','West','Northwest'],
  ['sacramento-kings','Sacramento Kings','Sacramento','SAC','West','Pacific'],
  ['san-antonio-spurs','San Antonio Spurs','San Antonio','SAS','West','Southwest'],
  ['toronto-raptors','Toronto Raptors','Toronto','TOR','East','Atlantic'],
  ['utah-jazz','Utah Jazz','Utah','UTA','West','Northwest'],
  ['washington-wizards','Washington Wizards','Washington','WAS','East','Southeast']
] as const;

export const checkedAt = '2026-11-03';
export const nbaTeamsSource = 'https://www.nba.com/teams';
export const dallasSource = 'https://www.nba.com/team/1610612742/roster';
export const denverSource = 'https://www.nba.com/team/1610612743/roster';

export const teams: Team[] = rawTeams.map(([id, name, city, abbreviation, conference, division]) => ({
  id, name, city, abbreviation, conference, division, record: null, rank: null
}));

const dallas = teams.find(t => t.id === 'dallas-mavericks')!;
dallas.record = '4–3';
dallas.rank = '9th in West';
dallas.rosterSource = dallasSource;
dallas.timeline = {
  category: 'Transition / Uncertain', confidence: 'Low',
  rationale: 'Dallas combines a young core led by Cooper Flagg with established veterans, including Kyrie Irving. Seven early-season games do not establish its ceiling. This is a provisional strategic assessment, not a measured championship probability.',
  priorities: ['Protect development opportunities for the young core', 'Test which veterans complement that core', 'Verify contracts and pick control before trade recommendations'],
  evidence: [dallasSource]
};

const denver = teams.find(t => t.id === 'denver-nuggets')!;
denver.record = '3–3';
denver.rank = '10th in West';
denver.rosterSource = denverSource;
denver.timeline = {
  category: 'Championship Mode', confidence: 'Moderate',
  rationale: 'Denver still has a veteran core built around Nikola Jokić, Jamal Murray and Aaron Gordon. Its 3–3 start is a small sample, so this classification weighs the roster construction more heavily than the opening record. It is a provisional editorial assessment.',
  priorities: ['Evaluate playoff rotation depth and versatility', 'Preserve near-term support around the veteran core', 'Verify financial constraints before any acquisition advice'],
  evidence: [denverSource]
};

function roster(teamId: string, source: string, lines: string): Player[] {
  return lines.trim().split('\n').map(line => {
    const [name, position, age] = line.split('|');
    return { name, position, age: Number(age), teamId, source, checkedAt };
  });
}

export const players: Player[] = [
  ...roster('dallas-mavericks', dallasSource, `
Max Christie|G|23
Walter Clayton Jr.|G|23
Dereck Lively II|C|22
Naji Marshall|F|28
Marcus Sasser|G|26
Jett Howard|G|23
Zaccharie Risacher|F|21
Kyrie Irving|G|34
Tarik Biberović|F|25
Morez Johnson Jr.|F|20
Caleb Martin|F|31
Daniel Gafford|F-C|28
P.J. Washington|F|28
Moussa Cissé|C|24
Cooper Flagg|F|19
Tobi Lawal|F|23
Santi Aldama|F-C|25
Sergio de Larrea|G|20`),
  ...roster('denver-nuggets', denverSource, `
Christian Braun|G|25
Cam Whitmore|F|22
Julian Strawther|G|24
Marvin Bagley III|F|27
Tyus Jones|G|30
Trevon Brazile|F|23
Ryan Nembhard|G|23
DeMar DeRozan|G-F|37
Alpha Diallo|G|29
Bryce Hopkins|F|24
DaRon Holmes II|F|24
Nikola Jokić|C|31
Spencer Jones|F|25
Zeke Nnaji|F-C|25
Cameron Johnson|F|30
Jamal Murray|G|29
Aaron Gordon|F|31`)
];
