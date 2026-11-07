import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Activity, 
  AlertTriangle,
  Lock,
  ChevronDown,
  MapPin,
  FileCheck2,
  Sliders,
  BarChart3
} from 'lucide-react';
import { TabType, UserProfile } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  availableUsers: UserProfile[];
  activeAlertsCount: number;
  onOpenReportModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  availableUsers,
  activeAlertsCount,
  onOpenReportModal
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'COMMAND_CENTER', label: 'Command Center', icon: Activity },
    { id: 'PREDICTION_ENGINE', label: 'Case Predictor', icon: ShieldAlert },
    { id: 'GIS_MAP', label: 'GIS Risk Heatmap', icon: MapPin },
    { id: 'SENSORS', label: 'Authorized Sensors', icon: ShieldCheck },
    { id: 'VERIFICATION', label: 'Human Verification', icon: UserCheck },
    { id: 'ALERTS', label: 'Alert Engine', icon: AlertTriangle, badge: activeAlertsCount },
    { id: 'TIMELINE', label: 'Investigation Timeline', icon: FileCheck2 },
    { id: 'SIMULATION', label: 'What-If Simulation', icon: Sliders },
    { id: 'ANALYTICS', label: 'Analytics', icon: BarChart3 },
    { id: 'SECURITY', label: 'Security & Audit', icon: Lock }
  ];

  return (
    <header className="border-b border-slate-800 bg-[#0c121e]/95 backdrop-blur sticky top-0 z-50">
      {/* Top Law-Enforcement Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-tech uppercase tracking-wider text-cyan-400 font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Smart India Hackathon Prototype
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hidden sm:inline font-mono-code text-[11px]">
              Tamil Nadu Cyber Crime Wing • Operational Cash-Out Intercept Grid
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-mono-code font-medium">
              SYNTHETIC EVALUATION MODE
            </span>
            <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-mono-code">
              <Lock className="w-3 h-3" />
              RESTRICTED POLICE VPN
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-900/30 border border-cyan-400/30">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-tech font-bold tracking-wide text-slate-100 uppercase">
                  Predictive Cybercrime Intelligence
                </h1>
                <span className="text-[10px] uppercase font-mono-code bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-semibold">
                  v2.4-SIH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-body">
                Predictive Analytics Framework for Cybercrime Complaints to Forecast Likely Cash Withdrawal Locations
              </p>
            </div>
          </div>

          {/* Right Action Area: Report Generation & Officer Profile */}
          <div className="flex items-center gap-3 self-end lg:self-center">
            {onOpenReportModal && (
              <button
                id="btn-generate-report"
                onClick={onOpenReportModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer shadow-sm hover:border-slate-600"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interception Dossier</span>
              </button>
            )}

            {/* Officer Switcher */}
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-xs text-left transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold text-[10px]">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <div className="font-medium text-slate-200 leading-tight flex items-center gap-1">
                    {currentUser.name}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-cyan-400/90 font-mono-code">
                    {currentUser.badgeNumber}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-lg bg-slate-900 border border-slate-700 shadow-xl shadow-black/80 py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Active Investigator Profile
                    </p>
                    <p className="text-xs text-slate-300 font-tech font-bold mt-1">
                      {currentUser.designation}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {currentUser.station}
                    </p>
                  </div>
                  <div className="py-1">
                    {availableUsers.map((usr) => (
                      <button
                        key={usr.id}
                        id={`btn-select-user-${usr.id}`}
                        onClick={() => {
                          setCurrentUser(usr);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2.5 hover:bg-slate-800 transition cursor-pointer ${
                          currentUser.id === usr.id ? 'bg-cyan-950/40 text-cyan-300' : 'text-slate-300'
                        }`}
                      >
                        <UserCheck className={`w-4 h-4 mt-0.5 ${currentUser.id === usr.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <div>
                          <div className="font-medium">{usr.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono-code">
                            {usr.badgeNumber} • {usr.role.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto pt-3 border-t border-slate-800/60 mt-3 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-tech tracking-wide uppercase font-semibold transition whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono-code bg-red-500 text-white font-bold animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
