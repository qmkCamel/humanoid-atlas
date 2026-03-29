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

// OEM IDs — same set used in likes.ts
const OEM_IDS = [
  'apptronik', 'tesla', 'figure', 'agility', '1x', 'boston_dynamics', 'sunday', 'vibe',
  'unitree', 'booster', 'booster_k1', 'agibot', 'xpeng', 'engineai', 'ubtech', 'dexmate',
  'fourier', 'kepler', 'sanctuary_ai', 'noetix', 'dobot', 'limx', 'pudu',
  'astribot', 'magiclab', 'xiaomi', 'foundation_robotics', 'neura_4ne1', 'robotera',
  'fauna', 'vanar_robots', 'mentee_robotics', 'pal_robotics', 'engineered_arts',
  'pollen_robotics', 'clone_robotics', 'qinglong', 'unitree_h2',
];

// Supplier IDs grouped by component category (derived from relationships.ts)
const SUPPLIER_BY_CATEGORY: Record<string, string[]> = {
  motors: ['maxon', 'kollmorgen', 'cubemars', 'nidec', 'estun', 'moons'],
  reducers: ['harmonic_drive', 'nabtesco', 'leaderdrive'],
  compute: ['nvidia', 'intel', 'horizon_robotics', 'google_deepmind'],
  sensors_general: ['hesai', 'sony_sensors', 'ouster', 'orbbec', 'bosch_sensortec', 'stereolabs'],
  batteries: ['catl', 'panasonic_energy', 'byd_battery', 'lg_energy', 'samsung_sdi', 'molicel'],
  bearings: ['thk', 'skf', 'nsk'],
  screws: ['rollvis', 'ewellix', 'nanjing_kgm'],
  end_effectors: ['psyonic', 'sharpa', 'shadow_robot', 'orca_dexterity', 'robotis'],
  actuators_rotary: ['cubemars', 'estun', 'feetech'],
  pcbs: ['texas_instruments', 'infineon', 'samsung_electro', 'stmicro'],
};

// Flat list of all unique supplier IDs
const ALL_SUPPLIER_IDS = [...new Set(Object.values(SUPPLIER_BY_CATEGORY).flat())];

const VALID_CATEGORIES = Object.keys(SUPPLIER_BY_CATEGORY);

const VLA_IDS = [
  'helix_02', 'redwood_ai', 'tesla_nn', 'act_1_sunday', 'carbon_ai',
  'xpeng_vla', 'ubtech_brainnet', 'kepler_vla', 'gemini_robotics',
  'groot_n1', 'pi0', 'pi0_fast', 'pi05', 'pi06', 'openvla',
  'unifolm_vla', 'skild_brain', 'agibot_go1', 'molmoact',
];

const INVESTMENT_IDS = [
  'tesla', 'figure', 'neura_4ne1', 'ubtech', 'apptronik', 'boston_dynamics',
  'galbot', 'agibot', 'agility', 'galaxea', 'robotera', 'noetix', 'sunday',
  'fourier', 'engineai', 'unitree', 'sanctuary_ai', 'collaborative_robotics',
  '1x', 'dobot', 'magiclab', 'booster', 'mentee_robotics', 'fauna',
  'enchanted_tools', 'clone_robotics',
];

const COMPONENT_IDS = [
  'skeleton', 'motors', 'reducers', 'screws', 'bearings',
  'actuators_rotary', 'actuators_linear', 'batteries', 'compute',
  'pcbs', 'sensors_general', 'sensors_tactile', 'end_effectors',
  'displays', 'safety_standards',
];

const SCENARIO_IDS = [
  'china_rare_earth_ban', 'nvidia_china_restriction', 'harmonic_drive_shortage',
  'catl_battery_shortage', 'eu_machinery_early', 'us_china_tariff_100',
  'japan_deregulation', 'tesla_100k_quarter', 'unitree_ipo_doubles',
  'figure_acquires_motor_supplier', 'open_vla_surpasses_proprietary',
  'solid_state_batteries_mass', 'tendon_replaces_harmonic', 'sim_to_real_95',
];

const ARENA_ENTITIES: Record<string, string[]> = {
  oems: OEM_IDS,
  suppliers: ALL_SUPPLIER_IDS,
  vla: VLA_IDS,
  investment: INVESTMENT_IDS,
  components: COMPONENT_IDS,
  scenarios: SCENARIO_IDS,
};

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0].split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
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

    if (!arena || !ARENA_ENTITIES[arena]) {
      return res.status(400).json({ error: 'Invalid or unsupported arena type' });
    }
    if (!dimension) {
      return res.status(400).json({ error: 'Dimension required' });
    }

    const VALID_DIMENSIONS: Record<string, string[]> = {
      oems: ['best_overall'],
      suppliers: ['best_overall'],
      vla: ['best_overall'],
      investment: ['best_overall'],
      scenarios: ['best_overall'],
      components: ['best_overall'],
    };
    const validDims = VALID_DIMENSIONS[arena];
    if (!validDims || !validDims.includes(dimension)) {
      return res.status(400).json({ error: `Invalid dimension for ${arena}` });
    }

    // For suppliers arena, scope by category
    const category = req.query.category as string | undefined;
    let entities: string[];

    if (arena === 'suppliers') {
      if (!category || !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: 'Category required for suppliers arena', validCategories: VALID_CATEGORIES });
      }
      entities = SUPPLIER_BY_CATEGORY[category];
    } else {
      entities = ARENA_ENTITIES[arena];
    }

    if (entities.length < 2) {
      return res.status(400).json({ error: 'Not enough entities for matchup in this category' });
    }

    // For suppliers, include category in Redis key namespace
    const keyPrefix = arena === 'suppliers' && category
      ? `arena:${arena}:${category}:${dimension}`
      : `arena:${arena}:${dimension}`;

    // Get vote counts to weight toward less-voted entities
    const votesKey = `${keyPrefix}:votes`;
    const votesData = await redis.hgetall<Record<string, number>>(votesKey);
    const votes = votesData || {};

    // Weight selection: entities with fewer votes get higher probability
    const maxVotes = Math.max(1, ...Object.values(votes));
    const weights = entities.map((id) => {
      const v = votes[id] ?? 0;
      return maxVotes - v + 1; // Inverse weight; +1 so zero-vote entities get picked
    });
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    // Pick first entity weighted by inverse vote count
    let r = Math.random() * totalWeight;
    let pickA = entities.length - 1; // Default to last if float rounding prevents break
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) {
        pickA = i;
        break;
      }
    }

    // Pick second entity (exclude first), also weighted
    const remainingIds = entities.filter((_, i) => i !== pickA);
    const remainingWeights = weights.filter((_, i) => i !== pickA);
    const remainingTotal = remainingWeights.reduce((a, b) => a + b, 0);

    r = Math.random() * remainingTotal;
    let pickB = remainingIds.length - 1; // Default to last if float rounding prevents break
    for (let i = 0; i < remainingWeights.length; i++) {
      r -= remainingWeights[i];
      if (r <= 0) {
        pickB = i;
        break;
      }
    }

    const entityA = entities[pickA];
    const entityB = remainingIds[pickB];

    // Check if this IP already voted on this matchup for this dimension
    const ip = getClientIP(req);
    const matchupKey = [entityA, entityB].sort().join(':');
    const dedupKey = `${keyPrefix}:voted:${matchupKey}`;
    const alreadyVoted = await redis.sismember(dedupKey, ip);

    return res.json({
      entityA,
      entityB,
      alreadyVoted,
    });
  } catch (err) {
    console.error('Arena matchup error:', err);
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }
}
