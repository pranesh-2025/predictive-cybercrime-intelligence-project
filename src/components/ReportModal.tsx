import React from 'react';
import { AlertItem, PredictedLocation, UserProfile, HumanVerificationRecord } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  FileText,
  ShieldCheck,
  Camera,
  Layers,
  FileSearch,
  UserCheck,
  Link,
  Lock,
  Copy,
  Check
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: PredictedLocation | null;
  alert: AlertItem | null;
  currentUser: UserProfile;
  verificationRecord?: HumanVerificationRecord | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  alert,
  currentUser,
  verificationRecord
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const summary = `TAMIL NADU POLICE CYBER CRIME DIVISION - INTERCEPTION ADVISORY
CASE REF: ${alert?.caseRef || 'CYB-TN-2026-8891'}
TARGET ATM: ${selectedLocation?.name || alert?.atmName || 'Nagapattinam Port Coastal ATM Kiosk'} (${selectedLocation?.atmCode || alert?.atmId || 'ATM-NGP-001'})
PREDICTED RISK: ${selectedLocation?.riskScore || alert?.riskScore || 92}% | CONFIDENCE: ${selectedLocation?.confidence || 89}%
CRITICAL WINDOW: ${selectedLocation?.predictedWindow || alert?.expectedWindow || '20:00 – 22:00 IST'}
DISPATCH ORDER: Priority 1 Tactical Interception authorized by ${currentUser.name} (${currentUser.badgeNumber})
STATUTORY NOTICE: Non-biometric environmental sensor signal. IT Act 2000 Section 43A compliant.`;
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const terminalCode = selectedLocation?.atmCode || alert?.atmId || 'ATM-NGP-001';
  const terminalName = selectedLocation?.name || alert?.atmName || 'Nagapattinam Port Coastal ATM Kiosk';
  const terminalAddress = selectedLocation?.address || 'Near Old Harbor Gate, Beach Road, Nagapattinam - 611001';
  const risk = selectedLocation?.riskScore || alert?.riskScore || 92;
  const confidence = selectedLocation?.confidence || 89;
  const windowTime = selectedLocation?.predictedWindow || alert?.expectedWindow || '20:00 – 22:00 IST';
  const caseId = alert?.caseRef || 'CYB-TN-2026-8891';
  const amount = alert?.amount || 350000;
  const factors = selectedLocation?.factors || {
    historicalDensity: 94,
    transactionAmountWeight: 89,
    timePatternMatch: 95,
    geoProximity: 91,
    previousCaseCorrelation: 88,
    transactionRelationshipScore: 92
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full shadow-2xl shadow-black overflow-hidden flex flex-col my-6">
        {/* Modal Action Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-tech font-bold uppercase tracking-wider text-slate-200">
              Law Enforcement Interception Advisory Dossier (RESTRICTED / CONFIDENTIAL)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-report-summary"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Brief'}</span>
            </button>
            <button
              id="btn-print-report"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF Dossier</span>
            </button>
            <button
              id="btn-close-report-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-6 bg-slate-950/95 text-slate-200 font-body text-xs space-y-5 overflow-y-auto max-h-[78vh]">
          {/* Official Emblem & Header */}
          <div className="text-center border-b border-slate-800 pb-4">
            <div className="inline-block px-3 py-1 rounded bg-red-950/80 border border-red-700 text-red-300 font-mono-code font-bold text-[10px] tracking-wider uppercase mb-2">
              RESTRICTED • LAW ENFORCEMENT OPERATIONAL DISPATCH ADVISORY
            </div>
            <h2 className="text-xl font-tech font-bold tracking-wider uppercase text-white">
              Tamil Nadu Police • State Cyber Crime Investigation Cell
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Predictive Cybercrime Intelligence System • Field Interception Advisory Dossier
            </p>
            <div className="flex flex-wrap justify-between items-center text-[11px] font-mono-code text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
              <span>NCRP REFERENCE: <strong className="text-cyan-300">{caseId}</strong></span>
              <span>CLASSIFICATION: <strong className="text-red-400">PRIORITY 1 CRITICAL DISPATCH</strong></span>
              <span>TIMESTAMP: <strong className="text-slate-300">{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString()} IST</strong></span>
            </div>
          </div>

          {/* 1. Incident & Financial Crime Parameters */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="font-tech font-bold text-cyan-300 uppercase tracking-wide text-xs mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              1. Incident &amp; Transaction Hop Analysis
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-code text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">FRAUD CLASSIFICATION</span>
                <span className="text-white font-bold">Investment Task Scam</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">TOTAL DEFRAUDED AMOUNT</span>
                <strong className="text-emerald-400 font-bold text-sm">₹{amount.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">MULE VELOCITY</span>
                <span className="text-amber-300 font-bold">3 hops / 4 mins</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">TARGET TERMINAL</span>
                <span className="text-cyan-300 font-bold">{terminalCode}</span>
              </div>
            </div>
            <div className="mt-2.5 p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono-code text-slate-300">
              <span className="text-cyan-400 font-bold">Layering Hop Trail:</span> Victim Account (Axis) → Primary Mule (HDFC #501004928) → Sub-Wallet 1 (₹1.2L) + Sub-Wallet 2 (₹2.3L) → Terminal Cash Withdrawal Node ({terminalCode}).
            </div>
          </div>

          {/* 2. Target ATM Kiosk Intelligence */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="font-tech font-bold text-cyan-300 uppercase tracking-wide text-xs mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              2. Targeted Cash-Out Kiosk &amp; GIS Intelligence
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-code text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">ATM IDENTIFIER</span>
                <span className="text-white font-bold text-sm">{terminalCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PREDICTED RISK INDEX</span>
                <span className="text-red-400 font-bold text-sm">{risk}% (CONFIDENCE: {confidence}%)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">CRITICAL CASHOUT WINDOW</span>
                <span className="text-amber-300 font-bold text-sm">{windowTime}</span>
              </div>
              <div className="col-span-2 sm:col-span-2">
                <span className="text-slate-500 block text-[10px]">FACILITY &amp; ADDRESS</span>
                <span className="text-slate-200 font-bold">{terminalName}</span>
                <span className="text-slate-400 block text-[10px] mt-0.5">{terminalAddress}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">GEOGRAPHIC COORDS</span>
                <span className="text-slate-300 font-mono-code">
                  {selectedLocation ? `${selectedLocation.lat.toFixed(4)}°N, ${selectedLocation.lng.toFixed(4)}°E` : '10.7656°N, 79.8424°E'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Explainable AI (XAI) 6-Factor Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="font-tech font-bold text-slate-100 uppercase tracking-wide text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              3. Explainable AI (XAI) Threat Attribution
            </h3>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Predictive risk calculations represent an explainable weighted linear combination of 6 empirical fraud vectors:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono-code text-[11px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">1. Historical Density</span>
                <strong className="text-red-400">{factors.historicalDensity}%</strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">2. Amount Weight</span>
                <strong className="text-cyan-400">{factors.transactionAmountWeight}%</strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">3. Night Time Pattern</span>
                <strong className="text-amber-400">{factors.timePatternMatch}%</strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">4. Geographic Proximity</span>
                <strong className="text-emerald-400">{factors.geoProximity}%</strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">5. Prior Case Correlation</span>
                <strong className="text-purple-400">{factors.previousCaseCorrelation}%</strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">6. Mule Account Network</span>
                <strong className="text-rose-400">{factors.transactionRelationshipScore}%</strong>
              </div>
            </div>
          </div>

          {/* 4. Authorized Environmental Camera Telemetry */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-tech font-bold text-emerald-400 uppercase tracking-wide text-xs flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                4. Perimeter Camera Sensor Supporting Signal
              </h3>
              <span className="text-[10px] font-mono-code text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> ZERO BIOMETRIC ID
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono-code text-[11px] mt-2">
              <div>
                <span className="text-slate-500 block text-[10px]">SENSOR IDENTIFIER</span>
                <span className="text-white font-bold">{selectedLocation?.cameraId || 'CAM-ATM-01'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ENVIRONMENTAL ANOMALY</span>
                <span className="text-amber-300 font-bold">Loitering duration (6m 40s) &amp; idling</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">STATUTORY DISCLAIMER</span>
                <span className="text-slate-300">Supporting signal only; not evidence of guilt</span>
              </div>
            </div>
          </div>

          {/* 5. Human-in-the-Loop Investigator Verification Sign-Off */}
          <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-xl p-4 space-y-2">
            <h3 className="font-tech font-bold text-cyan-300 uppercase tracking-wide text-xs flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              5. Statutory Human-in-the-Loop Verification Sign-Off
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-code text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">DECISION STATUS</span>
                <span className="text-emerald-400 font-bold uppercase">CONFIRMED &amp; DISPATCHED</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">INVESTIGATOR</span>
                <span className="text-white font-bold">{verificationRecord?.officerName || currentUser.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">BADGE NUMBER</span>
                <span className="text-slate-300">{verificationRecord?.badgeNumber || currentUser.badgeNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">AFFIRMATION QUADRANTS</span>
                <span className="text-cyan-300 font-bold">4 / 4 Validated</span>
              </div>
            </div>
            <p className="text-slate-300 text-[11px] mt-2 font-body italic bg-slate-950 p-2 rounded border border-slate-800">
              "{verificationRecord?.justification || 'Correlated mule accounts confirm high-velocity layering from investment scam proceeds. Geographic isolation of Beach Road kiosk and sensor loitering pattern justify immediate P1 operational interception order.'}"
            </p>
          </div>

          {/* 6. Tactical Ground Interception Directives */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <h3 className="font-tech font-bold text-purple-400 uppercase tracking-wide text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              6. Field Interception Directives (QRT-04 Coastal Beat)
            </h3>
            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
              <li>Deploy plainclothes Quick Response Team (QRT-04) within 500m perimeter prior to 20:00 IST.</li>
              <li>Observe kiosk entry for individuals carrying multiple debit cards or operating with helmet visors down.</li>
              <li>Coordinate with Beach Road patrol desk; secure physical evidence, ATM transaction slips, and mobile handsets upon detention.</li>
              <li>Preserve civilian safety; avoid high-speed pursuit in crowded pedestrian concourses.</li>
            </ul>
          </div>

          {/* 7. Cryptographic Chain of Custody & Audit Seal */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono-code text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">AUTHENTICATING INVESTIGATOR</span>
              <span className="text-slate-200 font-bold">{currentUser.name}</span>
              <span className="text-slate-400 block text-[10px]">{currentUser.badgeNumber} • {currentUser.designation}</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-slate-500 block text-[10px]">CRYPTOGRAPHIC BLOCKCHAIN AUDIT SEAL</span>
              <span className="text-cyan-400 font-bold text-[10px]">SHA256:7f892a01ceb83492801f92e1</span>
              <span className="text-emerald-400 block text-[10px]">IMMUTABLE POLICE LEDGER BLOCK #4</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono-code text-slate-500">
            Smart India Hackathon • Predictive Cybercrime Intelligence Prototype (SIH-2026)
          </span>
          <button
            id="btn-dossier-dismiss"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
          >
            Close Advisory
          </button>
        </div>
      </div>
    </div>
  );
};
