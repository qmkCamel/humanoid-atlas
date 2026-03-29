# Atlas Arena

A community-driven ranking system for the humanoid robotics industry. Users vote in head-to-head matchups across six arenas; votes feed an Elo-based leaderboard that surfaces crowd consensus on robots, suppliers, models, investments, scenarios, and components.

Inspired by [Robo Arena](https://robo-arena.github.io/) (arXiv 2506.18123) — distributed pairwise evaluation applied to generalist robot policies.

---

## Parent Tab

**Arena** (`/arena`) — new top-level tab group alongside Overview, Industry, Hardware, Software, HRI, CLI, API.

Sub-tabs:

| Sub-Tab | Route | Data Source |
|---|---|---|
| OEM Arena | `/arena/oems` | `companies.ts` (type: oem) |
| Supplier Arena | `/arena/suppliers` | `companies.ts` (type: component_maker/tier1_supplier), `relationships.ts` |
| VLA Arena | `/arena/vla` | `vlaModels.ts` |
| Investment Arena | `/arena/investment` | `funding.ts` |
| Scenario Arena | `/arena/scenarios` | Geopolitics simulation data |
| Component Arena | `/arena/components` | `components.ts` |

---

## 1. OEM Arena (`/arena/oems`)

Head-to-head matchups between humanoid robots. Two OEMs shown side-by-side with specs pulled from `robotSpecs`.

### Voting Dimensions

- **Best Specs** — hardware capability (DOF, speed, payload, operating time)
- **Best Value** — price-to-capability ratio (BOM, price vs specs)
- **Most Production-Ready** — shipments, factory capacity, status
- **Best Design** — aesthetics, form factor, head design

### Matchup Card Content

| Field | Source |
|---|---|
| Robot image | `company.robotImage` |
| Name / Country | `company.name`, `company.country` |
| Status | `robotSpecs.status` |
| Height / Mass | `robotSpecs.height`, `robotSpecs.mass` |
| DOF | `robotSpecs.totalDOF` |
| Speed | `robotSpecs.speed` |
| Operating Time | `robotSpecs.operatingTime` |
| Payload | `robotSpecs.payloadCapacity` |
| Price | `robotSpecs.price` |
| BOM | `robotSpecs.bom` |
| 2025 Shipments | `robotSpecs.shipments2025` |

### Leaderboard

Elo score, standard deviation, total votes, per-dimension rankings. Table view + chart view with error bars.

---

## 2. Supplier Arena (`/arena/suppliers`)

Pairwise comparisons of competing suppliers within the same component category.

### Matchup Rules

- Only suppliers in the same `componentCategoryId` are matched (e.g., Maxon vs Kollmorgen for motors, Harmonic Drive vs LeaderDrive for reducers)
- Category filter lets users focus on one supply chain segment

### Voting Dimensions

- **Best Performance** — spec quality, reliability
- **Best Value** — cost efficiency
- **Most Strategically Important** — supply chain criticality, geographic diversification

### Matchup Card Content

| Field | Source |
|---|---|
| Supplier name / Country | `company.name`, `company.country` |
| Market share | `company.marketShare` |
| Ticker | `company.ticker` |
| Description | `company.description` |
| OEM customers | Derived from `relationships.ts` (count + names of OEMs this supplier feeds) |
| Component category | From `componentCategoryId` on relationships |

---

## 3. VLA Arena (`/arena/vla`)

Pairwise matchups of the 31+ Vision-Language-Action models tracked in Atlas.

### Voting Dimensions

- **Most Capable** — generalization, task diversity, benchmark performance
- **Most Deployable** — availability, integration ease, hardware requirements
- **Best Open-Source Option** — only open/ecosystem models eligible

### Matchup Card Content

| Field | Source |
|---|---|
| Model name | `vlaModel.name` |
| Developer | `vlaModel.developer` |
| Country | `vlaModel.country` |
| Relationship type | `vlaModel.relationshipType` (proprietary/partner/open/ecosystem) |
| Release date | `vlaModel.release` |
| Focus | `vlaModel.focus` |
| Availability | `vlaModel.availability` |
| Description | `vlaModel.description` |
| OEM integrations | `vlaModel.companyLinks` |

### Robo Arena Integration

Where a VLA model overlaps with a policy evaluated on Robo Arena, link to the corresponding A/B evaluation video or embed it.

---

## 4. Investment Arena (`/arena/investment`)

Crowd-sourced investment sentiment. Two companies shown with funding data; users vote on which is the better bet.

### Voting Dimensions

- **Best Long-Term Bet** — 5+ year horizon
- **Best Near-Term ROI** — 1-2 year horizon
- **Most Undervalued** — valuation vs potential

### Matchup Card Content

| Field | Source |
|---|---|
| Company name / Country | `companyFunding.name`, `companyFunding.country` |
| Status | `companyFunding.status` (private/public/ipo-filed) |
| Ticker | `companyFunding.ticker` |
| Total raised | `companyFunding.totalRaisedM` |
| Latest valuation | `companyFunding.latestValuationM` |
| 2025 Revenue | `companyFunding.revenue2025M` |
| Key investors | `companyFunding.keyInvestors` |
| Latest round | Most recent entry in `companyFunding.rounds` |
| IPO plans | `companyFunding.ipoPlans` |

---

## 5. Scenario Arena (`/arena/scenarios`)

Present two geopolitical or supply chain scenarios and let users vote on which is more impactful to the industry.

### Scenario Types

- **Supply disruption**: "China bans rare earth exports" vs "US restricts NVIDIA chip sales to CN"
- **Policy shift**: "EU Machinery Regulation enforced early" vs "US deregulates humanoid deployment"
- **Market event**: "Tesla ships 100K Optimus units" vs "Unitree IPO raises $1B"
- **OEM resilience**: "Which OEM survives [Scenario X] better?" (two OEMs under the same scenario)

### Voting Dimensions

- **Most Impactful** — which scenario causes greater industry disruption
- **Most Likely** — which scenario is more plausible

### Matchup Card Content

- Scenario title and description
- Affected companies (derived from existing geopolitics/relationship data)
- Affected component categories
- Estimated supply chain impact summary

### Data Source

Scenarios can be seeded from a new `scenarios.ts` data file or generated dynamically from existing geopolitics simulation parameters.

---

## 6. Component Arena (`/arena/components`)

Which component category matters most to the humanoid robotics industry?

### Voting Dimensions

- **Biggest Bottleneck** — most constrained supply
- **Most Innovation Potential** — room for breakthroughs
- **Most Cost Reduction Opportunity** — where cost savings unlock scale

### Matchup Card Content

| Field | Source |
|---|---|
| Category name | `componentCategory.name` |
| Description | `componentCategory.description` |
| Avg cost % of BOM | `componentCategory.avgCostPercent` |
| Bottleneck status | `componentCategory.bottleneck` |
| Bottleneck reason | `componentCategory.bottleneckReason` |
| Key metrics | `componentCategory.keyMetrics` |
| Supplier count | Derived from `relationships.ts` |

---

## Shared Infrastructure

### Elo Rating System

- Standard Elo with K-factor tuning per arena (higher K for new entities, lower as votes accumulate)
- Per-arena and per-dimension leaderboards
- Standard deviation tracked for confidence intervals
- Minimum vote threshold before appearing on leaderboard (e.g., 10 votes)

### Matchup Selection

- Random pairing by default
- Weighted toward entities with fewer votes (balances coverage)
- Category-scoped for Supplier Arena
- No repeat matchups for the same user within a session

### Voting Mechanics

- One vote per matchup per user (IP-dedup for anonymous, user-id dedup for authenticated)
- Anonymous voting supported (extends existing Redis + IP pattern from `api/likes.ts`)
- Authenticated users (Clerk) get richer features: vote history, streaks, profile stats
- Optional: brief text explanation with vote (like Robo Arena's evaluator feedback)

### Leaderboard Views

- **Table view**: Rank, name, Elo score, SD, vote count, trend arrow (weekly delta)
- **Chart view**: Interactive Elo chart with error bars (score +/- SD)
- **Weekly / All-Time toggle**: See how rankings shift over time
- **Crowd vs Data overlay**: Compare community Elo rankings against objective metrics (shipments, funding, specs)

### Backend

- **Vote storage**: Upstash Redis (extends existing pattern)
  - Hash per arena: `arena:{arenaType}:elo` — current Elo scores
  - Sorted set: `arena:{arenaType}:votes` — vote count per entity
  - Set per user/IP: `arena:{arenaType}:voted:{matchupId}` — dedup
  - List: `arena:{arenaType}:history` — recent matchup results for trend calculation
- **Elo computation**: Server-side in Vercel function on each vote
- **Leaderboard API**: New `/api/arena/leaderboard?type={arenaType}&dimension={dim}` endpoint
- **Vote API**: New `/api/arena/vote` endpoint (POST)
- **Matchup API**: New `/api/arena/matchup?type={arenaType}` endpoint (GET — returns random pair)

### UI Components

- `MatchupCard` — side-by-side entity display with vote buttons per dimension
- `ArenaLeaderboard` — table + chart toggle with dimension filter
- `VoteConfirmation` — post-vote state showing current Elo delta and leaderboard position
- `ArenaNav` — sub-tab navigation within the Arena tab group

---

## Phase 1: OEM Arena

The OEM Arena is the natural starting point — it uses the richest existing data, maps to the most intuitive comparison (robot vs robot), and directly extends the existing OEM catalog and likes system.

### Step 1: Backend — Vote & Elo API

Create two new Vercel serverless functions:

**`POST /api/arena/vote`**
```
Body: { arena: "oems", entityA: string, entityB: string, winner: "A" | "B" | "tie", dimension: string }
Response: { eloA: number, eloB: number, deltaA: number, deltaB: number }
```

- Validate arena type and entity IDs against known data
- Compute Elo update (K=32 initially)
- Store in Redis: update Elo hash, increment vote counts, record in history list
- IP-based dedup (reuse pattern from `api/likes.ts`)

**`GET /api/arena/leaderboard`**
```
Query: ?arena=oems&dimension=best_specs
Response: { rankings: [{ id, name, elo, sd, votes, rank }], lastUpdated: string }
```

- Read Elo hash and vote counts from Redis
- Compute SD from recent history
- Return sorted by Elo descending

**`GET /api/arena/matchup`**
```
Query: ?arena=oems
Response: { entityA: Company, entityB: Company }
```

- Select random pair, weighted toward entities with fewer votes
- Exclude recently shown pairs for the same IP

### Step 2: Frontend — Matchup UI

Add the Arena tab group to `App.tsx`:
- New entries in `TAB_TO_PATH` / `PATH_TO_TAB` / tab group definitions
- New `arena` tab group with `oems` as the initial sub-tab

Build the matchup view:
- Two OEM cards side-by-side showing robot image, key specs, country flag
- Dimension selector (Best Specs / Best Value / Most Production-Ready / Best Design)
- Vote buttons on each card + "Tie" button in the middle
- Post-vote animation showing Elo delta and "Next matchup" button
- Mobile: stack cards vertically

### Step 3: Frontend — Leaderboard

Below the matchup area (or as a toggle):
- Table view: rank, robot image, name, Elo, SD, votes, trend
- Chart view: horizontal bar chart or dot plot with error bars
- Dimension filter tabs
- Weekly / All-Time toggle

### Step 4: Polish & Ship

- Add Arena link to footer and header navigation
- Seed initial Elo scores at 1500 for all OEMs
- Add meta tags / SEO for `/arena/oems`
- Test vote dedup, Elo convergence, and leaderboard rendering
- Deploy to Vercel

### Phase 1 Deliverable

A fully functional OEM Arena where users can vote on robot-vs-robot matchups across 4 dimensions, with a live Elo leaderboard. Infrastructure (vote API, Elo computation, matchup selection) is reusable for all subsequent arenas in phases 2-6.

---

## Future Phases

| Phase | Arena | Notes |
|---|---|---|
| 2 | Supplier Arena | Add category-scoped matchups, reuse Phase 1 infra |
| 3 | VLA Arena | Add Robo Arena video embeds where available |
| 4 | Investment Arena | Add funding data cards, sentiment tracking |
| 5 | Component Arena | Simplest data model, fast to ship |
| 6 | Scenario Arena | Requires new `scenarios.ts` seed data |
