import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, BookOpen, BrainCircuit, ChartNoAxesCombined, Check, ChevronDown, CircleHelp, ClipboardList, GitCompareArrows, Home, MessageSquareText, Search, ShieldCheck, Target, Trash2, Users, Workflow } from 'lucide-react';
import './styles.css';

type Team = { id: string; name: string; city: string; abbreviation: string; conference: 'East' | 'West'; division: string; record: string | null; rank: string | null; rosterSource?: string; timeline?: { category: string; confidence: string; rationale: string; priorities: string[]; evidence: string[] } };
type Player = { name: string; position: string; age: number; teamId: string; source: string; checkedAt: string };
type Note = { id: string; teamId: string; kind: string; text: string; createdAt: string };
type Source = { name: string; url: string; checkedAt: string; coverage: string; status: string };
type Data = { teams: Team[]; players: Player[]; notes: Note[]; sources: Source[]; checkedAt: string; aiConfigured: boolean };
type ChatItem = { role: 'user' | 'assistant'; content: string };
type Page = 'league' | 'team' | 'players' | 'assets' | 'trades' | 'ai' | 'matchups' | 'draft' | 'compare' | 'workspace' | 'sources';

const nav: { id: Page; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'league', label: 'League overview', icon: Home },
  { id: 'team', label: 'Team dashboard', icon: ChartNoAxesCombined },
  { id: 'players', label: 'Player database', icon: Users },
  { id: 'assets', label: 'Draft assets', icon: ClipboardList },
  { id: 'trades', label: 'Trade simulator', icon: GitCompareArrows },
  { id: 'ai', label: 'AI general manager', icon: BrainCircuit },
  { id: 'matchups', label: 'Conference matchups', icon: Target },
  { id: 'draft', label: 'Draft center', icon: Workflow },
  { id: 'compare', label: 'Strategy comparison', icon: GitCompareArrows },
  { id: 'workspace', label: 'GM workspace', icon: MessageSquareText },
  { id: 'sources', label: 'Research & sources', icon: BookOpen }
];
const pilot = ['dallas-mavericks', 'denver-nuggets'];

function parseRoute(): { page: Page; teamId?: string } {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/');
  const page = nav.some(item => item.id === parts[0]) ? parts[0] as Page : 'league';
  return { page, teamId: page === 'team' ? parts[1] : undefined };
}
function App() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');
  const [route, setRoute] = useState(parseRoute());
  const [teamId, setTeamId] = useState('dallas-mavericks');
  const [leagueQuery, setLeagueQuery] = useState('');
  const [conference, setConference] = useState('All');
  const [playerQuery, setPlayerQuery] = useState('');
  const [noteKind, setNoteKind] = useState('Scouting observation');
  const [noteText, setNoteText] = useState('');
  const [noteBusy, setNoteBusy] = useState(false);
  const [noteError, setNoteError] = useState('');
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [chatBusy, setChatBusy] = useState(false);
  const [chatError, setChatError] = useState('');

  useEffect(() => {
    const update = () => setRoute(parseRoute());
    window.addEventListener('hashchange', update);
    fetch('/api/bootstrap').then(async response => {
      if (!response.ok) throw new Error((await response.json()).error || 'Could not load the app.');
      return response.json();
    }).then(setData).catch(e => setError(e.message));
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => { if (route.teamId) setTeamId(route.teamId); }, [route.teamId]);

  const team = data?.teams.find(item => item.id === (route.page === 'team' ? route.teamId || teamId : teamId)) || data?.teams[0];
  const currentTeam = data?.teams.find(item => item.id === teamId) || data?.teams[0];
  const navigate = (page: Page, id?: string) => { window.location.hash = `/${page}${page === 'team' && id ? `/${id}` : ''}`; };
  const teamName = (id: string) => data?.teams.find(item => item.id === id)?.name || id;
  const leagueTeams = useMemo(() => (data?.teams || []).filter(t => (conference === 'All' || t.conference === conference) && `${t.name} ${t.abbreviation}`.toLowerCase().includes(leagueQuery.toLowerCase())), [data, conference, leagueQuery]);
  const displayedPlayers = useMemo(() => (data?.players || []).filter(p => `${p.name} ${teamName(p.teamId)}`.toLowerCase().includes(playerQuery.toLowerCase())), [data, playerQuery]);
  const teamNotes = (data?.notes || []).filter(note => note.teamId === currentTeam?.id);

  async function saveNote(event: React.FormEvent) {
    event.preventDefault(); setNoteError(''); setNoteBusy(true);
    try {
      const response = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ teamId, kind: noteKind, text: noteText }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setData(old => old ? { ...old, notes: [result, ...old.notes] } : old); setNoteText('');
    } catch (e) { setNoteError((e as Error).message); } finally { setNoteBusy(false); }
  }
  async function deleteNote(id: string) {
    setNoteError('');
    try {
      const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setData(old => old ? { ...old, notes: old.notes.filter(note => note.id !== id) } : old);
    } catch (e) { setNoteError((e as Error).message); }
  }
  async function ask(event: React.FormEvent) {
    event.preventDefault(); if (!question.trim()) return;
    const q = question.trim(); const previous = chat;
    setChat([...chat, { role: 'user', content: q }]); setQuestion(''); setChatError(''); setChatBusy(true);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ teamId, question: q, history: previous }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setChat(old => [...old, { role: 'assistant', content: result.answer }]);
    } catch (e) { setChatError((e as Error).message); } finally { setChatBusy(false); }
  }

  if (error) return <div className="fatal"><h1>Front Office AI could not load</h1><p>{error}</p><button onClick={() => location.reload()}>Retry</button></div>;
  if (!data) return <div className="loading"><div className="skeleton top"/><div className="skeleton wide"/><div className="skeleton wide"/></div>;
  const page = route.page;
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand" onClick={() => navigate('league')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate('league')}>
        <div className="brand-mark">FO</div><div><strong>FRONT OFFICE</strong><span>AI / WORKSPACE</span></div>
      </div>
      <div className="nav-group-label">ANALYSIS DESK</div>
      <nav aria-label="Main navigation">{nav.map(item => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => navigate(item.id, item.id === 'team' ? teamId : undefined)}><Icon size={17} strokeWidth={1.8}/><span>{item.label}</span></button>; })}</nav>
      <div className="sidebar-bottom"><div className="status-dot"/><span>Data snapshot: Nov 3, 2026</span></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">FRONT OFFICE AI <span>/</span> {nav.find(item => item.id === page)?.label.toUpperCase()}</div><button className="source-shortcut" onClick={() => navigate('sources')}><ShieldCheck size={15}/> Source standards</button></header>
      <div className="content">
        {page === 'league' && <>
          <div className="eyebrow">THE LEAGUE / 2026–27</div>
          <section className="intro"><div><h1>Think beyond the box score.</h1><p>A workspace for franchise strategy, grounded in dated evidence and your own basketball judgment.</p></div><div className="intro-aside"><strong>30</strong><span>FRANCHISES IN VIEW</span><small>2 research pilots with sourced rosters</small></div></section>
          <div className="notice"><ShieldCheck size={18}/><div><strong>Evidence before certainty.</strong> Dallas and Denver have official roster snapshots. The other 28 team profiles are ready for research; their records and timelines remain unclassified until sourced.</div></div>
          <div className="section-title"><div><h2>Franchise board</h2><p>Open any team to inspect its current research state.</p></div><div className="controls"><label className="search"><Search size={16}/><input aria-label="Search teams" placeholder="Search teams" value={leagueQuery} onChange={e => setLeagueQuery(e.target.value)}/></label><select aria-label="Conference" value={conference} onChange={e => setConference(e.target.value)}><option>All</option><option>East</option><option>West</option></select></div></div>
          <div className="table-wrap"><table><thead><tr><th>FRANCHISE</th><th>CONF.</th><th>RECORD</th><th>COMPETITIVE TIMELINE</th><th>RESEARCH</th><th></th></tr></thead><tbody>{leagueTeams.map(t => <tr key={t.id} onClick={() => navigate('team', t.id)} className="clickable"><td><span className="team-badge">{t.abbreviation}</span><strong>{t.name}</strong></td><td>{t.conference}</td><td>{t.record || '—'}</td><td>{t.timeline ? <span className="timeline-tag">{t.timeline.category}</span> : <span className="muted">Unclassified</span>}</td><td>{pilot.includes(t.id) ? <span className="research ready">Roster sourced</span> : <span className="research">Directory only</span>}</td><td><ArrowRight size={16}/></td></tr>)}</tbody></table>{leagueTeams.length === 0 && <div className="empty">No team matches that search.</div>}</div>
        </>}
        {page === 'team' && team && <>
          <div className="eyebrow">FRANCHISE FILE / {team.conference.toUpperCase()} / {team.division.toUpperCase()}</div>
          <div className="team-hero"><div className="team-monogram">{team.abbreviation}</div><div><h1>{team.name}</h1><p>{team.record ? `${team.record} · ${team.rank} · NBA.com snapshot, November 3, 2026` : 'Team research has not been loaded yet'}</p></div><button className="outline" onClick={() => { setTeamId(team.id); navigate('workspace'); }}>Add GM insight <ArrowRight size={16}/></button></div>
          <div className="two-col"><section className="panel timeline-panel"><div className="panel-kicker">COMPETITIVE TIMELINE <span className={team.timeline ? 'projection' : ''}>{team.timeline ? 'EDITORIAL PROJECTION' : 'PENDING'}</span></div>{team.timeline ? <><h2>{team.timeline.category}</h2><div className="confidence">Confidence: {team.timeline.confidence}</div><p>{team.timeline.rationale}</p><h3>Near-term priorities</h3><ol>{team.timeline.priorities.map(x => <li key={x}>{x}</li>)}</ol></> : <><h2>Not classified</h2><p>We need a verified roster, recent performance, contracts, and draft assets before publishing a strategic classification.</p></>}</section><section className="panel availability-panel"><div className="panel-kicker">RESEARCH COVERAGE</div><h2>What the file can support</h2><div className="coverage-row"><Check size={16}/><span>Franchise identity and division</span></div><div className="coverage-row"><span className="coverage-empty">—</span><span>{team.rosterSource ? 'Official roster, ages and positions' : 'Roster pending'}</span></div><div className="coverage-row"><span className="coverage-empty">—</span><span>Contracts and salary: unavailable</span></div><div className="coverage-row"><span className="coverage-empty">—</span><span>Draft pick ownership: unavailable</span></div><div className="coverage-row"><span className="coverage-empty">—</span><span>Trade legality: not evaluated</span></div><button className="text-link" onClick={() => navigate('sources')}>Review sources <ArrowRight size={15}/></button></section></div>
          <div className="section-title"><div><h2>Roster</h2><p>{team.rosterSource ? 'Names, positions and ages from the official NBA team page.' : 'No verified roster is stored for this team yet.'}</p></div>{team.rosterSource && <a className="external" href={team.rosterSource} target="_blank" rel="noreferrer">View NBA source ↗</a>}</div>
          {team.rosterSource ? <div className="table-wrap"><table><thead><tr><th>PLAYER</th><th>POSITION</th><th>AGE</th><th>CONTRACT</th><th>STATUS</th></tr></thead><tbody>{data.players.filter(p => p.teamId === team.id).map(p => <tr key={p.name}><td><strong>{p.name}</strong></td><td>{p.position}</td><td>{p.age}</td><td className="muted">Not loaded</td><td><span className="research ready">NBA roster</span></td></tr>)}</tbody></table></div> : <div className="empty large"><CircleHelp size={24}/><h3>Research pending</h3><p>This franchise page is in the directory. Its roster and strategy will be added after source verification.</p></div>}
          <div className="action-strip"><div><strong>Ask a franchise question</strong><span>The AI GM uses this snapshot and your saved observations.</span></div><button onClick={() => { setTeamId(team.id); setChat([]); navigate('ai'); }}>Open AI GM <ArrowRight size={16}/></button></div>
        </>}
        {page === 'players' && <><div className="eyebrow">PLAYER DATABASE / PILOT</div><h1>Player database</h1><p className="page-subtitle">Official roster membership, position and age. Valuation scores wait for verified statistics and contracts.</p><div className="section-title"><div><h2>{displayedPlayers.length} players in the pilot</h2></div><label className="search"><Search size={16}/><input aria-label="Search players" placeholder="Search player or team" value={playerQuery} onChange={e => setPlayerQuery(e.target.value)}/></label></div><div className="table-wrap"><table><thead><tr><th>PLAYER</th><th>TEAM</th><th>POS.</th><th>AGE</th><th>BASKETBALL / CONTRACT / TRADE VALUE</th></tr></thead><tbody>{displayedPlayers.map(p => <tr key={`${p.teamId}-${p.name}`}><td><strong>{p.name}</strong></td><td><button className="inline-button" onClick={() => navigate('team', p.teamId)}>{teamName(p.teamId)}</button></td><td>{p.position}</td><td>{p.age}</td><td className="muted">Awaiting verified inputs</td></tr>)}</tbody></table>{displayedPlayers.length === 0 && <div className="empty">No player matches that search.</div>}</div></>}
        {page === 'ai' && currentTeam && <><div className="eyebrow">DECISION DESK / AI GENERAL MANAGER</div><h1>Ask the front office.</h1><p className="page-subtitle">Team-specific analysis from the stored snapshot and your GM notes. No live NBA feed is connected yet.</p><div className="field-row"><label>Franchise<select value={teamId} onChange={e => { setTeamId(e.target.value); setChat([]); setChatError(''); }}>{data.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label><div className={`connection ${data.aiConfigured ? 'on' : ''}`}>{data.aiConfigured ? 'AI service configured' : 'AI key required'}</div></div>{!data.aiConfigured && <div className="notice warning"><CircleHelp size={18}/><div><strong>AI GM needs an API key.</strong> Add OPENAI_API_KEY to the server’s .env file and restart. Notes and team research work without it.</div></div>}{!currentTeam.rosterSource && <div className="notice warning"><CircleHelp size={18}/><div><strong>Limited team context.</strong> This team has directory information only. The AI will identify missing evidence rather than invent analysis.</div></div>}<div className="chat-box">{chat.length === 0 ? <div className="chat-empty"><BrainCircuit size={30}/><h2>Start with a decision.</h2><p>Try “What should {currentTeam.city} prioritize?” or challenge the provisional timeline assessment.</p></div> : chat.map((item, index) => <div key={index} className={`message ${item.role}`}><span>{item.role === 'user' ? 'YOU' : 'FRONT OFFICE AI'}</span><p>{item.content}</p></div>)}{chatBusy && <div className="message assistant"><span>FRONT OFFICE AI</span><p>Reviewing the available evidence…</p></div>}</div>{chatError && <div role="alert" className="form-error">{chatError}</div>}<form className="chat-form" onSubmit={ask}><input aria-label="Ask the AI GM" placeholder="Ask a franchise-specific question" value={question} onChange={e => setQuestion(e.target.value)} disabled={chatBusy || !data.aiConfigured}/><button disabled={chatBusy || !data.aiConfigured || !question.trim()}>Ask <ArrowRight size={16}/></button></form><p className="fine-print">Snapshot: November 3, 2026. AI answers are analysis, not verified facts. {currentTeam.rosterSource && <a href={currentTeam.rosterSource} target="_blank" rel="noreferrer">Official roster source ↗</a>}</p></>}
        {page === 'workspace' && currentTeam && <><div className="eyebrow">HUMAN JUDGMENT / GM WORKSPACE</div><h1>Your basketball judgment belongs here.</h1><p className="page-subtitle">Save observations as your perspective. They remain separate from verified NBA facts and are included when you ask the AI GM.</p><div className="workspace-grid"><form className="panel note-form" onSubmit={saveNote}><div className="panel-kicker">NEW GM NOTE</div><label>Franchise<select value={teamId} onChange={e => setTeamId(e.target.value)}>{data.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label><label>Type<select value={noteKind} onChange={e => setNoteKind(e.target.value)}>{['Scouting observation','Strategic preference','Player to target','Player to avoid','Untouchable player','Trade idea','Matchup observation','Draft preference','Coaching / rotation'].map(x => <option key={x}>{x}</option>)}</select></label><label>Your perspective<textarea value={noteText} onChange={e => setNoteText(e.target.value)} maxLength={3000} rows={7} placeholder="What do you see that the numbers may miss?" required/></label><div className="form-footer"><span>{noteText.length} / 3000</span><button disabled={noteBusy || !noteText.trim()}>{noteBusy ? 'Saving…' : 'Save note'}</button></div>{noteError && <div role="alert" className="form-error">{noteError}</div>}</form><section className="notes-list"><div className="section-title"><div><h2>{currentTeam.name} notes</h2><p>Saved on this computer. Each note is marked as your view.</p></div></div>{teamNotes.length ? teamNotes.map(note => <article className="note" key={note.id}><div className="note-top"><span className="research opinion">MY PERSPECTIVE</span><time>{new Date(note.createdAt).toLocaleDateString()}</time><button aria-label={`Delete ${note.kind} note`} onClick={() => deleteNote(note.id)}><Trash2 size={16}/></button></div><strong>{note.kind}</strong><p>{note.text}</p></article>) : <div className="empty large"><MessageSquareText size={25}/><h3>Start a team file</h3><p>Your observations will appear here and shape future AI answers for this franchise.</p></div>}</section></div></>}
        {page === 'sources' && <><div className="eyebrow">RESEARCH / PROVENANCE</div><h1>Know what is known.</h1><p className="page-subtitle">Every basketball claim should have a source, date and status. Unavailable fields stay blank until verified.</p><div className="source-matrix"><div><span className="research ready">VERIFIED FACT</span><p>Directly supported by a dated source.</p></div><div><span className="research projection">PROJECTION</span><p>A reasoned assessment, open to challenge.</p></div><div><span className="research opinion">YOUR VIEW</span><p>A saved scouting note or preference.</p></div><div><span className="research">UNAVAILABLE</span><p>No claim is made without evidence.</p></div></div><div className="section-title"><div><h2>Connected research snapshots</h2><p>Manually verified on November 3, 2026. These are not live feeds.</p></div></div><div className="source-list">{data.sources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer"><div><strong>{s.name}</strong><span>{s.coverage}</span></div><div><time>Checked {s.checkedAt}</time><ArrowRight size={17}/></div></a>)}</div><div className="notice warning"><CircleHelp size={18}/><div><strong>Research still needed:</strong> contracts, draft-pick ownership, advanced player stats, injuries, and current CBA trade rules. The app does not score trades or claim legality without them.</div></div></>}
        {['assets','trades','matchups','draft','compare'].includes(page) && <FutureModule page={page} navigate={navigate}/>}
      </div>
    </main>
  </div>;
}

function FutureModule({ page, navigate }: { page: Page; navigate: (page: Page, id?: string) => void }) {
  const content: Record<string, { title: string; description: string; needs: string[] }> = {
    assets: { title: 'Draft asset tracker', description: 'Pick ownership, swaps and protections need a verified transaction source before this board can make claims.', needs: ['Pick ownership by year', 'Protection terms and conveyance conditions', 'Source and update trail'] },
    trades: { title: 'Trade simulator', description: 'Two-sided trade analysis will follow verified salaries, draft assets and current CBA rules.', needs: ['Salary and contract feed', 'Verified pick inventory', 'Rules engine with uncertainty states'] },
    matchups: { title: 'Conference matchups', description: 'Opponent-aware analysis is next after team style and roster data are sourced.', needs: ['Current standings', 'Team style metrics', 'Playoff-path scenarios'] },
    draft: { title: 'Draft center', description: 'Prospect and pick decisions will be evaluated against each franchise’s timeline.', needs: ['Verified prospects', 'Pick ownership', 'Scouting notes and model inputs'] },
    compare: { title: 'Strategy comparison', description: 'Compare Dallas and Denver once their contract and draft context is reliable.', needs: ['Comparable team data', 'Transparent scoring weights', 'Side-by-side assumptions'] }
  };
  const item = content[page];
  return <><div className="eyebrow">ROADMAP / NEXT DATA LAYER</div><h1>{item.title}</h1><p className="page-subtitle">{item.description}</p><div className="future"><div className="future-icon"><Workflow size={34}/></div><div><span className="research">IN DEVELOPMENT</span><h2>Required before reliable recommendations</h2><ul>{item.needs.map(need => <li key={need}>{need}</li>)}</ul><p>We are keeping this section visible so the research path is clear. No trade, pick or player score is shown without verified inputs.</p><div className="future-actions"><button onClick={() => navigate('team', 'dallas-mavericks')}>Explore Dallas <ArrowRight size={16}/></button><button className="outline" onClick={() => navigate('workspace')}>Add your GM perspective</button></div></div></div></>;
}

createRoot(document.getElementById('root')!).render(<App/>);
