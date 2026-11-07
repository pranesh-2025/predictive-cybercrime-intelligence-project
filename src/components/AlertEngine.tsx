import React, { useState } from 'react';
import { AlertItem, AlertStatus, UserProfile, QrtDispatchInfo } from '../types';
import { 
  AlertOctagon, 
  CheckCircle2, 
  FileText, 
  Search, 
  Clock, 
  MapPin, 
  Radio, 
  ExternalLink,
  ShieldAlert,
  Car,
  Navigation,
  Send,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Zap,
  Filter
} from 'lucide-react';

interface AlertEngineProps {
  alerts: AlertItem[];
  onAlertAction: (
    alertId: string, 
    action: 'ACKNOWLEDGE' | 'INVESTIGATE' | 'DISPATCH' | 'RESOLVE' | 'ESCALATE'
  ) => Promise<void> | void;
  onGenerateReportForAlert: (alert: AlertItem) => void;
  onFocusLocation: (atmId: string) => void;
  onNavigateToVerification?: () => void;
  currentUser: UserProfile;
  qrtDispatch?: QrtDispatchInfo;
}

export const AlertEngine: React.FC<AlertEngineProps> = ({
  alerts,
  onAlertAction,
  onGenerateReportForAlert,
  onFocusLocation,
  onNavigateToVerification,
  currentUser,
  qrtDispatch = {
    unitId: 'QRT-04',
    callSign: 'DELTA-CHARLIE-4',
    targetAtmId: 'ATM-NGP-001',
    targetAtmName: 'Nagapattinam Port Coastal ATM Kiosk',
    sector: 'Nagapattinam Marine Coastal Sector 3',
    status: 'EN_ROUTE',
    etaMinutes: 8,
    dispatchTime: '19:44:10 IST',
    commander: 'Sub-Insp. S. Muthuvel',
    assignedOfficersCount: 4,
    tacticalDirectives: [
      'Cover all pedestrian and vehicular exit corridors around Beach Road Kiosk Cluster.',
      'Maintain discreet distance; wait for ATM transaction terminal activation before approach.',
      'Preserve physical ATM debit cards, transaction slips, and mobile handsets as evidence.'
    ]
  }
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'QRT_DISPATCH'>('ALERTS');

  const filteredAlerts = alerts.filter(a => {
    if (filterPriority !== 'ALL' && a.priority !== filterPriority) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  const criticalAlert = alerts.find(a => a.priority === 'CRITICAL' && a.status !== 'RESOLVED') || alerts[0];

  return (
    <div className="space-y-6">
      {/* Top Banner with Duplicate Prevention Seal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono-code">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-semibold">
            DUPLICATE ALERT PREVENTION SYSTEM ACTIVE
          </span>
          <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
            0 Duplicates Suppressed
          </span>
        </div>
        <div className="text-slate-400">
          Clustered by Terminal Code + Beneficiary Account + Expected Window
        </div>
      </div>

      {/* Spotlight Critical Alert Banner */}
      {criticalAlert && (
        <div className="bg-gradient-to-r from-red-950/90 via-slate-900 to-rose-950/70 border-2 border-red-600/80 rounded-xl p-5 shadow-2xl shadow-red-950/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-48 h-48 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-lg bg-red-600/20 text-red-400 border border-red-500/50 animate-pulse">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white font-mono-code font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider animate-pulse">
                    P1 CRITICAL ALERT • DISPATCH ACTIVE
                  </span>
                  <span className="text-red-300 font-mono-code text-xs">
                    {criticalAlert.alertCode}
                  </span>
                  <span className="text-slate-400 font-mono-code text-xs">
                    Case Ref: {criticalAlert.caseRef}
                  </span>
                </div>

                <h3 className="font-tech text-lg font-bold text-white uppercase tracking-wide mt-1">
                  IMMINENT MULE CASH-OUT TARGET: {criticalAlert.atmName}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2 font-mono-code">
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-400">TERMINAL:</span>
                    <strong className="text-cyan-400">{criticalAlert.atmId}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-400">RISK:</span>
                    <strong className="text-red-400 text-sm font-bold">{criticalAlert.riskScore}%</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-400">WINDOW:</span>
                    <strong className="text-amber-300">{criticalAlert.expectedWindow}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-400">TARGET AMOUNT:</span>
                    <strong className="text-emerald-400 font-bold">₹{criticalAlert.amount.toLocaleString('en-IN')}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-400">STATUS:</span>
                    <span className="text-cyan-300 font-bold">{criticalAlert.status}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons for Critical Alert */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
              {criticalAlert.status === 'ACTIVE' && (
                <button
                  id="btn-acknowledge-critical-alert"
                  onClick={() => onAlertAction(criticalAlert.id, 'ACKNOWLEDGE')}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-tech font-bold uppercase text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Acknowledge</span>
                </button>
              )}

              {onNavigateToVerification && (
                <button
                  id="btn-verify-critical-alert"
                  onClick={onNavigateToVerification}
                  className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold uppercase text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Verify Case</span>
                </button>
              )}

              <button
                id="btn-investigate-critical-alert"
                onClick={() => {
                  onAlertAction(criticalAlert.id, 'INVESTIGATE');
                  onFocusLocation(criticalAlert.atmId);
                }}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-tech font-bold uppercase text-xs shadow-lg shadow-blue-950 transition cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>GIS Locate</span>
              </button>

              <button
                id="btn-report-critical-alert"
                onClick={() => onGenerateReportForAlert(criticalAlert)}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-tech font-bold uppercase text-xs shadow-lg shadow-red-950 transition cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Official Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Response Team (QRT) Tactical Dispatch Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-950 border border-purple-800 text-purple-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-tech text-base font-bold text-slate-100 uppercase tracking-wide">
                  Quick Response Team (QRT) Tactical Interception Dispatch
                </h3>
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded font-mono-code font-bold">
                  GROUND OPERATION ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-body">
                Interception Unit: <strong className="text-purple-300">{qrtDispatch.unitId}</strong> (Call Sign: {qrtDispatch.callSign}) • Sector: {qrtDispatch.sector}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono-code uppercase">ETA to Kiosk</div>
              <div className="text-lg font-tech font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>~{qrtDispatch.etaMinutes} mins</span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-code text-cyan-300">
              Status: <span className="font-bold text-amber-400">{qrtDispatch.status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs font-mono-code">
          {/* Tactical Directive Column */}
          <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 space-y-2">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tactical Ground Directives Issued to Unit Commander</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              {qrtDispatch.tacticalDirectives.map((directive, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                  <span>{directive}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Commander & Comms Column */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Field Command Telemetry
              </div>
              <div className="mt-2 space-y-1 text-slate-400 text-[11px]">
                <div>Commander: <strong className="text-slate-200">{qrtDispatch.commander}</strong></div>
                <div>Officers Assigned: <strong className="text-cyan-300">{qrtDispatch.assignedOfficersCount} Officers</strong></div>
                <div>Secure Tactical Net: <strong className="text-purple-300">FREQ-CH-8 (Encrypted)</strong></div>
                <div>Target Terminal: <strong className="text-white">{qrtDispatch.targetAtmId}</strong></div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Dispatch Time: {qrtDispatch.dispatchTime}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Uplink
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Feed Section with P1 - P4 Triage */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide">
                Active Tactical Alert Queue (P1–P4 Triage)
              </h3>
              <p className="text-[11px] text-slate-400 font-body">
                Categorized by withdrawal probability, amount thresholds, and response urgency
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Filter */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-xs font-mono-code">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-2 py-1 rounded cursor-pointer transition ${
                    filterPriority === p 
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-semibold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p === 'CRITICAL' ? 'P1' : p === 'HIGH' ? 'P2' : p === 'MEDIUM' ? 'P3' : p === 'LOW' ? 'P4' : 'ALL'}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-xs font-mono-code">
              {['ALL', 'ACTIVE', 'INVESTIGATING', 'DISPATCHED', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2 py-1 rounded cursor-pointer transition ${
                    filterStatus === st 
                      ? 'bg-slate-800 text-white font-semibold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Items List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isP1 = alert.priority === 'CRITICAL';
            const isP2 = alert.priority === 'HIGH';
            const isP3 = alert.priority === 'MEDIUM';

            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    isP1 
                      ? 'bg-red-950/80 text-red-400 border border-red-800' 
                      : isP2 
                        ? 'bg-orange-950/80 text-orange-400 border border-orange-800' 
                        : isP3
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                  }`}>
                    <AlertOctagon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                        isP1 ? 'bg-red-500 text-white' :
                        isP2 ? 'bg-orange-500 text-white' :
                        isP3 ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {isP1 ? 'P1 CRITICAL' : isP2 ? 'P2 HIGH' : isP3 ? 'P3 MEDIUM' : 'P4 LOW'}
                      </span>
                      <span className="font-mono-code text-[11px] font-bold text-cyan-400">
                        {alert.alertCode}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 font-mono-code text-[11px]">
                        {alert.timestamp}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-mono-code font-bold ${
                        alert.status === 'ACTIVE' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                          : alert.status === 'INVESTIGATING'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : alert.status === 'DISPATCHED'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {alert.status}
                      </span>
                    </div>

                    <h4 className="font-tech font-bold text-sm text-slate-100 mt-1">
                      {alert.atmName} ({alert.atmId})
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-slate-400 mt-1.5 font-mono-code text-[11px]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {alert.region}
                      </span>
                      <span>•</span>
                      <span className="text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Window: {alert.expectedWindow}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        ₹{alert.amount.toLocaleString('en-IN')}
                      </span>
                      <span>•</span>
                      <span className="text-slate-300">
                        Case: {alert.caseRef}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <div className="text-right mr-2 hidden sm:block">
                    <div className="text-[10px] text-slate-500 font-mono-code uppercase">Risk Level</div>
                    <div className={`font-tech font-bold text-base ${isP1 ? 'text-red-400' : isP2 ? 'text-orange-400' : 'text-amber-400'}`}>
                      {alert.riskScore}%
                    </div>
                  </div>

                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() => onAlertAction(alert.id, 'ACKNOWLEDGE')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-tech uppercase text-xs transition cursor-pointer"
                    >
                      Ack
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onAlertAction(alert.id, 'INVESTIGATE');
                      onFocusLocation(alert.atmId);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-tech uppercase text-xs transition cursor-pointer"
                  >
                    GIS
                  </button>

                  <button
                    onClick={() => onGenerateReportForAlert(alert)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-tech uppercase text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Dossier</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
