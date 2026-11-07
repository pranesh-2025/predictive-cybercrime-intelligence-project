import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  ShieldCheck, 
  MapPin, 
  Camera, 
  Layers, 
  FileSearch, 
  UserCheck, 
  Lock, 
  Send,
  AlertOctagon,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  PredictedLocation, 
  CameraSensor, 
  UserProfile, 
  HumanVerificationRecord, 
  HumanVerificationDecision 
} from '../types';

interface HumanVerificationPanelProps {
  location: PredictedLocation;
  sensor?: CameraSensor;
  currentUser: UserProfile;
  complaintDetails: {
    type: string;
    amount: number;
    accountRef: string;
    expectedWindow: string;
    relatedCount: number;
    region: string;
  };
  verificationRecord: HumanVerificationRecord | null;
  onDecision: (
    decision: HumanVerificationDecision, 
    justification: string, 
    checklist: {
      transactionLayering: boolean;
      crossCaseCorrelation: boolean;
      gisHotspotRisk: boolean;
      cameraSensorTelemetry: boolean;
    }
  ) => void;
  onNavigateToAlerts?: () => void;
  onNavigateToGis?: () => void;
  onNavigateToSensors?: () => void;
}

export const HumanVerificationPanel: React.FC<HumanVerificationPanelProps> = ({
  location,
  sensor,
  currentUser,
  complaintDetails,
  verificationRecord,
  onDecision,
  onNavigateToAlerts,
  onNavigateToGis,
  onNavigateToSensors
}) => {
  // Review quadrant affirmations
  const [reviewedTransaction, setReviewedTransaction] = useState(true);
  const [reviewedRelatedCases, setReviewedRelatedCases] = useState(true);
  const [reviewedGis, setReviewedGis] = useState(true);
  const [reviewedCamera, setReviewedCamera] = useState(true);

  const [justification, setJustification] = useState(
    'Correlated mule accounts confirm high-velocity layering from investment scam proceeds. Geographic isolation of Beach Road kiosk and sensor loitering pattern justify immediate P1 operational interception order.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const allAffirmed = reviewedTransaction && reviewedRelatedCases && reviewedGis && reviewedCamera;

  const handleAction = (decision: HumanVerificationDecision) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onDecision(decision, justification, {
        transactionLayering: reviewedTransaction,
        crossCaseCorrelation: reviewedRelatedCases,
        gisHotspotRisk: reviewedGis,
        cameraSensorTelemetry: reviewedCamera
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-slate-900/95 border border-cyan-500/40 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-cyan-500/20 text-cyan-300 font-mono-code font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider border border-cyan-500/30">
                  STATUTORY HUMAN-IN-THE-LOOP SAFEGUARD
                </span>
                <span className="text-slate-400 font-mono-code text-xs">
                  Section 43A IT Act &amp; NCRP Interception Protocol
                </span>
              </div>
              <h2 className="font-tech text-lg font-bold text-white uppercase tracking-wide mt-1">
                Investigator Verification &amp; Interception Authorization Panel
              </h2>
              <p className="text-xs text-slate-300 font-body mt-0.5 max-w-3xl">
                AI and sensory telemetry function strictly as supporting indicators. A sworn cybercrime investigator must audit the four evidence quadrants before a Priority 1 Interception Dispatch can be authorized.
              </p>
            </div>
          </div>

          {/* Current Decision Badge if already processed */}
          {verificationRecord && (
            <div className="bg-slate-950/80 border border-slate-700 p-3 rounded-lg shrink-0 flex items-center gap-3">
              <div className={`p-2 rounded-md ${
                verificationRecord.decision === 'CONFIRM' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                verificationRecord.decision === 'ESCALATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                verificationRecord.decision === 'REJECT' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {verificationRecord.decision === 'CONFIRM' && <CheckCircle2 className="w-5 h-5" />}
                {verificationRecord.decision === 'ESCALATE' && <AlertTriangle className="w-5 h-5" />}
                {verificationRecord.decision === 'REJECT' && <XCircle className="w-5 h-5" />}
                {verificationRecord.decision === 'INSUFFICIENT_INFO' && <HelpCircle className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-[10px] font-mono-code uppercase text-slate-400">Current Status</div>
                <div className="text-sm font-tech font-bold text-white">
                  {verificationRecord.decision === 'CONFIRM' ? 'VERIFIED & DISPATCH AUTHORIZED' :
                   verificationRecord.decision === 'ESCALATE' ? 'ESCALATED TO SUPERINTENDENT' :
                   verificationRecord.decision === 'REJECT' ? 'INTERCEPTION REJECTED' :
                   'PENDING ADDITIONAL SENSOR DATA'}
                </div>
                <div className="text-[11px] text-cyan-400 font-mono-code">
                  By {verificationRecord.officerName} ({verificationRecord.badgeNumber})
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* The 4-Quadrant Evidence Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quadrant 1: Transaction & Layering Telemetry */}
        <div className={`rounded-xl border p-5 transition ${
          reviewedTransaction ? 'bg-slate-900/90 border-cyan-500/40' : 'bg-slate-900/50 border-slate-800 opacity-70'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide">
                1. Transaction Anomaly &amp; Mule Layering
              </h3>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono-code text-cyan-300">
              <input 
                type="checkbox" 
                checked={reviewedTransaction}
                onChange={(e) => setReviewedTransaction(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4 cursor-pointer"
              />
              <span>Reviewed</span>
            </label>
          </div>

          <div className="space-y-3 mt-4 text-xs font-mono-code">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Suspected Amount:</span>
              <strong className="text-emerald-400 text-sm">₹{complaintDetails.amount.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Mule Layer Velocity:</span>
              <span className="text-cyan-300">3 hops in 4m 12s (High Velocity)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Transaction Reference:</span>
              <span className="text-slate-300">{complaintDetails.accountRef}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Crime Modus Operandi:</span>
              <span className="text-amber-300">{complaintDetails.type}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-cyan-400 font-semibold">AML Diagnostic:</span> Rapid micro-transactions designed to bypass automated bank threshold limits, routing directly to terminal withdrawal node.
            </div>
          </div>
        </div>

        {/* Quadrant 2: Cross-Case Correlation */}
        <div className={`rounded-xl border p-5 transition ${
          reviewedRelatedCases ? 'bg-slate-900/90 border-cyan-500/40' : 'bg-slate-900/50 border-slate-800 opacity-70'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-blue-400" />
              <h3 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide">
                2. Cross-Case Multi-Complaint Correlation
              </h3>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono-code text-cyan-300">
              <input 
                type="checkbox" 
                checked={reviewedRelatedCases}
                onChange={(e) => setReviewedRelatedCases(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4 cursor-pointer"
              />
              <span>Reviewed</span>
            </label>
          </div>

          <div className="space-y-3 mt-4 text-xs font-mono-code">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Linked NCRP Complaints:</span>
              <strong className="text-amber-400">{complaintDetails.relatedCount} Prior Linked FIRs/Complaints</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Syndicate Footprint:</span>
              <span className="text-cyan-300">Telegram Part-Time Task Fraud Ring #TN-40</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Identified Mule Accounts:</span>
              <span className="text-slate-300">{location.muleAccountLinks} correlated accounts</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Prior Interception Success:</span>
              <span className="text-emerald-400">2 cash-outs intercepted in last 30 days</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-blue-400 font-semibold">Intelligence Match:</span> Recipient account shares IFSC branch code with 4 active Cybercrime Portal freeze notices.
            </div>
          </div>
        </div>

        {/* Quadrant 3: GIS Proximity & Candidate Kiosk Risk */}
        <div className={`rounded-xl border p-5 transition ${
          reviewedGis ? 'bg-slate-900/90 border-cyan-500/40' : 'bg-slate-900/50 border-slate-800 opacity-70'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <h3 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide">
                3. Tamil Nadu GIS Hotspot &amp; Target Kiosk
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {onNavigateToGis && (
                <button 
                  onClick={onNavigateToGis}
                  className="text-[11px] text-slate-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Inspect Map
                </button>
              )}
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono-code text-cyan-300">
                <input 
                  type="checkbox" 
                  checked={reviewedGis}
                  onChange={(e) => setReviewedGis(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4 cursor-pointer"
                />
                <span>Reviewed</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 mt-4 text-xs font-mono-code">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Candidate Kiosk:</span>
              <strong className="text-white">{location.name}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Terminal Code / Bank:</span>
              <span className="text-cyan-300">{location.atmCode} • {location.bank}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Risk Probability / Conf:</span>
              <span className="text-red-400 font-bold">{location.riskScore}% (Confidence: {location.confidence}%)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Coordinates:</span>
              <span className="text-slate-300">{location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E ({location.region})</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-rose-400 font-semibold">Geospatial Profile:</span> Beach Road cluster offers isolated retreat routes toward coastal fishing jetties, commonly exploited by syndicate mule runners.
            </div>
          </div>
        </div>

        {/* Quadrant 4: Environmental Camera Sensor Telemetry */}
        <div className={`rounded-xl border p-5 transition ${
          reviewedCamera ? 'bg-slate-900/90 border-cyan-500/40' : 'bg-slate-900/50 border-slate-800 opacity-70'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <h3 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide">
                4. Environmental Sensor Telemetry (No Face ID)
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {onNavigateToSensors && (
                <button 
                  onClick={onNavigateToSensors}
                  className="text-[11px] text-slate-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Live Feeds
                </button>
              )}
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono-code text-cyan-300">
                <input 
                  type="checkbox" 
                  checked={reviewedCamera}
                  onChange={(e) => setReviewedCamera(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4 cursor-pointer"
                />
                <span>Reviewed</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 mt-4 text-xs font-mono-code">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Linked Sensor Feed:</span>
              <strong className="text-white">{sensor?.name || 'CAM-ATM-01 (Nagapattinam Port)'}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Environmental Anomaly:</span>
              <span className="text-amber-300 font-semibold">{sensor?.event || 'Off-hours loitering pattern & 2-wheeler idling (18 mins)'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Loitering Duration / Status:</span>
              <span className="text-cyan-300">6 mins 40 secs • Sensor ONLINE</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Statutory Privacy Seal:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> ZERO BIOMETRIC ID
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-amber-400 font-semibold">Supporting Signal Notice:</span> Camera alerts are supporting signals for investigator verification and are not evidence of criminal activity.
            </div>
          </div>
        </div>
      </div>

      {/* Investigator Decision Submission Card */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-tech text-base font-bold text-white uppercase tracking-wide">
              Official Verification &amp; Tactical Dispatch Order
            </span>
          </div>
          <div className="text-xs font-mono-code text-slate-400">
            Investigator: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.badgeNumber})
          </div>
        </div>

        {/* Justification Text Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono-code">
            Investigator Justification &amp; Tactical Rationale (Logged to Non-Repudiable Audit Ledger)
          </label>
          <textarea 
            rows={3}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-body focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            placeholder="Document evidentiary basis for confirming, rejecting, or escalating this interception..."
          />
        </div>

        {/* Action Button Grid */}
        <div className="pt-2 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-code">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              {allAffirmed 
                ? 'All 4 evidence quadrants confirmed by investigator.' 
                : 'Please verify and check off all four evidence quadrants above.'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Action 1: CONFIRM (Generates P1 Alert & Dispatches QRT) */}
            <button
              id="btn-confirm-verification"
              onClick={() => handleAction('CONFIRM')}
              disabled={isSubmitting || !allAffirmed}
              className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-tech font-bold uppercase text-xs tracking-wider transition cursor-pointer shadow-lg shadow-red-950/60 border border-red-400 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AlertOctagon className="w-4 h-4 animate-pulse" />
              <span>Confirm &amp; Authorize P1 Alert</span>
            </button>

            {/* Action 2: ESCALATE TO HQ */}
            <button
              id="btn-escalate-verification"
              onClick={() => handleAction('ESCALATE')}
              disabled={isSubmitting}
              className="px-3.5 py-2.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/50 font-tech font-bold uppercase text-xs tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Escalate to Superintendent</span>
            </button>

            {/* Action 3: INSUFFICIENT INFO */}
            <button
              id="btn-insufficient-info-verification"
              onClick={() => handleAction('INSUFFICIENT_INFO')}
              disabled={isSubmitting}
              className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-tech font-bold uppercase text-xs tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>Request More Telemetry</span>
            </button>

            {/* Action 4: REJECT */}
            <button
              id="btn-reject-verification"
              onClick={() => handleAction('REJECT')}
              disabled={isSubmitting}
              className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-700 font-tech font-bold uppercase text-xs tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Reject Signal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
