import React, { useState } from 'react';
import { AuditLogEntry, UserProfile } from '../types';
import { AVAILABLE_USERS } from '../data/mockData';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  Database, 
  CheckCircle2, 
  Key, 
  Search,
  Check,
  XCircle,
  RefreshCw,
  Fingerprint,
  Link,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { verifyHashChainIntegrity } from '../utils/cryptoUtils';

interface SecurityAuditModalProps {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  auditLogs: AuditLogEntry[];
  onToggleTamperSimulation?: (blockId: string) => void;
  onRestoreChain?: () => void;
}

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({
  currentUser,
  setCurrentUser,
  auditLogs,
  onToggleTamperSimulation,
  onRestoreChain
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'LOGIN_RBAC' | 'AUDIT_LOG' | 'PRIVACY'>('AUDIT_LOG');
  const [searchLog, setSearchLog] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    checkedCount: number;
    corruptedBlockId?: string;
    errorReason?: string;
  } | null>(null);

  const rbacRoles = [
    {
      role: 'CHIEF_CYBER_INVESTIGATOR',
      title: 'Lead Cybercrime Investigator (Supervisory)',
      badge: 'TN-CYB-LEAD',
      permissions: [
        'Full AI Prediction Execution',
        'Direct QRT Tactical Dispatch',
        'Interception Advisory Generation',
        'Cross-District Multi-Sensor Access',
        'Audit Trail Inspection & Sign-off'
      ],
      desc: 'Authorised to sanction emergency plainclothes deployment and coordinate interstate coordination.'
    },
    {
      role: 'DISTRICT_ANALYST',
      title: 'District Intelligence Analyst',
      badge: 'TN-CYB-ANALYST',
      permissions: [
        'Case Ingestion & Scoring',
        'District Heatmap Diagnostics',
        'Camera Sensor Anomaly Review',
        'Preliminary Case Dossier Compilation'
      ],
      desc: 'Reviews incoming NCRP complaints and validates geospatial clustering within district jurisdiction.'
    },
    {
      role: 'FIELD_PATROL_LEAD',
      title: 'Field Patrol & Quick Response Team Lead',
      badge: 'TN-QRT-PATROL',
      permissions: [
        'Alert Acknowledgement & Status Updates',
        'Live Hotspot Perimeter Navigation',
        'Terminal Verification Feedback'
      ],
      desc: 'Receives rapid alerts on mobile data terminal for physical presence and surveillance around flagged ATMs.'
    },
    {
      role: 'AUDIT_OFFICER',
      title: 'Statutory Privacy & Judicial Auditor',
      badge: 'AUD-GOV-REG',
      permissions: [
        'Full Non-Repudiable Audit Log Inspection',
        'Cryptographic Hash Chain Verification',
        'Privacy Compliance Verification (Zero-PII Check)',
        'Algorithm Bias & False-Alarm Audit'
      ],
      desc: 'Ensures strict legal adherence to IT Act 2000 & safeguards against unauthorized facial surveillance.'
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    if (!searchLog) return true;
    const q = searchLog.toLowerCase();
    return log.action.toLowerCase().includes(q) ||
           log.officerName.toLowerCase().includes(q) ||
           log.details.toLowerCase().includes(q) ||
           log.resource.toLowerCase().includes(q) ||
           (log.hash && log.hash.toLowerCase().includes(q));
  });

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const result = verifyHashChainIntegrity(auditLogs);
      setVerificationResult({
        verified: result.isValid,
        checkedCount: result.checkedCount,
        corruptedBlockId: result.corruptedBlockId,
        errorReason: result.errorReason
      });
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-tech text-base font-bold text-slate-100 uppercase tracking-wide">
                Security Governance, RBAC &amp; Tamper-Evident Audit
              </h3>
              <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] px-2 py-0.5 rounded font-mono-code font-bold uppercase">
                SHA-256 Block Chained
              </span>
            </div>
            <p className="text-xs text-slate-400 font-body mt-0.5">
              Current Session: <span className="font-mono-code text-cyan-300 font-bold">{currentUser.name}</span> ({currentUser.badgeNumber}) • Role: <strong className="text-slate-200">{currentUser.role}</strong>
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs font-mono-code">
          <button
            id="subtab-audit-log"
            onClick={() => setActiveSubTab('AUDIT_LOG')}
            className={`px-3 py-1.5 rounded transition cursor-pointer ${
              activeSubTab === 'AUDIT_LOG' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cryptographic Audit ({auditLogs.length})
          </button>
          <button
            id="subtab-login-rbac"
            onClick={() => setActiveSubTab('LOGIN_RBAC')}
            className={`px-3 py-1.5 rounded transition cursor-pointer ${
              activeSubTab === 'LOGIN_RBAC' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Investigator RBAC Matrix
          </button>
          <button
            id="subtab-privacy"
            onClick={() => setActiveSubTab('PRIVACY')}
            className={`px-3 py-1.5 rounded transition cursor-pointer ${
              activeSubTab === 'PRIVACY' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Privacy &amp; IT Act
          </button>
        </div>
      </div>

      {/* Tab: Immutable Audit Log with Hash Chaining */}
      {activeSubTab === 'AUDIT_LOG' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-cyan-400" />
                <h4 className="font-tech text-base font-bold text-slate-100 uppercase tracking-wide">
                  Cryptographic Non-Repudiable Audit Chain
                </h4>
              </div>
              <p className="text-xs text-slate-400 font-body mt-0.5">
                Each telemetry scan, prediction run, and investigator sign-off is hashed with its predecessor (SHA-256), creating a court-admissible evidence record.
              </p>
            </div>

            {/* Cryptographic Verification Action Controls */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                id="btn-verify-hash-chain"
                onClick={handleVerifyChain}
                disabled={isVerifying}
                className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold uppercase text-xs tracking-wider transition cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Fingerprint className="w-4 h-4" />
                <span>{isVerifying ? 'Hashing Blocks...' : 'Verify Hash Chain'}</span>
              </button>

              {onToggleTamperSimulation && (
                <button
                  id="btn-simulate-tamper"
                  onClick={() => onToggleTamperSimulation('LOG-0003')}
                  className="px-3 py-2 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-700 font-tech font-bold uppercase text-xs transition cursor-pointer flex items-center gap-1.5"
                  title="Simulates unauthorized payload alteration to demonstrate cryptographic detection to SIH judges"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demonstrate Tamper Detection</span>
                </button>
              )}

              {onRestoreChain && (
                <button
                  id="btn-restore-chain"
                  onClick={onRestoreChain}
                  className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition cursor-pointer"
                  title="Restore pristine genesis chain"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Verification Result Banner */}
          {verificationResult && (
            <div className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
              verificationResult.verified
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                : 'bg-red-950/60 border-red-500/80 text-red-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  verificationResult.verified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {verificationResult.verified ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <div className="font-tech font-bold text-sm uppercase tracking-wide">
                    {verificationResult.verified 
                      ? 'CRYPTOGRAPHIC CHAIN VERIFIED • ZERO TAMPERING DETECTED' 
                      : 'EVIDENTIARY TAMPER DETECTED • HASH LINK BROKEN'}
                  </div>
                  <div className="text-xs font-mono-code mt-0.5">
                    {verificationResult.verified 
                      ? `All ${verificationResult.checkedCount} block hashes and digital signatures match mathematical payload verification.`
                      : verificationResult.errorReason}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono-code text-[11px] shrink-0">
                <span className="text-slate-400">Status: </span>
                <strong className={verificationResult.verified ? 'text-emerald-400' : 'text-red-400'}>
                  {verificationResult.verified ? 'VALID EVIDENCE LEDGER' : 'COMPROMISED'}
                </strong>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono-code pt-1">
            <span className="text-slate-400">
              Showing {filteredLogs.length} of {auditLogs.length} cryptographically chained blocks
            </span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                id="input-search-audit-log"
                type="text"
                placeholder="Filter logs or hash..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-500 font-mono-code w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Block #</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Officer &amp; Badge</th>
                  <th className="py-2.5 px-3">Action Event</th>
                  <th className="py-2.5 px-3">Target Resource</th>
                  <th className="py-2.5 px-3">Block Hash (SHA-256)</th>
                  <th className="py-2.5 px-3">Signature Seal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => {
                  const isTampered = log.isTampered;
                  return (
                    <tr key={log.id} className={`transition ${
                      isTampered ? 'bg-red-950/30 text-red-200' : 'hover:bg-slate-800/40'
                    }`}>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isTampered ? 'bg-red-500 text-white' : 'bg-slate-800 text-cyan-300'
                        }`}>
                          #{log.blockHeight || log.id.slice(-4)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-2.5 px-3 text-slate-200 font-medium whitespace-nowrap">
                        {log.officerName}
                        <span className="block text-[10px] text-slate-500">{log.badgeNumber}</span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isTampered 
                            ? 'bg-red-950 text-red-400 border border-red-800' 
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-amber-300 font-semibold whitespace-nowrap">{log.resource}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <code className={`text-[11px] font-mono-code ${
                            isTampered ? 'text-red-400 line-through' : 'text-slate-300'
                          }`}>
                            {log.hash ? `${log.hash.slice(0, 10)}...${log.hash.slice(-8)}` : 'GENESIS-BLOCK'}
                          </code>
                        </div>
                        {log.prevHash && (
                          <div className="text-[9px] text-slate-500 truncate max-w-[120px]">
                            prev: {log.prevHash.slice(0, 8)}...
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                          {log.signature ? log.signature.slice(0, 16) : 'VERIFIED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Investigator Login & RBAC Matrix */}
      {activeSubTab === 'LOGIN_RBAC' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <h4 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              Active Police Credentials &amp; Role Switcher
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {AVAILABLE_USERS.map((usr) => {
                const isActive = currentUser.id === usr.id;
                return (
                  <div
                    key={usr.id}
                    id={`card-switch-user-${usr.id}`}
                    onClick={() => setCurrentUser(usr)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isActive 
                        ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-950/40' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono-code text-[10px] text-cyan-400 font-semibold">
                          {usr.badgeNumber}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-mono-code bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <h5 className="font-tech font-bold text-slate-100 text-sm">
                        {usr.name}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {usr.designation}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono-code text-slate-500">
                      {usr.station}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <h4 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide mb-3">
              Role-Based Access Control (RBAC) Governance Architecture
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rbacRoles.map((roleItem, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="font-tech font-bold text-sm text-cyan-300">
                      {roleItem.title}
                    </span>
                    <span className="text-[10px] font-mono-code bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {roleItem.badge}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-3 leading-relaxed">
                    {roleItem.desc}
                  </p>
                  <div>
                    <span className="text-[10px] uppercase font-mono-code text-slate-500 block mb-1">
                      AUTHORIZED PRIVILEGES
                    </span>
                    <ul className="space-y-1">
                      {roleItem.permissions.map((perm, pidx) => (
                        <li key={pidx} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{perm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Privacy & Legal Framework */}
      {activeSubTab === 'PRIVACY' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-emerald-400 font-tech font-bold text-sm tracking-wide uppercase">
            <ShieldCheck className="w-5 h-5" />
            <span>Statutory Law Enforcement Privacy &amp; Data Governance Framework</span>
          </div>

          <div className="space-y-4 text-slate-300 leading-relaxed font-body">
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
              <h5 className="font-tech font-bold text-slate-100 text-sm mb-1 uppercase">
                1. Zero Biometric &amp; Facial Recognition Guarantee
              </h5>
              <p className="text-slate-400">
                In compliance with judicial guidelines and data privacy mandates, the authorized camera sensor module does NOT 
                run facial identification, facial recognition, or iris scanning. All camera signals are purely environmental 
                and motion-pattern indicators (e.g. loitering duration, off-hours door access, vehicle idling) to guide 
                investigator verification.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
              <h5 className="font-tech font-bold text-slate-100 text-sm mb-1 uppercase">
                2. Information Technology Act, 2000 (Section 43A &amp; Section 66F Compliance)
              </h5>
              <p className="text-slate-400">
                Data processed across this prototype is restricted to cyber complaint metadata, financial layering hop vectors, 
                and ATM coordinates. All PII of genuine victims is masked prior to algorithmic risk scoring.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
              <h5 className="font-tech font-bold text-slate-100 text-sm mb-1 uppercase">
                3. Synthetic &amp; Demo Data Indicator Notice
              </h5>
              <p className="text-slate-400">
                This software is configured in Synthetic Evaluation Mode specifically developed for the Smart India Hackathon. 
                All transaction IDs, bank accounts, and telemetry entries are realistic mathematical synthetic simulations designed 
                to demonstrate algorithmic viability. Predictions are decision-support aids for police teams, not autonomous 
                determinations of criminal culpability.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
