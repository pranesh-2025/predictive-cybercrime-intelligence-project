import { 
  PredictedLocation, 
  CameraSensor, 
  AlertItem, 
  InvestigationTimelineStep, 
  AuditLogEntry, 
  HourlyRiskTrend,
  RegionMetric,
  UserProfile,
  HumanVerificationRecord
} from '../types';
import { calculateBlockHash, generateOfficerSignature } from '../utils/cryptoUtils';

export const INITIAL_USER: UserProfile = {
  id: 'usr-024',
  name: 'Pranesh B',
  badgeNumber: 'OFF-024',
  designation: 'District Analyst',
  role: 'DISTRICT_ANALYST',
  station: 'District Cyber Command, Nagapattinam',
};

export const AVAILABLE_USERS: UserProfile[] = [
  INITIAL_USER,
  {
    id: 'usr-001',
    name: 'Insp. V. Raghavan, IPS',
    badgeNumber: 'TN-CYB-4091',
    designation: 'Cyber Crime Division, Cyber Cell HQ',
    role: 'CHIEF_CYBER_INVESTIGATOR',
    station: 'Cyber Crime Investigation Centre, Ashok Nagar, Chennai',
  },
  {
    id: 'usr-002',
    name: 'Sub-Insp. Priya Selvam',
    badgeNumber: 'TN-CYB-5820',
    designation: 'District Intelligence Analyst',
    role: 'DISTRICT_ANALYST',
    station: 'District Cyber Police Station, Coimbatore City',
  },
  {
    id: 'usr-003',
    name: 'Head Const. K. Murugan',
    badgeNumber: 'TN-CYB-3104',
    designation: 'Field QRT Lead Interceptor',
    role: 'FIELD_PATROL_LEAD',
    station: 'Flying Squad & Quick Response Team, Madurai',
  },
  {
    id: 'usr-004',
    name: 'S. Divya, JD',
    badgeNumber: 'AUD-GOV-8991',
    designation: 'Statutory Cyber & Privacy Auditor',
    role: 'AUDIT_OFFICER',
    station: 'State Police Directorate Audit Wing, Chennai',
  }
];

export const TAMIL_NADU_ATMS: PredictedLocation[] = [
  {
    id: 'atm-001',
    atmCode: 'ATM-NGP-04',
    name: 'Nagapattinam Port Coastal ATM Kiosk',
    bank: 'State Bank of India (SBI)',
    atmType: 'Off-Site Coastal Kiosk',
    district: 'Nagapattinam',
    area: 'Beach Road Harbor Sector',
    address: 'Velankanni Road, Nagapattinam, Tamil Nadu',
    city: 'Nagapattinam',
    region: 'Nagapattinam Coastal',
    lat: 10.7656,
    lng: 79.8424,
    riskScore: 91,
    riskLevel: 'HIGH',
    confidence: 84,
    predictedWindow: '20:00 – 22:00 IST',
    peakCashOutWindow: '20:00 – 22:00',
    relatedComplaints: 7,
    transactionAnomaly: 'Rapid multi-card burst withdrawals (4 cards / 3 mins) with micro-interval cadence',
    lastUpdateTime: '20:17',
    mainContributingFactor: 'High-density recurrence of NCRP complaints linked to coastal mule accounts (94%)',
    isFlagshipScenario: true,
    factors: {
      historicalDensity: 94,
      transactionAmountWeight: 88,
      timePatternMatch: 95,
      geoProximity: 86,
      previousCaseCorrelation: 90,
      transactionRelationshipScore: 92
    },
    whyHighRisk: [
      '7 related complaints within 2.5 km',
      '4 unusual withdrawals after 20:00',
      '₹8.4L aggregate withdrawal',
      '3 correlated accounts',
      '2 previous incidents',
      'Major transit corridor proximity'
    ],
    tacticalAdvisory: 'Immediate alert dispatch recommended. Alert nearest coastal patrol interceptor vehicle QRT-04 to maintain tactical surveillance around Beach Road kiosk.',
    cameraId: 'CAM-ATM-01',
    muleAccountLinks: 7,
    averageWithdrawalTicket: 38500
  },
  {
    id: 'atm-002',
    atmCode: 'ATM-CHN-042',
    name: 'Central Station Western Concourse Kiosk',
    bank: 'State Bank of India (SBI)',
    atmType: 'High-Traffic Transit Hub',
    district: 'Chennai',
    area: 'Park Town Concourse',
    address: 'Grand Southern Trunk Rd, Park Town, Chennai - 600003',
    city: 'Chennai',
    region: 'Chennai Central',
    lat: 13.0827,
    lng: 80.2707,
    riskScore: 89,
    riskLevel: 'HIGH',
    confidence: 91,
    predictedWindow: '21:00 – 23:00 IST',
    peakCashOutWindow: '21:00 – 23:00 IST',
    relatedComplaints: 16,
    transactionAnomaly: 'Rapid sequential withdrawals under ₹10,000 threshold to evade bank automated controls',
    lastUpdateTime: '19:47:40 IST (Live Telemetry)',
    mainContributingFactor: 'High-speed interstate transit node with 16 linked online trading fraud dockets (92%)',
    factors: {
      historicalDensity: 92,
      transactionAmountWeight: 89,
      timePatternMatch: 91,
      geoProximity: 87,
      previousCaseCorrelation: 88,
      transactionRelationshipScore: 90
    },
    whyHighRisk: [
      'Critical high-speed transit node where interstate mule runners board long-distance trains',
      'Documented link to 16 online trading fraud cases within past 30 days',
      'Rapid sequential withdrawals under ₹10,000 to evade automated bank thresholds'
    ],
    tacticalAdvisory: 'Coordinate with Railway Protection Force (RPF) and local beat constables.',
    cameraId: 'CAM-ATM-09',
    muleAccountLinks: 11,
    averageWithdrawalTicket: 39000
  },
  {
    id: 'atm-003',
    atmCode: 'ATM-CHN-014',
    name: 'T. Nagar South Boag Road Terminal',
    bank: 'HDFC Bank',
    atmType: 'Commercial Kiosk',
    district: 'Chennai',
    area: 'T. Nagar Commercial Core',
    address: 'South Boag Road, Opp. Panagal Park, T. Nagar, Chennai - 600017',
    city: 'Chennai',
    region: 'Chennai Central',
    lat: 13.0418,
    lng: 80.2341,
    riskScore: 86,
    riskLevel: 'HIGH',
    confidence: 84,
    predictedWindow: '18:30 – 21:00 IST',
    peakCashOutWindow: '18:30 – 21:00 IST',
    relatedComplaints: 14,
    transactionAnomaly: 'Card-swapping and micro-interval transaction sequences registered in last 48 hours',
    lastUpdateTime: '19:46:50 IST (Live Telemetry)',
    mainContributingFactor: 'Commercial crowd camouflage with 14 investment task scam payouts (88%)',
    factors: {
      historicalDensity: 88,
      transactionAmountWeight: 82,
      timePatternMatch: 86,
      geoProximity: 80,
      previousCaseCorrelation: 84,
      transactionRelationshipScore: 89
    },
    whyHighRisk: [
      'Heavy commercial pedestrian density used as camouflage by syndicate withdrawal couriers',
      'Correlated with 14 past investment scam payouts originating from fake Telegram groups',
      'Card-swapping and micro-interval transaction sequences registered in last 48 hours'
    ],
    tacticalAdvisory: 'Deploy plainclothes observer at Panagal Park peripheral exit. Request CCTV archive lock on HDFC Server.',
    cameraId: 'CAM-ATM-04',
    muleAccountLinks: 12,
    averageWithdrawalTicket: 44000
  },
  {
    id: 'atm-004',
    atmCode: 'ATM-NGP-09',
    name: 'Nagapattinam Central Bazaar Junction',
    bank: 'HDFC Bank',
    atmType: 'On-Site Branch ATM',
    district: 'Nagapattinam',
    area: 'Public Office Road Corridor',
    address: 'Public Office Road, Near Old Bus Stand, Nagapattinam - 611001',
    city: 'Nagapattinam',
    region: 'Nagapattinam Coastal',
    lat: 10.7725,
    lng: 79.8390,
    riskScore: 83,
    riskLevel: 'HIGH',
    confidence: 83,
    predictedWindow: '20:15 – 22:30 IST',
    peakCashOutWindow: '20:15 – 22:30 IST',
    relatedComplaints: 7,
    transactionAnomaly: 'Off-hours high-velocity withdrawal sequence exceeding daily threshold limits',
    lastUpdateTime: '20:12',
    mainContributingFactor: 'High night-time surge correlation with Beach Road primary cluster (85%)',
    factors: {
      historicalDensity: 84,
      transactionAmountWeight: 83,
      timePatternMatch: 85,
      geoProximity: 82,
      previousCaseCorrelation: 80,
      transactionRelationshipScore: 84
    },
    whyHighRisk: [
      'Secondary fallback node for coastal syndicate when primary Port Kiosk is monitored',
      'Recent high-value UPI-linked debit withdrawals logged between 20:00 and 22:30'
    ],
    tacticalAdvisory: 'Maintain tactical perimeter sweep in tandem with QRT-04 Port kiosk deployment.',
    cameraId: 'CAM-ATM-10',
    muleAccountLinks: 5,
    averageWithdrawalTicket: 34500
  },
  {
    id: 'atm-005',
    atmCode: 'ATM-CBE-007',
    name: 'Gandhipuram Cross Cut Road Hub',
    bank: 'Bank of Baroda',
    atmType: 'Commercial Junction Kiosk',
    district: 'Coimbatore',
    area: 'Gandhipuram Central',
    address: 'Cross Cut Road, 4th Street Corner, Gandhipuram, Coimbatore - 641012',
    city: 'Coimbatore',
    region: 'Coimbatore West',
    lat: 11.0168,
    lng: 76.9673,
    riskScore: 81,
    riskLevel: 'HIGH',
    confidence: 82,
    predictedWindow: '19:00 – 21:30 IST',
    peakCashOutWindow: '19:00 – 21:30 IST',
    relatedComplaints: 8,
    transactionAnomaly: 'Cloned magnetic strip transactions matching AePS cash withdrawal signatures',
    lastUpdateTime: '19:46:00 IST (Live Telemetry)',
    mainContributingFactor: 'Interstate bus transit departure proximity & AePS fraud payouts (83%)',
    factors: {
      historicalDensity: 82,
      transactionAmountWeight: 80,
      timePatternMatch: 79,
      geoProximity: 83,
      previousCaseCorrelation: 78,
      transactionRelationshipScore: 84
    },
    whyHighRisk: [
      'Proximity to interstate bus transit terminal facilitating rapid courier departure',
      'Transaction amounts match Aadhaar Enabled Payment System (AePS) fraud payouts'
    ],
    tacticalAdvisory: 'Liaise with Gandhipuram Beat Officer. Monitor vehicle movements toward central bus terminal.',
    cameraId: 'CAM-ATM-03',
    muleAccountLinks: 5,
    averageWithdrawalTicket: 29000
  },
  {
    id: 'atm-006',
    atmCode: 'ATM-MDU-022',
    name: 'Mattuthavani Integrated Bus Hub Kiosk',
    bank: 'Canara Bank',
    atmType: 'Transit Concourse Kiosk',
    district: 'Madurai',
    area: 'Mattuthavani Omni Concourse',
    address: 'Omni Bus Stand Concourse, Mattuthavani, Madurai - 625007',
    city: 'Madurai',
    region: 'Madurai North',
    lat: 9.9482,
    lng: 78.1565,
    riskScore: 74,
    riskLevel: 'MEDIUM',
    confidence: 76,
    predictedWindow: '21:00 – 23:30 IST',
    peakCashOutWindow: '21:00 – 23:30 IST',
    relatedComplaints: 6,
    transactionAnomaly: 'Successive off-hours withdrawals across digital arrest extortion accounts',
    lastUpdateTime: '19:45:10 IST (Live Telemetry)',
    mainContributingFactor: 'Transit quick-dispersal pattern with 6 prior digital extortion transfers (78%)',
    factors: {
      historicalDensity: 75,
      transactionAmountWeight: 72,
      timePatternMatch: 76,
      geoProximity: 74,
      previousCaseCorrelation: 70,
      transactionRelationshipScore: 78
    },
    whyHighRisk: [
      'High night-time transit hub activity with frequent quick-dispersal patterns',
      'Identified in 6 prior digital arrest extortion transfers within southern districts'
    ],
    tacticalAdvisory: 'Keep transit police post on standby. Verify CCTV camera feed CAM-ATM-02 status.',
    cameraId: 'CAM-ATM-02',
    muleAccountLinks: 4,
    averageWithdrawalTicket: 32000
  },
  {
    id: 'atm-007',
    atmCode: 'ATM-TRY-005',
    name: 'Chatram Bus Stand Junction',
    bank: 'Punjab National Bank',
    atmType: 'Transit Standalone Kiosk',
    district: 'Tiruchirappalli',
    area: 'Salai Road Corner',
    address: 'Salai Road, Opp. Chatram Stand, Tiruchirappalli - 620002',
    city: 'Tiruchirappalli',
    region: 'Tiruchirappalli Central',
    lat: 10.8297,
    lng: 78.6923,
    riskScore: 68,
    riskLevel: 'MEDIUM',
    confidence: 71,
    predictedWindow: '17:00 – 19:30 IST',
    peakCashOutWindow: '17:00 – 19:30 IST',
    relatedComplaints: 5,
    transactionAnomaly: 'UPI loan fraud proceeds routed through linked local current accounts',
    lastUpdateTime: '19:44:20 IST (Live Telemetry)',
    mainContributingFactor: 'Repetitive UPI loan fraud proceeds routed to local mule current accounts (71%)',
    factors: {
      historicalDensity: 69,
      transactionAmountWeight: 65,
      timePatternMatch: 70,
      geoProximity: 67,
      previousCaseCorrelation: 64,
      transactionRelationshipScore: 71
    },
    whyHighRisk: [
      'Repetitive UPI loan fraud proceeds routed through linked local current accounts',
      'Moderate anomaly index from local sensor monitoring'
    ],
    tacticalAdvisory: 'Routine patrol presence recommended between 17:00 and 19:30.',
    cameraId: 'CAM-ATM-05',
    muleAccountLinks: 3,
    averageWithdrawalTicket: 22000
  },
  {
    id: 'atm-008',
    atmCode: 'ATM-NGP-02',
    name: 'Nagapattinam Railway Feeder Kiosk',
    bank: 'HDFC Bank',
    atmType: 'Transit Standalone Kiosk',
    district: 'Nagapattinam',
    area: 'Railway Station Road',
    address: 'Railway Station Approach Road, Nagapattinam - 611001',
    city: 'Nagapattinam',
    region: 'Nagapattinam Coastal',
    lat: 10.7580,
    lng: 79.8350,
    riskScore: 67,
    riskLevel: 'MEDIUM',
    confidence: 72,
    predictedWindow: '19:30 – 21:45 IST',
    peakCashOutWindow: '19:30 – 21:45 IST',
    relatedComplaints: 4,
    transactionAnomaly: 'Irregular repeated balance inquiries followed by split-batch withdrawals',
    lastUpdateTime: '20:05',
    mainContributingFactor: 'Secondary railway transit departure correlation (68%)',
    factors: {
      historicalDensity: 68,
      transactionAmountWeight: 66,
      timePatternMatch: 69,
      geoProximity: 67,
      previousCaseCorrelation: 64,
      transactionRelationshipScore: 68
    },
    whyHighRisk: [
      'Used by secondary mule handlers arriving via local rail routes',
      'Split-ticket withdrawals documented below daily ATM cap thresholds'
    ],
    tacticalAdvisory: 'Monitor CCTV feed from railway station parking zone.',
    cameraId: 'CAM-ATM-07',
    muleAccountLinks: 3,
    averageWithdrawalTicket: 24000
  },
  {
    id: 'atm-009',
    atmCode: 'ATM-SLM-011',
    name: 'Five Roads Junction Tech Kiosk',
    bank: 'Axis Bank',
    atmType: 'Commercial Junction Kiosk',
    district: 'Salem',
    area: 'Five Roads Central',
    address: 'Omalur Main Road, Five Roads, Salem - 636004',
    city: 'Salem',
    region: 'Salem Junction',
    lat: 11.6643,
    lng: 78.1460,
    riskScore: 59,
    riskLevel: 'MEDIUM',
    confidence: 65,
    predictedWindow: '19:30 – 21:00 IST',
    peakCashOutWindow: '19:30 – 21:00 IST',
    relatedComplaints: 4,
    transactionAnomaly: 'Fake lottery and credit card reward scam cash withdrawal bursts',
    lastUpdateTime: '19:43:40 IST (Live Telemetry)',
    mainContributingFactor: 'Regional syndicate cluster for fake reward card cash-outs (62%)',
    factors: {
      historicalDensity: 58,
      transactionAmountWeight: 61,
      timePatternMatch: 60,
      geoProximity: 55,
      previousCaseCorrelation: 57,
      transactionRelationshipScore: 62
    },
    whyHighRisk: [
      'Known cluster for fake lottery and credit card reward scam cash withdrawals',
      'Medium correlation with recent cyber complaints registered in Dharmapuri and Salem'
    ],
    tacticalAdvisory: 'Monitor automatic alert feed. If amount exceeds ₹1,00,000, trigger field verification.',
    cameraId: 'CAM-ATM-06',
    muleAccountLinks: 2,
    averageWithdrawalTicket: 19500
  },
  {
    id: 'atm-010',
    atmCode: 'ATM-NGP-06',
    name: 'Nagore Dargah Pilgrim Access Point',
    bank: 'Axis Bank',
    atmType: 'Commercial Hub Kiosk',
    district: 'Nagapattinam',
    area: 'Nagore East Coast Corridor',
    address: 'East Coast Highway, Nagore, Nagapattinam - 611002',
    city: 'Nagapattinam',
    region: 'Nagapattinam Coastal',
    lat: 10.8210,
    lng: 79.8450,
    riskScore: 52,
    riskLevel: 'MEDIUM',
    confidence: 63,
    predictedWindow: '21:00 – 23:00 IST',
    peakCashOutWindow: '21:00 – 23:00 IST',
    relatedComplaints: 3,
    transactionAnomaly: 'Prepaid mule debit card sequence registered in secondary hop accounts',
    lastUpdateTime: '19:58',
    mainContributingFactor: 'Highway exit accessibility with tourist crowd blending (55%)',
    factors: {
      historicalDensity: 53,
      transactionAmountWeight: 50,
      timePatternMatch: 56,
      geoProximity: 52,
      previousCaseCorrelation: 49,
      transactionRelationshipScore: 53
    },
    whyHighRisk: [
      'Corridor exit point toward Karaikal border often tested by mule couriers'
    ],
    tacticalAdvisory: 'Routine highway patrol check during evening prayer disperse intervals.',
    cameraId: 'CAM-ATM-08',
    muleAccountLinks: 2,
    averageWithdrawalTicket: 18000
  },
  {
    id: 'atm-011',
    atmCode: 'ATM-TNV-003',
    name: 'Palayamkottai High Grounds Booth',
    bank: 'Indian Overseas Bank',
    atmType: 'On-Site Branch ATM',
    district: 'Tirunelveli',
    area: 'Palayamkottai Collectorate Zone',
    address: 'Trivandrum Road, Near Collectorate, Palayamkottai, Tirunelveli - 627002',
    city: 'Tirunelveli',
    region: 'Tirunelveli South',
    lat: 8.7139,
    lng: 77.7567,
    riskScore: 38,
    riskLevel: 'LOW',
    confidence: 60,
    predictedWindow: '14:00 – 16:30 IST',
    peakCashOutWindow: '14:00 – 16:30 IST',
    relatedComplaints: 2,
    transactionAnomaly: 'Isolated low-value transactions with verified genuine account holders',
    lastUpdateTime: '19:42:10 IST (Live Telemetry)',
    mainContributingFactor: 'Low recurrence; administrative district provides natural deterrence (42%)',
    factors: {
      historicalDensity: 36,
      transactionAmountWeight: 40,
      timePatternMatch: 35,
      geoProximity: 42,
      previousCaseCorrelation: 39,
      transactionRelationshipScore: 41
    },
    whyHighRisk: [
      'Low incident recurrence; primarily isolated single-ticket withdrawal cases',
      'Proximity to administrative district provides natural deterrent'
    ],
    tacticalAdvisory: 'Standard passive monitoring. No emergency interception required.',
    cameraId: 'CAM-ATM-07',
    muleAccountLinks: 1,
    averageWithdrawalTicket: 11000
  },
  {
    id: 'atm-012',
    atmCode: 'ATM-VEL-009',
    name: 'Katpadi Railway Junction East Gate',
    bank: 'Union Bank of India',
    atmType: 'Station Gate Kiosk',
    district: 'Vellore',
    area: 'Katpadi North Corridor',
    address: 'Station Road, Near Katpadi Flyover, Vellore - 632007',
    city: 'Vellore',
    region: 'Vellore North',
    lat: 12.9698,
    lng: 79.1384,
    riskScore: 32,
    riskLevel: 'LOW',
    confidence: 58,
    predictedWindow: '11:00 – 13:00 IST',
    peakCashOutWindow: '11:00 – 13:00 IST',
    relatedComplaints: 1,
    transactionAnomaly: 'Commuter ticketing withdrawal patterns; no suspicious hops or velocity spikes',
    lastUpdateTime: '19:41:00 IST (Live Telemetry)',
    mainContributingFactor: 'Minimal correlation to active cyber syndicate accounts (38%)',
    factors: {
      historicalDensity: 31,
      transactionAmountWeight: 35,
      timePatternMatch: 29,
      geoProximity: 38,
      previousCaseCorrelation: 28,
      transactionRelationshipScore: 33
    },
    whyHighRisk: [
      'Minimal correlation to active cyber syndicate accounts',
      'Predominantly genuine commuter traffic transactions'
    ],
    tacticalAdvisory: 'Normal logging. No intervention needed.',
    cameraId: 'CAM-ATM-08',
    muleAccountLinks: 1,
    averageWithdrawalTicket: 8500
  },
  {
    id: 'atm-013',
    atmCode: 'ATM-NGP-01',
    name: 'Nagapattinam District Collectorate Kiosk',
    bank: 'State Bank of India (SBI)',
    atmType: 'Government Compound Secure Kiosk',
    district: 'Nagapattinam',
    area: 'Collectorate Master Complex',
    address: 'Collectorate Master Complex, Nagapattinam - 611003',
    city: 'Nagapattinam',
    region: 'Nagapattinam Coastal',
    lat: 10.7850,
    lng: 79.8280,
    riskScore: 31,
    riskLevel: 'LOW',
    confidence: 62,
    predictedWindow: '11:00 – 14:00 IST',
    peakCashOutWindow: '11:00 – 14:00 IST',
    relatedComplaints: 1,
    transactionAnomaly: 'Standard civil service payroll withdrawals; strictly verified transactions',
    lastUpdateTime: '19:42',
    mainContributingFactor: 'High security government perimeter with strict CCTV monitoring (35%)',
    factors: {
      historicalDensity: 28,
      transactionAmountWeight: 32,
      timePatternMatch: 30,
      geoProximity: 35,
      previousCaseCorrelation: 29,
      transactionRelationshipScore: 31
    },
    whyHighRisk: [
      'Highly secured administrative premises with dedicated security post',
      'Zero correlation with mule account transactions or off-hours cash-outs'
    ],
    tacticalAdvisory: 'Standard periodic logging. Zero operational intervention required.',
    cameraId: 'CAM-ATM-06',
    muleAccountLinks: 0,
    averageWithdrawalTicket: 9200
  },
  {
    id: 'atm-014',
    atmCode: 'ATM-NGP-03',
    name: 'Nagapattinam Main Bazaar ICICI Branch Terminal',
    bank: 'ICICI Bank',
    atmType: 'On-Site Branch ATM',
    district: 'Nagapattinam',
    area: 'Main Bazaar Commercial Hub',
    address: 'Main Bazaar Road, Opp. Municipal Market, Nagapattinam - 611001',
    city: 'Nagapattinam',
    region: 'Nagapattinam Coastal',
    lat: 10.7680,
    lng: 79.8410,
    riskScore: 76,
    riskLevel: 'HIGH',
    confidence: 81,
    predictedWindow: '20:10 – 22:15 IST',
    peakCashOutWindow: '20:10 – 22:15 IST',
    relatedComplaints: 5,
    transactionAnomaly: 'Multi-card rapid sequence withdrawal alerts from flagged coastal UPI accounts',
    lastUpdateTime: '20:09',
    mainContributingFactor: 'Commercial hub nexus for evening mule withdrawals (79%)',
    factors: {
      historicalDensity: 78,
      transactionAmountWeight: 75,
      timePatternMatch: 77,
      geoProximity: 74,
      previousCaseCorrelation: 72,
      transactionRelationshipScore: 76
    },
    whyHighRisk: [
      'High footfall commercial corridor used for rapid mule cash dispersal',
      '5 linked UPI phishing complaints registered in Nagapattinam Cyber Cell'
    ],
    tacticalAdvisory: 'Include in QRT-04 patrol perimeter sweep.',
    cameraId: 'CAM-ATM-04',
    muleAccountLinks: 4,
    averageWithdrawalTicket: 31000
  },
  {
    id: 'atm-015',
    atmCode: 'ATM-NGP-05',
    name: 'Nagapattinam Old Port Fish Landing Center',
    bank: 'Indian Bank',
    atmType: 'Coastal Standalone Kiosk',
    district: 'Nagapattinam',
    area: 'Fish Landing Wharf',
    address: 'Wharf Road, Port Gate 2, Nagapattinam - 611001',
    city: 'Nagapattinam',
    region: 'Nagapattinam Coastal',
    lat: 10.7610,
    lng: 79.8460,
    riskScore: 24,
    riskLevel: 'LOW',
    confidence: 55,
    predictedWindow: '06:00 – 10:00 IST',
    peakCashOutWindow: '06:00 – 10:00 IST',
    relatedComplaints: 1,
    transactionAnomaly: 'Routine morning fish auction settlement withdrawals; zero syndication signs',
    lastUpdateTime: '19:37',
    mainContributingFactor: 'Local cooperative fishing fleet transactions (25%)',
    factors: {
      historicalDensity: 22,
      transactionAmountWeight: 26,
      timePatternMatch: 20,
      geoProximity: 28,
      previousCaseCorrelation: 21,
      transactionRelationshipScore: 24
    },
    whyHighRisk: [
      'Genuine morning fish auction transactions; no nocturnal activity flagged',
      'Zero connection with active mule network accounts'
    ],
    tacticalAdvisory: 'Routine monitoring. No action required.',
    cameraId: 'CAM-ATM-02',
    muleAccountLinks: 0,
    averageWithdrawalTicket: 12000
  },
  {
    id: 'atm-016',
    atmCode: 'ATM-NGP-07',
    name: 'Nagapattinam VOC Nagar ICICI Kiosk',
    bank: 'ICICI Bank',
    atmType: 'Residential Neighborhood Kiosk',
    district: 'Nagapattinam',
    area: 'VOC Nagar Residential',
    address: 'VOC Nagar Main Street, Nagapattinam - 611001',
    city: 'Nagapattinam',
    region: 'Nagapattinam Coastal',
    lat: 10.7760,
    lng: 79.8320,
    riskScore: 32,
    riskLevel: 'LOW',
    confidence: 64,
    predictedWindow: '10:00 – 13:00 IST',
    peakCashOutWindow: '10:00 – 13:00 IST',
    relatedComplaints: 1,
    transactionAnomaly: 'Residential utility payments and grocery cash withdrawals; zero anomalies',
    lastUpdateTime: '19:21',
    mainContributingFactor: 'Residential community center with low vulnerability index (30%)',
    factors: {
      historicalDensity: 30,
      transactionAmountWeight: 28,
      timePatternMatch: 31,
      geoProximity: 33,
      previousCaseCorrelation: 27,
      transactionRelationshipScore: 32
    },
    whyHighRisk: [
      'Predominantly domestic residential banking transactions',
      'Zero flagged mule or crypto P2P account linkages'
    ],
    tacticalAdvisory: 'Standard baseline logging only.',
    cameraId: 'CAM-ATM-03',
    muleAccountLinks: 0,
    averageWithdrawalTicket: 7500
  }
];

export const INITIAL_CAMERA_SENSORS: CameraSensor[] = [
  {
    id: 'CAM-ATM-01',
    name: 'Nagapattinam Port Entrance Sensor 01',
    atmId: 'ATM-NGP-04',
    location: 'Beach Road Kiosk Cluster',
    city: 'Nagapattinam',
    lat: 10.7656,
    lng: 79.8424,
    status: 'ONLINE',
    event: 'Unusual movement pattern & repetitive kiosk approach (Off-hours)',
    confidence: 87,
    lastScanTime: 'Just now (2 mins ago)',
    notes: 'Camera alerts are supporting signals for investigator verification and are not evidence of criminal activity.'
  },
  {
    id: 'CAM-ATM-04',
    name: 'T. Nagar South Boag Sensor 04',
    atmId: 'ATM-CHN-014',
    location: 'Panagal Park Peripheral',
    city: 'Chennai',
    lat: 13.0418,
    lng: 80.2341,
    status: 'ONLINE',
    event: 'Two-wheeler idling adjacent to ATM glass facade for >18 mins',
    confidence: 79,
    lastScanTime: '5 mins ago',
    notes: 'Camera alerts are supporting signals for investigator verification and are not evidence of criminal activity.'
  },
  {
    id: 'CAM-ATM-09',
    name: 'Chennai Central West Exit Sensor 09',
    atmId: 'ATM-CHN-042',
    location: 'Western Concourse Gate 3',
    city: 'Chennai',
    lat: 13.0827,
    lng: 80.2707,
    status: 'ACTIVE_ANALYSIS',
    event: 'Rapid multi-card insertion sequence with helmet visor down',
    confidence: 93,
    lastScanTime: 'Just now',
    notes: 'Camera alerts are supporting signals for investigator verification and are not evidence of criminal activity.'
  },
  {
    id: 'CAM-ATM-03',
    name: 'Gandhipuram Bus Bay Sensor 03',
    atmId: 'ATM-CBE-007',
    location: 'Cross Cut Road Hub',
    city: 'Coimbatore',
    lat: 11.0168,
    lng: 76.9673,
    status: 'ONLINE',
    event: 'Normal pedestrian footfall; no loitering detected',
    confidence: 34,
    lastScanTime: '12 mins ago',
    notes: 'Camera alerts are supporting signals for investigator verification and are not evidence of criminal activity.'
  },
  {
    id: 'CAM-ATM-02',
    name: 'Mattuthavani Terminal Sensor 02',
    atmId: 'ATM-MDU-022',
    location: 'Omni Bus Stand Concourse',
    city: 'Madurai',
    lat: 9.9482,
    lng: 78.1565,
    status: 'STANDBY',
    event: 'Intermittent kiosk door access during night window',
    confidence: 62,
    lastScanTime: '18 mins ago',
    notes: 'Camera alerts are supporting signals for investigator verification and are not evidence of criminal activity.'
  },
  {
    id: 'CAM-ATM-05',
    name: 'Chatram Stand Sensor 05',
    atmId: 'ATM-TRY-005',
    location: 'Salai Road Corner',
    city: 'Tiruchirappalli',
    lat: 10.8297,
    lng: 78.6923,
    status: 'ONLINE',
    event: 'Routine pedestrian traffic; clear visibility',
    confidence: 28,
    lastScanTime: '25 mins ago',
    notes: 'Camera alerts are supporting signals for investigator verification and are not evidence of criminal activity.'
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-2026-0901',
    alertCode: 'ALERT-HIGH-001',
    atmId: 'ATM-NGP-04',
    atmName: 'Nagapattinam Port Coastal ATM Kiosk',
    region: 'Nagapattinam Coastal',
    riskScore: 92,
    expectedWindow: '20:00 – 22:00',
    priority: 'CRITICAL',
    status: 'ACTIVE',
    timestamp: '19:42:15 IST',
    caseRef: 'CYB-TN-2026-8891',
    amount: 350000,
    assignedOfficer: 'Insp. V. Raghavan'
  },
  {
    id: 'ALT-2026-0902',
    alertCode: 'ALERT-HIGH-002',
    atmId: 'ATM-CHN-042',
    atmName: 'Central Station Western Concourse Kiosk',
    region: 'Chennai Central',
    riskScore: 89,
    expectedWindow: '21:00 – 23:00',
    priority: 'CRITICAL',
    status: 'INVESTIGATING',
    timestamp: '19:15:40 IST',
    caseRef: 'CYB-TN-2026-8843',
    amount: 520000,
    assignedOfficer: 'Sub-Insp. Priya Selvam'
  },
  {
    id: 'ALT-2026-0903',
    alertCode: 'ALERT-MED-003',
    atmId: 'ATM-CHN-014',
    atmName: 'T. Nagar South Boag Road Terminal',
    region: 'Chennai Central',
    riskScore: 86,
    expectedWindow: '18:30 – 21:00',
    priority: 'HIGH',
    status: 'ACKNOWLEDGED',
    timestamp: '18:10:02 IST',
    caseRef: 'CYB-TN-2026-8799',
    amount: 180000,
    assignedOfficer: 'Head Const. K. Murugan',
    acknowledgedAt: '18:22:10 IST'
  },
  {
    id: 'ALT-2026-0904',
    alertCode: 'ALERT-MED-004',
    atmId: 'ATM-CBE-007',
    atmName: 'Gandhipuram Cross Cut Road Hub',
    region: 'Coimbatore West',
    riskScore: 81,
    expectedWindow: '19:00 – 21:30',
    priority: 'HIGH',
    status: 'DISPATCHED',
    timestamp: '17:50:33 IST',
    caseRef: 'CYB-TN-2026-8711',
    amount: 245000,
    assignedOfficer: 'Flying Squad QRT-02'
  }
];

export const INITIAL_TIMELINE: InvestigationTimelineStep[] = [
  {
    id: 'step-1',
    order: 1,
    title: 'Complaint Received',
    description: 'National Cybercrime Reporting Portal (NCRP) API ingestion #NCR-88912. Victim reported unauthorized debits following investment task deception.',
    timestamp: '18:04:12 IST',
    status: 'COMPLETED',
    actor: 'NCRP Automated Gateway',
    detailPayload: 'Complaint Type: Part-Time Job / Investment Fraud. Amount: ₹3,50,000. Beneficiary Mule Account: HDFC #5010049281729.'
  },
  {
    id: 'step-2',
    order: 2,
    title: 'Transaction Analyzed',
    description: 'Layering telemetry extracted. Immediate fund dispersion across 3 secondary wallets with terminal cash withdrawal trajectory.',
    timestamp: '18:09:45 IST',
    status: 'COMPLETED',
    actor: 'Automated AML Core Engine',
    detailPayload: 'Velocity: 3 hops in 4 minutes. Terminal node indicates immediate physical ATM cash-out intent.'
  },
  {
    id: 'step-3',
    order: 3,
    title: 'Risk Predicted',
    description: 'Predictive intelligence model calculated 92% withdrawal risk probability within 20:00–22:00 time bracket.',
    timestamp: '18:14:30 IST',
    status: 'COMPLETED',
    actor: 'Predictive Analytics Neural Heuristic',
    detailPayload: 'Confidence: 89%. Top weighted factors: Historical density (94%), Night hour surge (95%).'
  },
  {
    id: 'step-4',
    order: 4,
    title: 'Location Ranked',
    description: 'Candidate ATM kiosks scored and ranked. ATM-NGP-001 (Nagapattinam Port Coastal) flagged as primary candidate.',
    timestamp: '18:18:22 IST',
    status: 'COMPLETED',
    actor: 'Geospatial Spatial Engine',
    detailPayload: 'Top 1: ATM-NGP-001 (92%), Top 2: ATM-CHN-042 (89%), Top 3: ATM-CHN-014 (86%).'
  },
  {
    id: 'step-5',
    order: 5,
    title: 'Camera Checked',
    description: 'Authorized public perimeter camera CAM-ATM-01 telemetry scanned for motion anomalies. No facial recognition performed.',
    timestamp: '18:24:00 IST',
    status: 'COMPLETED',
    actor: 'Sensor Verification Subsystem',
    detailPayload: 'Sensor Status: ONLINE. Event: Off-hours loitering pattern flagged (Confidence: 87%).'
  },
  {
    id: 'step-6',
    order: 6,
    title: 'Investigator Verified',
    description: 'Officer Insp. V. Raghavan audited case dossier, validated correlated mule accounts, and confirmed high confidence.',
    timestamp: '18:31:18 IST',
    status: 'COMPLETED',
    actor: 'Insp. V. Raghavan (Lead Investigator)',
    detailPayload: 'Investigator Note: Coordinated with Nagapattinam Coastal Police Station for physical interception.'
  },
  {
    id: 'step-7',
    order: 7,
    title: 'Alert Generated',
    description: 'Operational advisory pushed to Quick Response Team (QRT-04) and District Cyber Patrol dispatch.',
    timestamp: '18:35:00 IST',
    status: 'COMPLETED',
    actor: 'Critical Alert Dispatcher',
    detailPayload: 'Alert Code: ALERT-HIGH-001. Escalation Status: ACTIVE DISPATCH.'
  }
];

function buildInitialAuditChain(): AuditLogEntry[] {
  const rawEvents = [
    {
      id: 'LOG-0001',
      timestamp: '2026-09-09 16:40:11 IST',
      officerName: 'S. Divya, JD',
      badgeNumber: 'AUD-GOV-8991',
      action: 'PRIVACY_AUDIT',
      resource: 'SYSTEM_WIDE',
      details: 'Verified strict non-PII and zero-facial-recognition enforcement across sensor feeds.',
      ipAddress: '10.244.11.02 (HQ Audit Gateway)'
    },
    {
      id: 'LOG-0002',
      timestamp: '2026-09-09 17:55:22 IST',
      officerName: 'Head Const. K. Murugan',
      badgeNumber: 'TN-CYB-3104',
      action: 'ACKNOWLEDGE_ALERT',
      resource: 'ALERT-MED-003',
      details: 'Acknowledged alert for T. Nagar South Boag Road Terminal; assigned patrol observer.',
      ipAddress: '10.244.33.88 (Mobile MDC)'
    },
    {
      id: 'LOG-0003',
      timestamp: '2026-09-09 18:15:00 IST',
      officerName: 'Sub-Insp. Priya Selvam',
      badgeNumber: 'TN-CYB-5820',
      action: 'RUN_PREDICTION',
      resource: 'CASE-CYB-TN-8891',
      details: 'Executed AI predictive analytics algorithm on ₹3,50,000 investment fraud complaint.',
      ipAddress: '10.244.20.15 (Coimbatore CP Office)'
    },
    {
      id: 'LOG-0004',
      timestamp: '2026-09-09 18:24:05 IST',
      officerName: 'Insp. V. Raghavan',
      badgeNumber: 'TN-CYB-4091',
      action: 'SCAN_CAMERA_SENSORS',
      resource: 'CAM-ATM-01',
      details: 'Initiated authorized anomaly motion scan for Nagapattinam ATM cluster.',
      ipAddress: '10.244.18.42 (Internal Police VPN)'
    },
    {
      id: 'LOG-0005',
      timestamp: '2026-09-09 18:35:10 IST',
      officerName: 'Insp. V. Raghavan',
      badgeNumber: 'TN-CYB-4091',
      action: 'DISPATCH_ALERT',
      resource: 'ALERT-HIGH-001',
      details: 'Dispatched emergency interception advisory for ATM-NGP-001 to Coastal QRT-04 unit.',
      ipAddress: '10.244.18.42 (Internal Police VPN)'
    }
  ];

  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
  const chain: AuditLogEntry[] = [];

  for (let i = 0; i < rawEvents.length; i++) {
    const ev = rawEvents[i];
    const blockHeight = i + 1;
    const hash = calculateBlockHash(
      blockHeight,
      prevHash,
      ev.timestamp,
      ev.officerName,
      ev.action,
      ev.resource,
      ev.details
    );
    const signature = generateOfficerSignature(ev.badgeNumber, hash);

    chain.push({
      ...ev,
      blockHeight,
      prevHash,
      hash,
      signature
    });

    prevHash = hash;
  }

  return chain.reverse();
}

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = buildInitialAuditChain();

export const HOURLY_RISK_TRENDS: HourlyRiskTrend[] = [
  { hour: '00:00', actualComplaints: 12, predictedAttempts: 8, riskIndex: 35 },
  { hour: '02:00', actualComplaints: 7, predictedAttempts: 4, riskIndex: 22 },
  { hour: '04:00', actualComplaints: 4, predictedAttempts: 3, riskIndex: 18 },
  { hour: '06:00', actualComplaints: 8, predictedAttempts: 6, riskIndex: 25 },
  { hour: '08:00', actualComplaints: 24, predictedAttempts: 18, riskIndex: 45 },
  { hour: '10:00', actualComplaints: 46, predictedAttempts: 32, riskIndex: 62 },
  { hour: '12:00', actualComplaints: 68, predictedAttempts: 48, riskIndex: 71 },
  { hour: '14:00', actualComplaints: 55, predictedAttempts: 42, riskIndex: 65 },
  { hour: '16:00', actualComplaints: 78, predictedAttempts: 65, riskIndex: 82 },
  { hour: '18:00', actualComplaints: 98, predictedAttempts: 89, riskIndex: 94 },
  { hour: '20:00', actualComplaints: 114, predictedAttempts: 106, riskIndex: 97 },
  { hour: '22:00', actualComplaints: 82, predictedAttempts: 79, riskIndex: 88 },
];

export const REGION_METRICS: RegionMetric[] = [
  { region: 'Chennai Central & South', complaints: 4820, highRiskAtms: 18, avgRisk: 84 },
  { region: 'Coimbatore Urban', complaints: 2940, highRiskAtms: 9, avgRisk: 76 },
  { region: 'Madurai Metro', complaints: 2150, highRiskAtms: 7, avgRisk: 72 },
  { region: 'Nagapattinam & Coastal', complaints: 1680, highRiskAtms: 6, avgRisk: 88 },
  { region: 'Tiruchirappalli', complaints: 1420, highRiskAtms: 4, avgRisk: 68 },
  { region: 'Salem Junction', complaints: 1120, highRiskAtms: 3, avgRisk: 59 },
  { region: 'Tirunelveli & South', complaints: 762, highRiskAtms: 2, avgRisk: 48 },
];

export const PRESET_CASES = [
  {
    title: 'Nagapattinam Coastal Mule Cash-Out (Critical)',
    complaintType: 'Part-Time Job / Task Investment Scam',
    amount: 350000,
    complaintTimestamp: '2026-09-09T18:00',
    expectedWithdrawalTime: '20:00 – 22:00',
    previousComplaintsCount: 7,
    accountRef: 'TXN-984210-NGP-HDFC',
    region: 'Nagapattinam Coastal'
  },
  {
    title: 'Chennai Central Transit Corridor (High Velocity)',
    complaintType: 'Digital Arrest / Fake Law Enforcement',
    amount: 520000,
    complaintTimestamp: '2026-09-09T19:15',
    expectedWithdrawalTime: '21:00 – 23:00',
    previousComplaintsCount: 11,
    accountRef: 'TXN-554109-CHN-SBI',
    region: 'Chennai Central'
  },
  {
    title: 'Coimbatore AePS Biometric Clone Ring',
    complaintType: 'AePS & Aadhaar OTP Skimming',
    amount: 145000,
    complaintTimestamp: '2026-09-09T17:30',
    expectedWithdrawalTime: '19:00 – 21:00',
    previousComplaintsCount: 4,
    accountRef: 'TXN-228741-CBE-BOB',
    region: 'Coimbatore West'
  },
  {
    title: 'Madurai Micro-Loan Harassment App Extortion',
    complaintType: 'Illegal Instant Loan App Extortion',
    amount: 85000,
    complaintTimestamp: '2026-09-09T16:45',
    expectedWithdrawalTime: '18:00 – 20:00',
    previousComplaintsCount: 3,
    accountRef: 'TXN-773091-MDU-CAN',
    region: 'Madurai North'
  }
];
