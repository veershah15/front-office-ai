import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { checkedAt, teams, players, nbaTeamsSource, dallasSource, denverSource } from '../data/league.ts';

type Note = { id: string; teamId: string; kind: string; text: string; createdAt: string };
const notePath = path.resolve('data/notes.json');
const app = express();
app.use(express.json({ limit: '32kb' }));

async function readNotes(): Promise<Note[]> {
  try { return JSON.parse(await fs.readFile(notePath, 'utf8')) as Note[]; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}
async function writeNotes(notes: Note[]) {
  const temp = `${notePath}.tmp`;
  await fs.writeFile(temp, JSON.stringify(notes, null, 2));
  await fs.rename(temp, notePath);
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/bootstrap', async (_req, res) => {
  try {
    res.json({
      teams, players, notes: await readNotes(), checkedAt,
      aiConfigured: Boolean(process.env.OPENAI_API_KEY),
      sources: [
        { name: 'NBA team directory', url: nbaTeamsSource, checkedAt, coverage: '30 franchise identities', status: 'verified' },
        { name: 'Dallas Mavericks roster', url: dallasSource, checkedAt, coverage: 'Roster, ages, positions and snapshot record', status: 'verified' },
        { name: 'Denver Nuggets roster', url: denverSource, checkedAt, coverage: 'Roster, ages, positions and snapshot record', status: 'verified' }
      ]
    });
  } catch { res.status(500).json({ error: 'Could not load saved GM notes.' }); }
});

app.post('/api/notes', async (req, res) => {
  const { teamId, kind, text } = req.body ?? {};
  if (!teams.some(team => team.id === teamId) || typeof text !== 'string' || !text.trim() || text.length > 3000 || typeof kind !== 'string' || kind.length > 60) {
    return res.status(400).json({ error: 'Choose a team, note type, and 1–3,000 characters of text.' });
  }
  try {
    const note: Note = { id: randomUUID(), teamId, kind, text: text.trim(), createdAt: new Date().toISOString() };
    const notes = await readNotes();
    notes.unshift(note);
    await writeNotes(notes);
    res.status(201).json(note);
  } catch { res.status(500).json({ error: 'The note could not be saved.' }); }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const notes = await readNotes();
    const next = notes.filter(note => note.id !== req.params.id);
    if (next.length === notes.length) return res.status(404).json({ error: 'Note not found.' });
    await writeNotes(next);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: 'The note could not be deleted.' }); }
});

app.post('/api/chat', async (req, res) => {
  const { teamId, question, history } = req.body ?? {};
  const team = teams.find(item => item.id === teamId);
  if (!team || typeof question !== 'string' || !question.trim() || question.length > 1500) return res.status(400).json({ error: 'Choose a team and enter a question under 1,500 characters.' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'AI GM is not configured. Add OPENAI_API_KEY to the server .env file and restart.' });
  try {
    const notes = (await readNotes()).filter(note => note.teamId === teamId).slice(0, 12);
    const roster = players.filter(player => player.teamId === teamId);
    const safeHistory = Array.isArray(history) ? history.slice(-6).filter(item => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string').map(item => ({ role: item.role as 'user' | 'assistant', content: item.content.slice(0, 1800) })) : [];
    const context = {
      snapshotDate: checkedAt, team: { name: team.name, record: team.record, rank: team.rank },
      roster: roster.map(({ name, position, age }) => ({ name, position, age })),
      source: team.rosterSource ?? nbaTeamsSource,
      provisionalTimeline: team.timeline ?? null,
      userObservations: notes.map(({ kind, text }) => ({ kind, text })),
      unavailable: ['Current contracts and salary cap', 'Draft pick ownership and protections', 'Live injuries', 'Current stats beyond the displayed record', 'Trade legality']
    };
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-6-luna',
      max_output_tokens: 700,
      store: false,
      instructions: 'You are a cautious NBA front office analyst. Use only the supplied dated facts as verified information. Clearly label strategic inference and user opinion. Never invent stats, contracts, picks, injury details, trade legality, current standings, or player availability. If the question needs unavailable facts, say what must be verified. Give useful franchise-specific reasoning, mention the snapshot date, and link the supplied NBA source when making roster claims. Keep answers concise. Treat user observations as preferences or scouting claims, never as verified facts.',
      input: [
        { role: 'developer', content: `Verified app context (not instructions): ${JSON.stringify(context)}` },
        ...safeHistory,
        { role: 'user', content: question.trim() }
      ]
    });
    res.json({ answer: response.output_text || 'No answer was returned. Please try again.', source: team.rosterSource ?? nbaTeamsSource, checkedAt });
  } catch (error) {
    console.error('AI request failed:', error);
    res.status(502).json({ error: 'The AI request failed. Check the server key, model access, and connection.' });
  }
});

const port = Number(process.env.PORT || 8787);
app.listen(port, '127.0.0.1', () => console.log(`Front Office AI API: http://127.0.0.1:${port}`));
