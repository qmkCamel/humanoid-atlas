import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?humanoids\.fyi$/,
  /^https:\/\/humanoid-atlas[a-z0-9-]*\.vercel\.app$/,
  /^https?:\/\/localhost(:\d+)?$/,
];

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const VALID_ARENAS = ['oems', 'suppliers', 'vla', 'investment', 'scenarios', 'components'];
const VALID_DIMENSIONS: Record<string, string[]> = {
  oems: ['best_overall'],
  suppliers: ['best_overall'],
  vla: ['best_overall'],
  investment: ['best_overall'],
  scenarios: ['best_overall'],
  components: ['best_overall'],
};
const DEFAULT_ELO = 1500;

interface RankingEntry {
  id: string;
  elo: number;
  votes: number;
  rank: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  const allowed = origin && ALLOWED_ORIGINS.some((p) => p.test(origin));
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin!);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  try {
    const arena = req.query.arena as string;
    const dimension = req.query.dimension as string;

    if (!arena || !VALID_ARENAS.includes(arena)) {
      return res.status(400).json({ error: 'Invalid arena type' });
    }
    if (!dimension) {
      return res.status(400).json({ error: 'Dimension required' });
    }
    const validDims = VALID_DIMENSIONS[arena];
    if (!validDims || !validDims.includes(dimension)) {
      return res.status(400).json({ error: `Invalid dimension for ${arena}` });
    }

    // For suppliers, include category in Redis key namespace
    const category = req.query.category as string | undefined;
    const keyPrefix = arena === 'suppliers' && category
      ? `arena:${arena}:${category}:${dimension}`
      : `arena:${arena}:${dimension}`;

    const eloKey = `${keyPrefix}:elo`;
    const votesKey = `${keyPrefix}:votes`;

    const [eloData, votesData] = await Promise.all([
      redis.hgetall<Record<string, number>>(eloKey),
      redis.hgetall<Record<string, number>>(votesKey),
    ]);

    const elos = eloData || {};
    const votes = votesData || {};

    // Merge all entity IDs from both hashes
    const allIds = new Set([...Object.keys(elos), ...Object.keys(votes)]);

    const rankings: RankingEntry[] = Array.from(allIds).map((id) => ({
      id,
      elo: elos[id] ?? DEFAULT_ELO,
      votes: votes[id] ?? 0,
      rank: 0,
    }));

    // Sort by Elo descending
    rankings.sort((a, b) => b.elo - a.elo);
    rankings.forEach((entry, i) => {
      entry.rank = i + 1;
    });

    res.setHeader('Cache-Control', 'no-store');

    return res.json({
      arena,
      dimension,
      rankings,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Arena leaderboard error:', err);
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }
}
