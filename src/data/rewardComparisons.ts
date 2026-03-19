/**
 * Pre-computed reward model scores for demo trajectories.
 * Each demo has scores from multiple models at uniformly-spaced time points.
 * scores[i] maps to normalized_time = i / (numFrames - 1).
 */

export interface RewardModelScores {
  id: string;        // matches rewardModels.ts id where applicable
  name: string;
  color: string;
  dashPattern: number[];  // [] = solid, [8,3] = dashed, etc.
  scores: number[];       // progress 0-1, one per frame
  voc: number;
}

export interface RewardComparison {
  id: string;
  instruction: string;
  videoUrl: string;
  numFrames: number;
  models: RewardModelScores[];
}

export const rewardComparisons: RewardComparison[] = [
  {
    id: 'sweater_inversion',
    instruction: 'Retrieve the collar and correctly invert the plain sweater',
    videoUrl: '/demos/sweater_inversion.mp4',
    numFrames: 10,
    models: [
      {
        id: 'gvl',
        name: 'GVL',
        color: '#4A90D9',
        dashPattern: [6, 3],
        scores: [0.0, 0.7, 0.5, 0.4, 0.9, 0.3, 0.2, 0.8, 0.6, 0.1],
        voc: -0.72,
      },
      {
        id: 'bruteforce_vlm',
        name: 'BruteforceVLM',
        color: '#4AC48A',
        dashPattern: [3, 3],
        scores: [0.5, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.6, 0.6, 0.6],
        voc: 0.62,
      },
      // GPU models (pending A100 run):
      // { id: 'topreward', name: 'TOPReward', color: '#DC2828', dashPattern: [], scores: [...], voc: ... },
      // { id: 'robometer', name: 'Robometer', color: '#A064DC', dashPattern: [8, 3], scores: [...], voc: ... },
      // { id: 'roboreward', name: 'RoboReward', color: '#F5761A', dashPattern: [5, 3], scores: [...], voc: ... },
    ],
  },
  {
    id: 'gpu_rail_insert',
    instruction: 'Insert the rail into the gpu',
    videoUrl: '/demos/gpu_rail_insert.mp4',
    numFrames: 10,
    models: [
      {
        id: 'gvl',
        name: 'GVL',
        color: '#4A90D9',
        dashPattern: [6, 3],
        scores: [0.8, 0.6, 0.5, 0.1, 0.9, 0.5, 0.4, 0.2, 0.3, 0.7],
        voc: -0.30,
      },
      {
        id: 'bruteforce_vlm',
        name: 'BruteforceVLM',
        color: '#4AC48A',
        dashPattern: [3, 3],
        scores: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.5, 0.5, 0.6],
        voc: 0.87,
      },
    ],
  },
  {
    id: 'tshirt_fold',
    instruction: 'Fold the t-shirt',
    videoUrl: '/demos/tshirt_fold.mp4',
    numFrames: 10,
    models: [
      {
        id: 'gvl',
        name: 'GVL',
        color: '#4A90D9',
        dashPattern: [6, 3],
        scores: [0.6, 0.3, 0.0, 0.2, 0.4, 0.7, 0.8, 0.5, 0.9, 0.1],
        voc: 0.26,
      },
      {
        id: 'bruteforce_vlm',
        name: 'BruteforceVLM',
        color: '#4AC48A',
        dashPattern: [3, 3],
        scores: [0.2, 0.3, 0.3, 0.4, 0.4, 0.5, 0.5, 0.5, 0.6, 0.8],
        voc: 0.98,
      },
    ],
  },
];
