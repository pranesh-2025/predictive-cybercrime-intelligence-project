export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type AlertPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'DISPATCHED' | 'RESOLVED';

export type UserRole = 
  | 'CHIEF_CYBER_INVESTIGATOR' 
  | 'DISTRICT_ANALYST' 
  | 'FIELD_PATROL_LEAD' 
  | 'AUDIT_OFFICER';

export interface UserProfile {
  id: string;
  name: string;
  badgeNumber: string;
  designation: string;
  role: UserRole;
  station: string;
  avatarUrl?: string;
}

export interface ComplaintInput {
  complaintType: string;
  amount: number;
  complaintTimestamp: string;
  expectedWithdrawalTime: string;
  previousComplaintsCount: number;
  accountRef: string;
  region: string;
}

export interface ExplanationFactors {
  historicalDensity: number; // 0 - 100
  transactionAmountWeight: number; // 0 - 100
  timePatternMatch: number; // 0 - 100
  geoProximity: number; // 0 - 100
  previousCaseCorrelation: number; // 0 - 100
  transactionRelationshipScore: number; // 0 - 100
}

export interface PredictedLocation {
  id: string;
  atmCode: string; // ATM/Kiosk ID
  name: string;
  bank: string; // Bank name
  atmType: string; // ATM type: Standalone Kiosk, Branch On-site ATM, Coastal Off-site, Transit Hub
  district: string; // District (e.g. Nagapattinam, Chennai, Coimbatore)
  area: string; // Area / Locality (e.g. Beach Road Harbor Sector)
  address: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel; // 'HIGH' | 'MEDIUM' | 'LOW'
  confidence: number; // 0 - 100
  predictedWindow: string;
  peakCashOutWindow: string; // Peak cash-out window (e.g. 20:00 – 22:00 IST)
  relatedComplaints: number;
  transactionAnomaly: string; // Transaction anomaly description
  lastUpdateTime: string; // Last update timestamp (e.g. 19:48:15 IST)
  mainContributingFactor?: string; // Highest weighted causal factor
  factors: ExplanationFactors;
  whyHighRisk: string[];
  tacticalAdvisory: string;
  cameraId?: string;
  muleAccountLinks: number;
  averageWithdrawalTicket: number;
  isFlagshipScenario?: boolean;
}

export interface CameraSensor {
  id: string;
  name: string;
  atmId: string;
  location: string;
  city: string;
  lat: number;
  lng: number;
  status: 'ONLINE' | 'ACTIVE_ANALYSIS' | 'STANDBY' | 'OFFLINE';
  event: string;
  confidence: number; // 0 - 100
  lastScanTime: string;
  notes: string;
}

export interface AlertItem {
  id: string;
  alertCode: string;
  atmId: string;
  atmName: string;
  region: string;
  riskScore: number;
  expectedWindow: string;
  priority: AlertPriority;
  status: AlertStatus;
  timestamp: string;
  caseRef: string;
  amount: number;
  assignedOfficer?: string;
  acknowledgedAt?: string;
  notes?: string;
}

export interface InvestigationTimelineStep {
  id: string;
  order: number;
  title: string;
  description: string;
  timestamp: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  actor: string;
  detailPayload?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerName: string;
  badgeNumber: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  blockHeight?: number;
  hash?: string;
  prevHash?: string;
  signature?: string;
  isTampered?: boolean;
}

export type HumanVerificationDecision = 'CONFIRM' | 'REJECT' | 'ESCALATE' | 'INSUFFICIENT_INFO';

export interface HumanVerificationRecord {
  decision: HumanVerificationDecision;
  officerName: string;
  badgeNumber: string;
  designation: string;
  timestamp: string;
  justification: string;
  reviewedItems: {
    transactionLayering: boolean;
    crossCaseCorrelation: boolean;
    gisHotspotRisk: boolean;
    cameraSensorTelemetry: boolean;
  };
  signatureHash: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'ESCALATED';
}

export interface QrtDispatchInfo {
  unitId: string;
  callSign: string;
  targetAtmId: string;
  targetAtmName: string;
  sector: string;
  status: 'STANDBY' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SITE' | 'INTERCEPT_COMPLETE';
  etaMinutes: number;
  dispatchTime: string;
  commander: string;
  assignedOfficersCount: number;
  tacticalDirectives: string[];
}

export interface SystemStats {
  totalComplaints: number;
  activeAlerts: number;
  highRiskLocations: number;
  predictedWithdrawals: number;
  resolvedInterceptions: number;
  preventedLossAmountInr: number;
}

export interface RegionMetric {
  region: string;
  complaints: number;
  highRiskAtms: number;
  avgRisk: number;
}

export interface HourlyRiskTrend {
  hour: string;
  actualComplaints: number;
  predictedAttempts: number;
  riskIndex: number;
}

export type TabType = 
  | 'COMMAND_CENTER' 
  | 'PREDICTION_ENGINE' 
  | 'GIS_MAP' 
  | 'SENSORS' 
  | 'VERIFICATION'
  | 'ALERTS' 
  | 'TIMELINE' 
  | 'SIMULATION' 
  | 'ANALYTICS' 
  | 'SECURITY';

export interface DashboardStats {
  totalComplaints: number;
  activeAlerts: number;
  highRiskLocationsCount: number;
  predictedWithdrawalsCount: number;
  avgConfidence: number;
  preventedLossTotal: string;
}

export interface SihDemoStepInfo {
  step: number;
  title: string;
  subtitle: string;
  tab: TabType;
  description: string;
  judgeHighlight: string;
}
