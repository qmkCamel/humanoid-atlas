import type { Scenario } from './types';

export const scenarios: Scenario[] = [
  // === SUPPLY DISRUPTION ===
  {
    id: 'china_rare_earth_ban',
    title: 'China bans rare earth exports to US',
    category: 'supply_disruption',
    description: 'China restricts NdFeB magnet and rare earth oxide exports to the United States. BLDC motor production outside China faces 12-18 month supply gap. MP Materials and Lynas cannot scale fast enough to compensate.',
    affectedCategories: ['motors', 'actuators_rotary', 'actuators_linear'],
    affectedCountries: ['US', 'CN'],
  },
  {
    id: 'nvidia_china_restriction',
    title: 'US restricts NVIDIA chip sales to Chinese OEMs',
    category: 'supply_disruption',
    description: 'Export controls expand to cover Jetson Orin and Thor platforms for humanoid robotics. Chinese OEMs must shift to Horizon Robotics or develop custom silicon. 6-12 month redesign cycle for affected companies.',
    affectedCategories: ['compute'],
    affectedCountries: ['US', 'CN'],
  },
  {
    id: 'harmonic_drive_shortage',
    title: 'Harmonic Drive factory fire halts production 6 months',
    category: 'supply_disruption',
    description: 'Major production facility offline. With 20-25% market share and only 12% of machine tool manufacturers qualifying, the bottleneck becomes critical. LeaderDrive and Nabtesco cannot absorb full demand.',
    affectedCategories: ['reducers', 'actuators_rotary'],
    affectedCountries: ['JP', 'US', 'CN'],
  },
  {
    id: 'catl_battery_shortage',
    title: 'CATL battery cell shortage from EV demand spike',
    category: 'supply_disruption',
    description: 'Global EV sales surge 60% YoY, consuming CATL capacity. Humanoid robotics orders deprioritized. Chinese OEMs (Unitree, AGIBot, UBTECH, XPeng) face 3-6 month delays on battery packs.',
    affectedCategories: ['batteries'],
    affectedCountries: ['CN'],
  },

  // === POLICY SHIFT ===
  {
    id: 'eu_machinery_early',
    title: 'EU Machinery Regulation enforced 1 year early',
    category: 'policy_shift',
    description: 'EU accelerates the Jan 2027 deadline to Jan 2026. OEMs targeting European markets must fast-track ISO 10218 and CE compliance. Companies without safety certifications locked out of the EU market.',
    affectedCategories: ['safety_standards', 'sensors_general'],
    affectedCountries: ['DE'],
  },
  {
    id: 'us_china_tariff_100',
    title: 'US imposes 100% tariff on Chinese humanoid imports',
    category: 'policy_shift',
    description: 'Complete price parity erasure for Chinese OEMs in the US market. Unitree G1 at $13.5K becomes $27K. AGIBot and UBTECH priced out. US OEMs gain domestic advantage but lose access to cheap Chinese components.',
    affectedCategories: ['skeleton', 'motors', 'reducers', 'batteries'],
    affectedCountries: ['US', 'CN'],
  },
  {
    id: 'japan_deregulation',
    title: 'Japan deregulates humanoid deployment in eldercare',
    category: 'policy_shift',
    description: 'Japan fast-tracks approval for humanoid robots in assisted living and hospitals. Creates overnight TAM of 40,000+ care facilities. OEMs with safety certifications and Japanese supply chains (Toyota, Honda partnerships) gain first-mover advantage.',
    affectedCategories: ['safety_standards', 'sensors_general', 'end_effectors'],
    affectedCountries: ['JP'],
  },

  // === MARKET EVENT ===
  {
    id: 'tesla_100k_quarter',
    title: 'Tesla ships 100K Optimus units in a single quarter',
    category: 'market_event',
    description: 'Tesla achieves volume production breakthrough at Giga Texas. At $20K per unit, this is $2B quarterly revenue from humanoids alone. Proves humanoid mass manufacturing is viable. Every supplier in the Optimus BOM becomes capacity-constrained.',
    affectedCategories: ['motors', 'reducers', 'screws', 'bearings', 'batteries', 'compute'],
    affectedCountries: ['US'],
  },
  {
    id: 'unitree_ipo_doubles',
    title: 'Unitree IPO raises $1B, stock doubles on day one',
    category: 'market_event',
    description: 'Unitree lists on STAR Market at $1.1B valuation, immediately trades at $2.2B. Validates humanoid robotics as a standalone public market category. Triggers wave of IPO filings from AGIBot, Fourier, and Kepler.',
    affectedCategories: [],
    affectedCountries: ['CN'],
  },
  {
    id: 'figure_acquires_motor_supplier',
    title: 'Figure AI acquires a major motor supplier',
    category: 'market_event',
    description: 'Figure uses its $39B valuation to vertically integrate, acquiring Kollmorgen or equivalent. Other OEMs dependent on that supplier face a strategic crisis — supply continuity vs finding alternatives.',
    affectedCategories: ['motors', 'actuators_rotary'],
    affectedCountries: ['US'],
  },
  {
    id: 'open_vla_surpasses_proprietary',
    title: 'Open-source VLA surpasses all proprietary models',
    category: 'market_event',
    description: 'An open-source VLA (OpenVLA or pi0 successor) decisively outperforms Helix, Tesla NN, and Carbon AI on standardized benchmarks. Proprietary AI moats evaporate. Hardware differentiation becomes the only defensible advantage.',
    affectedCategories: ['compute'],
    affectedCountries: ['US'],
  },

  // === TECHNOLOGY BREAKTHROUGH ===
  {
    id: 'solid_state_batteries_mass',
    title: 'All-solid-state batteries hit mass production',
    category: 'tech_breakthrough',
    description: 'Energy density doubles (500+ Wh/kg) while eliminating fire risk. Humanoid operating time jumps from 2-4 hours to 8-12 hours. Existing battery suppliers must retool. XPeng and CATL joint development reaches volume.',
    affectedCategories: ['batteries'],
    affectedCountries: ['CN', 'JP', 'KR'],
  },
  {
    id: 'tendon_replaces_harmonic',
    title: 'Tendon-driven actuators replace harmonic drives',
    category: 'tech_breakthrough',
    description: '1X\'s tendon-driven approach (no gearboxes) is validated at scale. Other OEMs follow. Harmonic Drive, Nabtesco, and LeaderDrive face existential demand collapse. Reducer bottleneck disappears but new manufacturing challenges emerge.',
    affectedCategories: ['reducers', 'actuators_rotary', 'motors'],
    affectedCountries: ['US', 'JP'],
  },
  {
    id: 'sim_to_real_95',
    title: 'Sim-to-real transfer achieves 95% success rate',
    category: 'tech_breakthrough',
    description: 'NVIDIA Isaac Sim or Genesis achieves near-perfect sim-to-real transfer for manipulation tasks. Eliminates need for expensive teleoperation data collection. Training costs drop 100x. Companies with large teleoperation datasets lose their data moat.',
    affectedCategories: ['compute'],
    affectedCountries: ['US'],
  },
];
