import type { SafetyStandard, OemSafetyProfile } from './types';

export const safetyStandards: SafetyStandard[] = [
  {
    id: 'iso_25785',
    name: 'ISO 25785-1',
    scope: 'Dynamically stable industrial mobile robots (bipedal, legged)',
    issuingBody: 'ISO TC 299',
    region: 'International',
    status: 'working-draft',
    statusLabel: 'Working Draft',
    expectedDate: '2026-2027',
    description:
      'First safety standard specifically for bipedal/legged robots. Covers fall zones, human detection, safety responses, and energy control for dynamically stable machines. Led by Agility Robotics (Kevin Reese) and Boston Dynamics (Federico Vicentini).',
    sources: [
      {
        label: 'IEEE Spectrum – First Safety Standard for Humanoid Robots (2024)',
        url: 'https://spectrum.ieee.org/humanoid-robot-safety',
      },
      {
        label: 'ISO TC 299 Work Programme – ISO/CD 25785-1',
        url: 'https://www.iso.org/committee/5915511.html',
      },
    ],
  },
  {
    id: 'ansi_r15_06',
    name: 'ANSI/A3 R15.06-2025',
    scope: 'Industrial robots and robot systems safety',
    issuingBody: 'ANSI / A3',
    region: 'US',
    status: 'published',
    statusLabel: 'Published Oct 2025',
    description:
      '403-page three-part US national standard. New robot classification (Class I/II), integrated collaborative requirements from ISO/TS 15066, explicit functional safety, cybersecurity considerations.',
    sources: [
      {
        label: 'Association for Advancing Automation – R15.06-2025 Release',
        url: 'https://www.automate.org/robotics/safety/ansi-ria-r1506',
      },
      {
        label: 'Robotics Online – New US Robot Safety Standard Published (Oct 2025)',
        url: 'https://www.robotics.org/content-detail.cfm/Industrial-Robotics-News/R15-06-2025',
      },
    ],
  },
  {
    id: 'iso_10218',
    name: 'ISO 10218-1/2:2025',
    scope: 'Industrial robot safety + collaborative applications',
    issuingBody: 'ISO TC 299',
    region: 'International',
    status: 'published',
    statusLabel: 'Published Feb 2025',
    expectedDate: 'EU enforcement 2027',
    description:
      'Major overhaul after 8 years. Part 1 expanded to 95 pages, Part 2 to 223 pages. New Class I/II system, integrates ISO/TS 15066 collaborative requirements. Replaces term "cobot" with "collaborative application."',
    sources: [
      {
        label: 'ISO – ISO 10218-1:2025 Industrial Robots — Safety Requirements',
        url: 'https://www.iso.org/standard/82585.html',
      },
      {
        label: 'Pilz – ISO 10218:2025 Key Changes Summary',
        url: 'https://www.pilz.com/en/knowledge/blog/iso-10218-2025',
      },
    ],
  },
  {
    id: 'iso_13482',
    name: 'ISO 13482 (revision)',
    scope: 'Service and personal care robot safety',
    issuingBody: 'ISO TC 299',
    region: 'International',
    status: 'fdis',
    statusLabel: 'FDIS Ballot (Jul 2025)',
    expectedDate: '2026',
    description:
      'Covers non-industrial robots in close contact with the public. Revision expands scope from personal care to broader service robots including humanoids in homes, hospitals, and public spaces.',
    sources: [
      {
        label: 'ISO – ISO/FDIS 13482 Robots for Personal Care — Safety Requirements',
        url: 'https://www.iso.org/standard/83498.html',
      },
      {
        label: 'IFR – Service Robot Safety Standards Update (2025)',
        url: 'https://ifr.org/service-robot-safety-standards',
      },
    ],
  },
  {
    id: 'ul_3300',
    name: 'UL 3300',
    scope: 'Service, communication, education and entertainment robots',
    issuingBody: 'UL Standards',
    region: 'US',
    status: 'published',
    statusLabel: 'Published Apr 2025',
    description:
      'Added to OSHA NRTL Program Dec 2025. Covers humanoid robots, delivery robots, companion robots. Tests include fire/shock prevention, collision with vulnerable persons, audible/visual path indicators.',
    sources: [
      {
        label: 'UL Standards – UL 3300 Robotic Safety Standard',
        url: 'https://www.ul.com/services/ul-3300-robot-safety',
      },
      {
        label: 'OSHA – NRTL Program Scope Expansion for UL 3300 (Dec 2025)',
        url: 'https://www.osha.gov/nationally-recognized-testing-laboratories',
      },
    ],
  },
  {
    id: 'ieee_humanoid',
    name: 'IEEE Humanoid Framework',
    scope: 'Classification, stability, and HRI for humanoids',
    issuingBody: 'IEEE',
    region: 'International',
    status: 'framework',
    statusLabel: 'Framework Published 2025',
    expectedDate: '2027-2028',
    description:
      'Pathway study by 60+ experts. Three areas: classification taxonomy, stability metrics/test methods, and HRI guidelines. Ratified standards expected in 18-36 months.',
    sources: [
      {
        label: 'IEEE – Humanoid Robot Standards Pathway Study (2025)',
        url: 'https://standards.ieee.org/industry-connections/humanoid-robots/',
      },
      {
        label: 'The Robot Report – IEEE Launches Humanoid Standards Effort',
        url: 'https://www.therobotreport.com/ieee-humanoid-robot-standards-framework/',
      },
    ],
  },
  {
    id: 'eu_machinery',
    name: 'EU Machinery Regulation 2023/1230',
    scope: 'AI-integrated machinery including autonomous robots',
    issuingBody: 'European Parliament',
    region: 'EU',
    status: 'published',
    statusLabel: 'Published Jun 2023',
    expectedDate: 'Applies Jan 2027',
    description:
      'Replaces Machinery Directive 2006/42/EC. Covers collaborative robots, requires predictable/understandable robot actions, addresses psychological stress from robot interaction, mandates cybersecurity for safety functions.',
    sources: [
      {
        label: 'EUR-Lex – Regulation (EU) 2023/1230 on Machinery Products',
        url: 'https://eur-lex.europa.eu/eli/reg/2023/1230/oj',
      },
      {
        label: 'TUV – EU Machinery Regulation Impact on Robotics',
        url: 'https://www.tuv.com/world/en/eu-machinery-regulation-2023-1230.html',
      },
    ],
  },
  {
    id: 'eu_ai_act',
    name: 'EU AI Act',
    scope: 'High-risk AI systems including humanoid robot AI',
    issuingBody: 'European Parliament',
    region: 'EU',
    status: 'in-force',
    statusLabel: 'In Force Aug 2024',
    expectedDate: 'Fully applicable Aug 2026',
    description:
      'Risk-based AI regulation. Humanoid robots with AI safety functions classified as high-risk. Requires continuous risk management, human oversight, third-party conformity assessment. Revised Product Liability Directive recognizes software as a product.',
    sources: [
      {
        label: 'EUR-Lex – Regulation (EU) 2024/1689 Artificial Intelligence Act',
        url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
      },
      {
        label: 'European Commission – AI Act Overview',
        url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
      },
    ],
  },
  {
    id: 'china_heis',
    name: 'China HEIS Framework',
    scope: 'National humanoid robot standard system',
    issuingBody: 'MIIT',
    region: 'CN',
    status: 'released',
    statusLabel: 'Released Feb 2026',
    description:
      'Six components: basic commonality, brain-like computing, limbs/components, complete machines, application, safety/ethics. Committee led by Unitree and AgiBot founders. 120+ institutions contributed.',
    sources: [
      {
        label: 'MIIT – Humanoid Robot Standard System Construction Guide (Feb 2026)',
        url: 'https://www.miit.gov.cn/zwgk/zcwj/wjfb/tz/art/2026/humanoid-standard-system.html',
      },
      {
        label: 'South China Morning Post – China Releases National Humanoid Robot Standards',
        url: 'https://www.scmp.com/tech/robotics/humanoid-standards-2026',
      },
    ],
  },
  {
    id: 'iec_61508',
    name: 'IEC 61508',
    scope: 'Functional safety (Safety Integrity Levels)',
    issuingBody: 'IEC',
    region: 'International',
    status: 'published',
    statusLabel: 'Edition 2 (2010)',
    expectedDate: 'Edition 3 TBD',
    description:
      'Foundational functional safety standard defining SIL 1-4. Most robot safety functions target SIL 2. Requires redundant sensors, fault containment, safe state definitions, diagnostic coverage.',
    sources: [
      {
        label: 'IEC – IEC 61508 Functional Safety',
        url: 'https://www.iec.ch/functional-safety',
      },
      {
        label: 'Exida – IEC 61508 Overview and Application to Robotics',
        url: 'https://www.exida.com/resources/iec-61508-overview',
      },
    ],
  },
];

export const oemSafetyProfiles: OemSafetyProfile[] = [
  {
    id: 'agility_safety',
    companyId: 'agility',
    name: 'Agility Robotics',
    country: 'US',
    complianceLevel: 'certified',
    complianceSummary: 'NRTL certified · CAT1 stop · Safety PLC · ISO 25785 co-lead',
    forceLimiting: true,
    eStop: true,
    speedLimiting: true,
    collisionDetection: true,
    compliantActuators: true,
    fallProtection: true,
    cyberSecurity: false,
    description:
      'First humanoid to pass NRTL field testing at a live ecommerce facility. CAT1 stop, Safety PLC, FSoE. Co-leading ISO 25785-1 development. CTO stated: "There are zero cooperatively safe humanoid robots."',
    sources: [
      {
        label: 'Agility Robotics – Safety-First Approach & NRTL Certification (2025)',
        url: 'https://agilityrobotics.com/safety',
      },
      {
        label: 'IEEE Spectrum – Agility Digit Passes NRTL Field Testing',
        url: 'https://spectrum.ieee.org/agility-digit-nrtl-safety',
      },
    ],
  },
  {
    id: 'boston_dynamics_safety',
    companyId: 'boston_dynamics',
    name: 'Boston Dynamics',
    country: 'US',
    complianceLevel: 'in-progress',
    complianceSummary: 'AV-derived safety · fenceless guarding · ISO 25785 co-lead',
    forceLimiting: true,
    eStop: true,
    speedLimiting: true,
    collisionDetection: true,
    compliantActuators: true,
    fallProtection: true,
    cyberSecurity: false,
    description:
      'Onboard safety system leveraging autonomous vehicle best practices. Fenceless guarding: robot pauses when humans enter radius. Padding and minimal pinch points. Co-leading ISO 25785-1. All 2026 production committed.',
    sources: [
      {
        label: 'Boston Dynamics – Atlas Safety Architecture (2025)',
        url: 'https://bostondynamics.com/blog/atlas-safety/',
      },
      {
        label: 'The Robot Report – BD Adopts AV Safety Model for Atlas',
        url: 'https://www.therobotreport.com/boston-dynamics-atlas-av-safety-model/',
      },
    ],
  },
  {
    id: 'figure_safety',
    companyId: 'figure',
    name: 'Figure AI',
    country: 'US',
    complianceLevel: 'in-progress',
    complianceSummary: 'NRTL in progress · Safety center · quarterly reports',
    forceLimiting: true,
    eStop: true,
    speedLimiting: false,
    collisionDetection: true,
    compliantActuators: false,
    fallProtection: false,
    cyberSecurity: false,
    description:
      'Established Center for the Advancement of Humanoid Robot Safety. Pursuing NRTL certification for battery, functional safety, and electrical systems. Committed to quarterly safety reports. Whistleblower lawsuit (Nov 2025) alleged forces exceeding skull-fracture thresholds during testing.',
    sources: [
      {
        label: 'Figure AI – Center for Humanoid Robot Safety Launch (2025)',
        url: 'https://www.figure.ai/news/safety-center',
      },
      {
        label: 'TechCrunch – Figure AI Whistleblower Lawsuit (Nov 2025)',
        url: 'https://techcrunch.com/2025/11/figure-ai-whistleblower-safety/',
      },
    ],
  },
  {
    id: '1x_safety',
    companyId: '1x',
    name: '1X Technologies',
    country: 'NO',
    complianceLevel: 'claimed',
    complianceSummary: 'HIC < 250 · tendon compliance · pinch-proof · 20N grip limit',
    forceLimiting: true,
    eStop: true,
    speedLimiting: true,
    collisionDetection: true,
    compliantActuators: true,
    fallProtection: true,
    cyberSecurity: true,
    description:
      'Home-first safety design. Tendon-driven actuators provide inherent compliance. Head Injury Criterion under 250. Entirely pinch-proof surface. Grip force limited to 20N. 22 dB acoustic noise. No-go zones, face blurring, human-in-the-loop supervision.',
    sources: [
      {
        label: '1X Technologies – NEO Safety Design Principles',
        url: 'https://www.1x.tech/discover/neo-safety',
      },
      {
        label: 'IEEE Robotics – 1X NEO: Designing Safe Home Humanoids (2025)',
        url: 'https://spectrum.ieee.org/1x-neo-home-robot-safety',
      },
    ],
  },
  {
    id: 'apptronik_safety',
    companyId: 'apptronik',
    name: 'Apptronik',
    country: 'US',
    complianceLevel: 'in-progress',
    complianceSummary: 'Force control · layered safety zones · fall-curl protocol',
    forceLimiting: true,
    eStop: true,
    speedLimiting: true,
    collisionDetection: true,
    compliantActuators: true,
    fallProtection: true,
    cyberSecurity: false,
    description:
      'Force control architecture with torque sensors in all joints. Layered safety zones: collision avoidance, configurable safety, and impact zones. Fall protection curl-up procedure to minimize damage. Speed and separation monitoring.',
    sources: [
      {
        label: 'Apptronik – Apollo Safety Architecture Overview',
        url: 'https://apptronik.com/apollo-safety',
      },
      {
        label: 'RoboticsBusinessReview – Apptronik Layered Safety Zones (2025)',
        url: 'https://www.roboticsbusinessreview.com/apptronik-apollo-safety-zones/',
      },
    ],
  },
  {
    id: 'neura_safety',
    companyId: 'neura_4ne1',
    name: 'NEURA Robotics',
    country: 'DE',
    complianceLevel: 'claimed',
    complianceSummary: 'Omnisensor · artificial skin · cage-free · Bosch partnership',
    forceLimiting: true,
    eStop: true,
    speedLimiting: false,
    collisionDetection: true,
    compliantActuators: true,
    fallProtection: false,
    cyberSecurity: false,
    description:
      'Patented Omnisensor distinguishes people from objects. Artificial skin detects contact before touch (proximity sensing). 360-degree perception via seven cameras. Operates without protective cages. Bosch partnership for scaling.',
    sources: [
      {
        label: 'NEURA Robotics – Omnisensor Technology & Cage-Free Operation',
        url: 'https://neura-robotics.com/technology/omnisensor',
      },
      {
        label: 'Handelsblatt – NEURA Robotics Bosch Partnership (2025)',
        url: 'https://www.handelsblatt.com/neura-robotics-bosch-partnership/',
      },
    ],
  },
  {
    id: 'xpeng_safety',
    companyId: 'xpeng',
    name: 'XPeng',
    country: 'CN',
    complianceLevel: 'claimed',
    complianceSummary: 'Indoor AEB · solid-state battery · automotive-grade',
    forceLimiting: true,
    eStop: true,
    speedLimiting: true,
    collisionDetection: true,
    compliantActuators: false,
    fallProtection: false,
    cyberSecurity: true,
    description:
      'World first indoor AEB system for robots. Full solid-state battery eliminates thermal runaway risk. Developed to automotive-grade standards. Fourth Law of data privacy ensures user data never leaves the robot.',
    sources: [
      {
        label: 'XPeng Robotics – Iron Safety Features & Indoor AEB',
        url: 'https://www.xpeng.com/robotics/iron-safety',
      },
      {
        label: 'CnEVPost – XPeng Robot Uses Solid-State Battery for Safety (2025)',
        url: 'https://cnevpost.com/xpeng-robot-solid-state-battery-safety/',
      },
    ],
  },
  {
    id: 'ubtech_safety',
    companyId: 'ubtech',
    name: 'UBTECH',
    country: 'CN',
    complianceLevel: 'claimed',
    complianceSummary: 'ISO 10218 claimed · Foxconn PVT passed · force-compliant joints',
    forceLimiting: true,
    eStop: true,
    speedLimiting: false,
    collisionDetection: true,
    compliantActuators: false,
    fallProtection: false,
    cyberSecurity: false,
    description:
      'Claims ISO 10218 compliance. Passed Production Validation Testing at Foxconn. Force-compliant drive joints with rigid-flexible coupling. Active in China national standardization committee.',
    sources: [
      {
        label: 'UBTECH – Walker S Industrial Safety & Foxconn PVT',
        url: 'https://www.ubtrobot.com/walker-s-safety',
      },
      {
        label: 'South China Morning Post – UBTECH Passes Foxconn Factory Testing (2025)',
        url: 'https://www.scmp.com/tech/ubtech-foxconn-walker-pvt/',
      },
    ],
  },
  {
    id: 'tesla_safety',
    companyId: 'tesla',
    name: 'Tesla',
    country: 'US',
    complianceLevel: 'not-disclosed',
    complianceSummary: 'F/T sensors · e-stop · predictive AI · no certs disclosed',
    forceLimiting: true,
    eStop: true,
    speedLimiting: false,
    collisionDetection: true,
    compliantActuators: false,
    fallProtection: false,
    cyberSecurity: true,
    description:
      'Force-torque sensors in all joints. Torque-limited actuators. Predictive AI evaluates risk before actions. Localized safety chip for OTA updates. No specific certifications disclosed. Prior industrial robot incident at Giga Texas (2021).',
    sources: [
      {
        label: 'Tesla AI Day – Optimus Safety Architecture Presentation (2024)',
        url: 'https://www.tesla.com/AI',
      },
      {
        label: 'The Information – Tesla Giga Texas Robot Incident Report (2021)',
        url: 'https://www.theinformation.com/articles/tesla-robot-incident-giga-texas',
      },
    ],
  },
  {
    id: 'sanctuary_safety',
    companyId: 'sanctuary_ai',
    name: 'Sanctuary AI',
    country: 'CA',
    complianceLevel: 'not-disclosed',
    complianceSummary: 'Explainable AI · tactile sensing · teleoperation failsafe',
    forceLimiting: true,
    eStop: false,
    speedLimiting: false,
    collisionDetection: true,
    compliantActuators: true,
    fallProtection: false,
    cyberSecurity: false,
    description:
      'Carbon control system provides explainable and auditable AI decisions. 5 millinewton tactile sensing. Human-in-the-loop teleoperation. Wheeled base chosen over legs for stability safety. No certifications disclosed.',
    sources: [
      {
        label: 'Sanctuary AI – Carbon Intelligence Safety Philosophy',
        url: 'https://sanctuary.ai/technology/safety',
      },
      {
        label: 'VentureBeat – Sanctuary AI Explainable AI for Robot Safety (2025)',
        url: 'https://venturebeat.com/ai/sanctuary-ai-explainable-robot-safety/',
      },
    ],
  },
  {
    id: 'fourier_safety',
    companyId: 'fourier',
    name: 'Fourier',
    country: 'CN',
    complianceLevel: 'not-disclosed',
    complianceSummary: 'Medical rehab heritage · tactile sensors',
    forceLimiting: true,
    eStop: false,
    speedLimiting: false,
    collisionDetection: true,
    compliantActuators: false,
    fallProtection: false,
    cyberSecurity: false,
    description:
      'Founded as medical rehabilitation robotics firm. Deployed in 2,000+ institutions across 40+ countries. Six array-type tactile sensors on GR-2. Medical device regulatory experience applicable to humanoid safety.',
    sources: [
      {
        label: 'Fourier Intelligence – GR-2 Safety & Medical Heritage',
        url: 'https://www.fftai.com/gr2-safety',
      },
      {
        label: 'Robotics & Automation News – Fourier GR-2 Tactile Safety Sensors (2025)',
        url: 'https://roboticsandautomationnews.com/fourier-gr2-tactile-sensors/',
      },
    ],
  },
  {
    id: 'unitree_safety',
    companyId: 'unitree',
    name: 'Unitree',
    country: 'CN',
    complianceLevel: 'not-disclosed',
    complianceSummary: 'QDD actuators · no certs disclosed · 2 public incidents',
    forceLimiting: false,
    eStop: false,
    speedLimiting: false,
    collisionDetection: true,
    compliantActuators: true,
    fallProtection: false,
    cyberSecurity: false,
    description:
      'QDD actuators with low gear ratios provide inherent backdrivability. No safety certifications publicly disclosed. Two public incidents: H1 feedback loop malfunction (May 2025), G1 kick during teleoperation demo (Dec 2025).',
    sources: [
      {
        label: 'Unitree – QDD Actuator Technology & Backdrivability',
        url: 'https://www.unitree.com/qdd-actuators',
      },
      {
        label: 'TechCrunch – Unitree Robot Incidents Raise Safety Questions (2025)',
        url: 'https://techcrunch.com/2025/12/unitree-robot-safety-incidents/',
      },
    ],
  },
];
