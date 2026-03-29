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

const VALID_ARENAS = ['oems', 'suppliers', 'vla', 'investment', 'scenarios', 'components'] as const;
type ArenaType = (typeof VALID_ARENAS)[number];

const VALID_DIMENSIONS: Record<ArenaType, string[]> = {
  oems: ['best_overall'],
  suppliers: ['best_overall'],
  vla: ['best_overall'],
  investment: ['best_overall'],
  scenarios: ['best_overall'],
  components: ['best_overall'],
};

const DEFAULT_ELO = 1500;
const K_FACTOR = 32;

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0].split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function computeElo(
  ratingA: number,
  ratingB: number,
  winner: 'A' | 'B' | 'tie'
): { newA: number; newB: number; deltaA: number; deltaB: number } {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 - expectedA;

  let scoreA: number, scoreB: number;
  if (winner === 'A') {
    scoreA = 1;
    scoreB = 0;
  } else if (winner === 'B') {
    scoreA = 0;
    scoreB = 1;
  } else {
    scoreA = 0.5;
    scoreB = 0.5;
  }

  const deltaA = Math.round(K_FACTOR * (scoreA - expectedA));
  const deltaB = Math.round(K_FACTOR * (scoreB - expectedB));

  return {
    newA: ratingA + deltaA,
    newB: ratingB + deltaB,
    deltaA,
    deltaB,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  const allowed = origin && ALLOWED_ORIGINS.some((p) => p.test(origin));
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin!);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { arena, entityA, entityB, winner, dimension, category } = req.body || {};

    // Validate arena
    if (!arena || !VALID_ARENAS.includes(arena)) {
      return res.status(400).json({ error: 'Invalid arena type' });
    }

    // Validate entities
    if (!entityA || !entityB || typeof entityA !== 'string' || typeof entityB !== 'string') {
      return res.status(400).json({ error: 'Invalid entity IDs' });
    }
    if (entityA === entityB) {
      return res.status(400).json({ error: 'Cannot compare an entity to itself' });
    }

    // Validate winner
    if (!winner || !['A', 'B', 'tie'].includes(winner)) {
      return res.status(400).json({ error: 'Invalid winner (must be A, B, or tie)' });
    }

    // Validate dimension
    const validDims = VALID_DIMENSIONS[arena as ArenaType];
    if (!dimension || !validDims.includes(dimension)) {
      return res.status(400).json({ error: `Invalid dimension for ${arena}` });
    }

    // Validate category for suppliers arena
    if (arena === 'suppliers' && (!category || typeof category !== 'string')) {
      return res.status(400).json({ error: 'Category required for suppliers arena' });
    }

    // Build Redis key prefix (include category for suppliers)
    const keyPrefix = arena === 'suppliers' && category
      ? `arena:${arena}:${category}:${dimension}`
      : `arena:${arena}:${dimension}`;

    // Dedup by IP + matchup
    const ip = getClientIP(req);
    const matchupKey = [entityA, entityB].sort().join(':');
    const dedupKey = `${keyPrefix}:voted:${matchupKey}`;
    const alreadyVoted = await redis.sismember(dedupKey, ip);
    if (alreadyVoted) {
      return res.status(409).json({ error: 'Already voted on this matchup' });
    }

    // Get current Elo ratings
    const eloKey = `${keyPrefix}:elo`;
    const [currentA, currentB] = await Promise.all([
      redis.hget<number>(eloKey, entityA),
      redis.hget<number>(eloKey, entityB),
    ]);

    const ratingA = currentA ?? DEFAULT_ELO;
    const ratingB = currentB ?? DEFAULT_ELO;
    const { newA, newB, deltaA, deltaB } = computeElo(ratingA, ratingB, winner);

    // Record vote + update Elo + increment vote counts atomically via pipeline
    const votesKey = `${keyPrefix}:votes`;
    const historyKey = `${keyPrefix}:history`;
    const historyEntry = JSON.stringify({
      entityA,
      entityB,
      winner,
      deltaA,
      deltaB,
      ts: Date.now(),
    });

    const pipeline = redis.pipeline();
    pipeline.sadd(dedupKey, ip);
    pipeline.hset(eloKey, { [entityA]: newA, [entityB]: newB });
    pipeline.hincrby(votesKey, entityA, 1);
    pipeline.hincrby(votesKey, entityB, 1);
    pipeline.lpush(historyKey, historyEntry);
    pipeline.ltrim(historyKey, 0, 999); // Keep last 1000 entries
    await pipeline.exec();

    return res.json({
      entityA: { id: entityA, elo: newA, delta: deltaA },
      entityB: { id: entityB, elo: newB, delta: deltaB },
    });
  } catch (err) {
    console.error('Arena vote error:', err);
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }
}
