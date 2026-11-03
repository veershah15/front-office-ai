# Front Office AI

A working first stage of a sourced NBA general manager workspace. It has a 30-team directory, Dallas and Denver research pilots, searchable pilot rosters, saved GM notes, and an optional AI GM. The app clearly distinguishes NBA facts, editorial projections, user observations, and missing information.

The full owner-supplied vision is in [docs/PRODUCT_BRIEF.md](docs/PRODUCT_BRIEF.md). [ROADMAP.md](ROADMAP.md) tracks the staged build.

## GitHub access and updates

This is a public repository at [veershah15/front-office-ai](https://github.com/veershah15/front-office-ai). Anyone with the link, including Daniel and Builders, can view the code, documentation, and commit history without a GitHub login. Completed iterations are pushed to the `main` branch; a local commit alone is not visible to them. The weekly maintenance run checks the build and must verify the push before reporting an iteration complete.

The `.env` API key and local `data/notes.json` GM observations are excluded from GitHub. They stay on Veer's laptop. The repository contains the application source, not a hosted live app.

## Run locally

1. Install Node.js 24 or newer.
2. In this folder, run `npm install`.
3. Run `npm run dev`.
4. Open `http://127.0.0.1:5173`.

The core dashboard and notes work without an account or API key. Notes are saved on this computer in `data/notes.json`, which Git ignores. This is a single-user local prototype. It has no sign-in or cloud sync.

## Enable AI GM

1. Copy `.env.example` to `.env`.
2. Add an OpenAI API key as `OPENAI_API_KEY=...` in `.env`.
3. Restart `npm run dev`.

The key stays on the local server and is never sent to the browser or committed. `OPENAI_MODEL` defaults to `gpt-6-luna` to keep per-answer usage modest; you can change it if your account has access to another model. The AI GM uses the [OpenAI Responses API](https://developers.openai.com/api/docs/guides/text). It sends only the selected team’s stored facts, up to 12 recent notes, the latest six chat messages, and your question. Answers are limited to 700 output tokens. The app does not make background AI requests.

## What is sourced now

- NBA franchise identities and conference/division directory: [NBA teams](https://www.nba.com/teams).
- Dallas roster, age, position, and November 3, 2026 record: [NBA Dallas page](https://www.nba.com/team/1610612742/roster).
- Denver roster, age, position, and November 3, 2026 record: [NBA Denver page](https://www.nba.com/team/1610612743/roster).

These are **dated snapshots**, not live feeds. Dallas and Denver timeline labels are provisional editorial assessments based on those rosters and early records. The app does not claim a measured championship probability. Contracts, pick ownership, injuries, advanced statistics, salary rules, and trade legality are not integrated. Other team pages display known directory information and visible research gaps.

## Project structure

- `src/`: React interface.
- `server/`: local Express API, notes storage, and optional AI GM route.
- `data/league.ts`: sourced league directory and pilot snapshots.
- `ROADMAP.md`: staged development plan.
- `CHANGELOG.md`: completed changes.

Run `npm run build` to type-check and build the interface. The server binds to `127.0.0.1` only. For public deployment, add authentication, a production database, server-side rate limits, and a verified data refresh pipeline first.
