<!-- Supplied by Veer on November 3, 2026. Implementation is staged in ROADMAP.md. -->

# Build Front Office AI — An AI-Powered NBA General Manager & Front Office Simulator
## 1. Project Overview
Build a professional, fully functional web application called Front Office AI.

Front Office AI is an AI-powered NBA front-office decision-making platform. Its purpose is to help users think and make decisions like an NBA general manager.

The application should analyze all 30 NBA franchises and help answer questions such as:
- What should this franchise do to become a championship contender?
- Should the team rebuild, retool, or compete for a championship?
- Which players should the team target?
- Which players should it trade away, retain, or develop?
- Which positions and skill sets does the team need?
- Should the team trade its future draft picks?
- What is its championship window?
- How does its roster match up against the other teams in its conference?
- Which potential trades make sense for both franchises?
- How should the team approach the draft?
- What decisions should the franchise make over the next three to five years?
The central philosophy:

The same player or trade can be an excellent decision for one franchise and a terrible decision for another.

Every recommendation must account for the individual franchise's roster, competitive timeline, salary situation, contracts, draft assets, player development, positional needs, playing style, and competition.

This should not be a generic NBA chatbot. It should be a data-driven front-office intelligence platform.

I am the product owner and basketball decision-maker. The AI is my analytical assistant. I want to be able to challenge its recommendations, input my own basketball knowledge, and have it reconsider its conclusions.

## 2. Development Instructions
Before building:
## 1. Inspect the existing project directory and determine whether any application or code already exists.
## 2. Identify the existing technology stack and reuse it when appropriate.
## 3. If this is a new project, select a modern, maintainable stack suitable for a professional web application.
## 4. Create a clear development plan.
## 5. Build the application in working stages rather than attempting to implement every feature superficially.
Important development requirements:
- Build a real application, not just a static mockup.
- Every major navigation element should work.
- Use a clean, professional, modern interface.
- Prioritize functionality, data accuracy, and usability.
- Use reusable components and a well-organized codebase.
- Make the application responsive.
- Include loading states, empty states, and error handling.
- Never fabricate statistics, contracts, draft-pick ownership, or trade information.
- Clearly distinguish verified information from estimates, projections, and assumptions.
- Do not leave important features as buttons that do nothing.
- Document setup instructions and required API keys.
- Keep the application easy to extend as new features are added.
I am not a programmer. Make sensible technical decisions independently, explain any necessary setup in plain English, and do not require me to manually write code.

If an external API, database, or AI service requires credentials, build the integration structure and explain exactly what credentials I need to provide. Do not pretend an integration works if it has not been configured.

## 3. NBA Data and Research Infrastructure
The quality of this product depends on the quality of its underlying information.

Create a data infrastructure that can support all 30 NBA teams.

The application should collect and maintain:
Team information
- Current roster
- Starting lineup
- Bench rotation
- Player ages
- Player positions and roles
- Team record
- Conference standings
- Recent performance
- Playoff history
- Coaching and playing philosophy
Player information
- Points, rebounds, assists
- Shooting percentages
- Three-point shooting
- Free-throw shooting
- Defensive statistics
- Advanced analytics
- Availability and injury information when reliably available
- Age and development trajectory
- Positional versatility
- Contract information
Contract and salary information
- Current salary
- Years remaining
- Guaranteed money
- Player options
- Team options
- Contract expiration
- Salary-cap implications
- Luxury-tax implications
- First and second apron implications
- Trade restrictions when applicable
Draft assets
- First-round picks
- Second-round picks
- Pick ownership
- Protected picks
- Pick swaps
- Picks owed to other teams
- Picks acquired from other teams
- Conditions attached to traded picks
Draft-pick ownership must be especially accurate. Never assume a team controls its own future pick simply because it originally owned it.
Data reliability
Every important data point should have:
- Source
- Date last updated
- Verification status
- Confidence level
Separate:
## 1. Verified facts
## 2. Statistical analysis
## 3. AI-generated projections
## 4. User-provided observations
## 5. Strategic assumptions
Use reliable sources and available data providers. Prioritize official NBA data, reliable basketball statistics databases, official team information, and authoritative contract and collective bargaining agreement information.

Build the data system so that new sources can be integrated later.

Do not invent missing data. Clearly label unavailable or unverified information.

## 4. Franchise Competitive Timeline Engine
This is one of the most important features.

Every NBA team should receive an evaluation of its current competitive position.

Classify franchises into the following categories:
## 1. Championship Mode — The franchise should prioritize maximizing its current championship window.
## 2. Competitive Development — The team is competitive but still developing its core.
## 3. Rebuilding — The team should prioritize young talent, draft assets, and long-term flexibility.
## 4. Retooling — The team has a foundation but needs meaningful roster changes.
## 5. Transition / Uncertain — The franchise has an unclear direction or is between competitive phases.
Do not force a team into a category when the situation is genuinely mixed. Allow weighted classifications or probabilities.

Evaluate:
- Age of the core
- Quality of franchise cornerstone players
- Current team performance
- Recent playoff results
- Future player development
- Contract commitments
- Draft-pick inventory
- Salary-cap flexibility
- Conference competition
- Championship probability
- Estimated competitive window
For every team, display:
- Competitive timeline
- Confidence in classification
- Estimated championship window
- Short-term objectives
- Medium-term objectives
- Long-term objectives
- Biggest strategic risks
- Recommended front-office approach
Explain WHY the team received its classification.

The classification should update when new information becomes available.

## 5. Team Dashboard
Create a dedicated dashboard for every NBA franchise.

Each dashboard should include:
Franchise overview
- Team name and logo
- Conference and division
- Current record and standings
- Competitive timeline
- Championship outlook
- General roster overview
Roster breakdown
Organize players by position, role, and importance.

Identify:
- Franchise cornerstone
- Primary stars
- Key starters
- Rotation players
- Young developmental players
- Potential trade candidates
- Players whose contracts create financial complications
Roster strengths
Examples:
- Elite playmaking
- Three-point shooting
- Rim protection
- Wing defense
- Rebounding
- Transition offense
- Half-court scoring
Roster weaknesses
Identify specific weaknesses rather than generic descriptions.

For example:
"The team lacks a long, athletic wing defender who can guard elite perimeter scorers, switch across multiple positions, and contribute offensively without requiring significant ball possession."
Team strategy
Explain what the franchise should prioritize over the next:
- Season
- Two to three years
- Five years
Draft assets and financial situation
Show future picks, ownership, protections, contracts, and cap considerations.

## 6. Player Valuation Engine
Create a player evaluation system that calculates three separate forms of value.
A. Basketball Value
How good is the player on the court?

Evaluate:
- Scoring
- Shooting
- Playmaking
- Rebounding
- Defense
- Versatility
- Efficiency
- Availability
- Role
- Impact on winning
- Advanced analytics
B. Contract Value
How favorable is the player's contract relative to his production?

Evaluate:
- Current salary
- Remaining contract years
- Guaranteed money
- Age
- Expected development or decline
- Production relative to salary
- Salary-cap implications
- Financial flexibility
C. Trade Value
How valuable would this player be in the trade market?

Evaluate:
- Basketball production
- Contract attractiveness
- Age and potential
- Years of team control
- Positional demand
- Market demand
- Number of potential buyers
- Contract risk
Do not confuse these three values.

A player can be an excellent basketball player but have poor trade value because of an expensive contract.

Show separate scores and explain the reasoning behind them.

Avoid presenting subjective AI-generated scores as objective facts.

## 7. Positional Needs and Roster Construction Engine
For every team, identify its actual roster needs.

Do not simply recommend that a team needs a point guard, shooting guard, small forward, power forward, or center.

Identify the specific skill sets required.

Examples:
- Point-of-attack perimeter defender
- Long, switchable wing defender
- Floor-spacing big
- Rim-protecting center
- Secondary playmaker
- Off-ball three-point shooter
- Backup center
- Bench scorer
- Rebounding forward
- Versatile two-way player
For every need, determine:
- Why the team needs it
- How urgent the need is
- Whether an existing player could fill the role
- Whether the team should address it through the draft, free agency, or trade
- What type of player would best fit
- Whether acquiring that player would block the development of younger players
Rank positional needs by priority.

## 8. Team Identity and Playing Style Engine
Analyze how each team plays basketball.

Evaluate:
Offensive identity
- Pace
- Three-point volume
- Three-point efficiency
- Rim pressure
- Transition offense
- Half-court offense
- Pick-and-roll usage
- Isolation scoring
- Ball movement
- Spacing
Defensive identity
- Switching ability
- Drop coverage
- Perimeter pressure
- Rim protection
- Defensive rebounding
- Defensive versatility
- Ability to defend multiple positions
Determine which player skill sets fit the team's existing identity.

Also evaluate whether the franchise should change its identity.

Allow the user to specify preferred team identities, including:
- Positionless basketball
- Defensive-minded
- High-volume three-point shooting
- Fast-paced transition offense
- Physical half-court basketball
- Switch-heavy defense
- Versatile two-way basketball
Do not assume the current system is automatically the best system.

## 9. Conference and Playoff Matchup Intelligence
This is a major feature.

A franchise should not construct its roster in isolation. It must account for the teams it is likely to face in its conference and potentially the NBA Finals.

For example, a team in the Eastern Conference may need to prepare for long, athletic, physical, wing-heavy opponents.

The system should analyze:
- Current conference standings
- Likely playoff teams
- Top conference contenders
- Potential playoff opponents
- Potential championship opponents
- Opponent offensive systems
- Opponent defensive systems
- Opponent roster size and length
- Athleticism
- Shooting
- Rim protection
- Rebounding
- Perimeter defense
- Positional versatility
For each franchise, identify:
## 1. Which opponents are most relevant to its championship path?
## 2. What are those opponents particularly good at?
## 3. What weaknesses could those opponents expose?
## 4. Which roster weaknesses would become more important in a playoff series?
## 5. Which player archetypes would help address those weaknesses?
For example:

A team may have adequate regular-season guard scoring but lack a long wing defender who can survive against elite playoff wings.

The system should recognize that distinction.

When evaluating potential acquisitions, explain:
- Whether the player improves the team's matchup against important opponents
- Whether the player improves overall roster versatility
- Whether the player creates any new weaknesses
- Whether the player can contribute in a playoff environment
- Whether the player's skill set complements the franchise's stars
Distinguish regular-season production from playoff usefulness.

Do not overreact to small head-to-head samples. Use broader statistical performance, player skill sets, tactical context, and available matchup evidence.

Important: Do not sacrifice overall roster quality just to beat one specific opponent. Optimize for the broader championship path.

## 10. AI Trade Simulator
Build a comprehensive trade simulator.

The user should be able to select a team and explore possible trades.

The system should identify realistic trade targets based on:
- Team needs
- Competitive timeline
- Contract situation
- Draft assets
- Player availability, where verifiable
- Potential trade partners
- Positional fit
- Conference competition
For every proposed trade, display:
Trade details
- Teams involved
- Players exchanged
- Draft picks exchanged
- Pick protections
- Contract information
- Salary implications
Evaluation for Team A
- Basketball impact
- Roster fit
- Positional needs addressed
- Competitive timeline impact
- Financial implications
- Long-term effects
- Risks
Evaluation for Team B
Perform the same analysis independently.

A trade should make strategic sense for both franchises.
Trade scoring
Evaluate:
- Basketball value
- Contract value
- Strategic fit
- Timeline fit
- Positional needs
- Draft-asset cost
- Long-term flexibility
- Risk
Important trade rules
Keep these questions separate:
## 1. Is the trade legal under the NBA collective bargaining agreement?
## 2. Does the trade make basketball sense?
## 3. Does the trade make strategic sense for both franchises?
## 4. Is the trade realistically likely to happen?
Salary matching does not automatically make a trade realistic.

Account for salary-matching rules, trade restrictions, apron rules, and other applicable CBA requirements.

If a trade's legality or pick ownership cannot be verified, label it unverified.

Never present speculative trade rumors as confirmed negotiations.

Include a clear explanation of why the other franchise might accept or reject the deal.

## 11. NBA Draft Strategy Engine
Build a draft evaluation system.

The system should help determine whether a franchise should:
- Keep its current pick
- Trade up
- Trade down
- Trade the pick for an established player
- Draft the best available player
- Draft based on positional need
Evaluate prospects based on:
- Age
- Height and physical profile
- Position
- Shooting
- Defense
- Playmaking
- Rebounding
- Athleticism
- Basketball IQ
- Production
- Development potential
- Role projection
- Team-system fit
Most importantly, evaluate the prospect against the franchise's competitive timeline.

A rebuilding team may prioritize upside.

A championship contender may prioritize NBA readiness and immediate contribution.

A team with a young cornerstone may prioritize players who complement that player's strengths and development.

Do not allow immediate positional needs to automatically outweigh long-term asset value.

## 12. AI General Manager
Create a conversational AI GM interface.

The user should be able to select an NBA franchise and ask questions.

Examples:
- What should this team do this offseason?
- What is its biggest weakness?
- Which three players should it target?
- Should it trade its first-round pick?
- Which players should it consider moving?
- What is its championship window?
- Which young players need more minutes?
- What should its five-year plan look like?
- What happens if we trade our starting center?
- Which teams would be good trade partners?
- Find three realistic wing defenders without sacrificing our best young assets.
The AI must use the selected franchise's actual roster, contracts, picks, and strategic profile.

It must not provide generic answers that could apply to every NBA team.

Recommendations should be supported by data and clearly explain the assumptions behind them.

Allow users to ask follow-up questions and challenge the AI's reasoning.

## 13. GM Workspace: Manual Input and Personal Basketball Intelligence
This is one of the most important features.

I want to contribute my own basketball knowledge and opinions.

I do not want the AI making every decision independently.

I should be able to function as the general manager while the AI functions as my analytical assistant.

Create a dedicated workspace where I can input:
- My opinion about a team's direction
- Players I believe are underrated or overrated
- Players I want to target
- Players I do not want to acquire
- Players I consider untouchable
- Players I think should be traded
- Positional needs I have identified
- My preferred playing style
- Draft preferences
- Scouting observations
- Coaching and rotation observations
- Player-development concerns
- Playoff matchup observations
- My opinion about potential trades
Allow free-text input.

Example:

"I don't think Denver needs another scoring guard. I think the bigger priority should be acquiring a longer wing defender who can guard the opposing team's best perimeter player and hit open threes without needing the ball."

The AI should take this observation seriously.
Human and AI perspectives
For important decisions, display three separate perspectives:

## 1. AI Perspective

The AI's original evaluation based on available data.

## 2. My Perspective

My scouting observations, strategic preferences, and manual inputs.

## 3. Combined Recommendation

The AI's revised recommendation after incorporating my perspective.

When I disagree with the AI:
## 1. Preserve the original AI recommendation.
## 2. Save my input.
## 3. Identify which assumptions or priorities changed.
## 4. Reevaluate the decision.
## 5. Explain how my input affected the result.
## 6. Display the revised recommendation.
## 7. Explain any remaining disagreement.
Never silently overwrite the original AI analysis.

Keep verified statistics separate from my subjective observations.
Persistent GM Profile
Save my basketball preferences and observations so that they remain available when I return to the application.

Allow me to create team-specific notes and revisit previous decisions.

Eventually, allow the system to compare previous recommendations with actual outcomes.

## 14. Decision Scoring and Recommendation Engine
Create a transparent scoring framework.

A starting model could use:
- Competitive timeline fit: 25%
- Basketball impact: 20%
- Positional and roster fit: 15%
- Contract and salary impact: 15%
- Draft-pick and asset cost: 15%
- Risk and long-term flexibility: 10%
These weights should be configurable.

Do not treat the initial weights as scientifically established. Make it possible to adjust them and explain their influence.

For each recommendation, show:
- Overall score
- Individual category scores
- Key supporting evidence
- Main assumptions
- Risks
- Confidence level
- Alternative options
Allow users to understand why a recommendation received its score.

Avoid false precision.

## 15. Strategy Comparison
Allow users to compare different franchises and their approaches to similar situations.

Examples:
- Should Dallas and Denver approach the same trade differently?
- Which team should be more willing to trade a first-round pick?
- Which franchise has more urgency to acquire a veteran?
- Which team has the better long-term outlook?
- Which franchise is better positioned for the next three seasons?
Show how competitive timelines, contracts, assets, and roster construction change the decision.

## 16. Application Navigation and Interface
Build a polished application with a professional basketball front-office aesthetic.

The design should feel like a combination of:
- An NBA front-office analytics platform
- A professional sports data dashboard
- A modern AI research workspace
Avoid an overly playful fantasy-basketball appearance.

Use clear navigation and intuitive layouts.

Create the following main sections:
## 1. League Dashboard
Overview of all 30 teams, competitive timelines, standings, and championship outlook.
## 2. Team Dashboard
Detailed franchise analysis, roster, contracts, needs, picks, and strategy.
## 3. Player Database
Searchable player database with basketball, contract, and trade valuations.
## 4. Draft Asset Tracker
Future draft picks, ownership, protections, and swaps.
## 5. Trade Simulator
Trade construction and two-sided evaluation.
## 6. AI General Manager
Conversational franchise-specific AI assistant.
## 7. Conference Matchups
Playoff competition, opponent analysis, and roster matchup intelligence.
## 8. Draft Center
Prospect evaluation and team-specific draft strategy.
## 9. Strategy Comparison
Compare teams, potential decisions, and long-term plans.
## 10. GM Workspace
My scouting notes, manual inputs, preferences, and decision history.
## 11. Research and Sources
Show where information comes from, when it was updated, and how reliable it is.

Make the application easy to navigate between a team's dashboard, player profiles, trade simulator, and AI GM.

## 17. Recommendation Quality and Reliability
The system must prioritize accuracy over sounding confident.

Never:
- Invent player statistics.
- Invent contract terms.
- Invent draft-pick ownership.
- Claim a trade is legal without checking the relevant rules.
- Treat trade rumors as confirmed facts.
- Present projections as facts.
- Recommend players without considering team fit.
- Ignore the other franchise's incentives.
- Assume a team's strategy is permanent.
- Treat a player's scoring average as the only measure of value.
Every major recommendation should explain:
## 1. What the system recommends.
## 2. Why it recommends it.
## 3. What evidence supports the recommendation.
## 4. What the team gives up.
## 5. What risks are involved.
## 6. What alternatives exist.
## 7. How confident the system is.
When information is unavailable, say so.

## 18. Development Roadmap and Priorities
Do not attempt to build every advanced feature at once.

Build a working foundation first.
Phase 1: Core Application
Build:
- Professional interface
- Navigation
- League dashboard
- All 30 team profiles
- Team dashboard
- Initial competitive timeline classifications
- Data architecture
- Source and update tracking
Phase 2: Basketball Intelligence
Build:
- Player database
- Player valuation
- Positional needs
- Team identity analysis
- Draft-pick tracker
- Contract information
Phase 3: AI Front Office
Build:
- AI GM chat
- Franchise-specific recommendations
- Decision scoring
- Strategy comparison
- Trade simulator
- Draft strategy engine
Phase 4: Advanced Intelligence
Build:
- Conference matchup analysis
- Playoff opponent analysis
- Matchup-specific player recommendations
- Advanced roster construction
- Scenario simulations
- Championship-window projections
Phase 5: Human GM Integration
Build:
- GM Workspace
- Manual scouting input
- Personal team preferences
- AI-versus-user comparison
- Combined recommendations
- Persistent decision history
Prioritize a working product over a large collection of incomplete features.

## 19. First Assignment
Start by creating the application foundation.

I want the first working version to include:
## 1. A professional landing/dashboard experience.
## 2. Navigation between all major application sections.
## 3. An overview of all 30 NBA teams.
## 4. A detailed team dashboard.
## 5. Competitive timeline classifications.
## 6. A basic player database.
## 7. A team-specific AI GM interface.
## 8. A working GM Workspace where I can submit my own basketball opinions and save them.
## 9. A source and data reliability system.
Use two franchises as initial test cases:
- Dallas Mavericks
- Denver Nuggets
These should be used to test whether the platform understands that different franchises require different strategies.

Do not hardcode permanent assumptions about either team. Use current verified information to determine their actual competitive situations.

Once the foundation works, expand the system to all 30 teams and implement the remaining modules.

## 20. Product Owner Instructions
I am the product owner.

I will contribute:
- Basketball knowledge
- Scouting observations
- Strategic opinions
- Product feedback
- Feature ideas
- Testing and evaluation
You are responsible for:
- Technical architecture
- Application development
- Data integrations
- AI integrations
- Database structure
- UI implementation
- Testing
- Documentation
Do not assume that I know how to code.

When you need a decision from me, ask a clear, specific question in plain English. Otherwise, make a sensible decision and continue building.

Keep a project README, development roadmap, and changelog updated.

At the end of each development stage, tell me:
- What you built
- What currently works
- What data sources are connected
- What still needs configuration
- What you recommend building next
Final objective: Build a serious AI-powered NBA front-office intelligence platform that combines real basketball data, franchise-specific strategy, trade and roster analysis, playoff matchup intelligence, and my own basketball judgment.

The application should help me think like an NBA general manager, not simply tell me which players are good.
