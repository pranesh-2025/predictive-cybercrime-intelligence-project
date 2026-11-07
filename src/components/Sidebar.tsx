import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldAlert, 
  MapPin, 
  GitFork, 
  FileCheck, 
  Video, 
  Bell, 
  Sliders, 
  BarChart3, 
  Search, 
  ShieldCheck, 
  FileSpreadsheet, 
  Settings,
  Shield,
  UserCheck
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenReportModal?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenReportModal,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    { label: 'COMMAND CENTER', icon: LayoutDashboard, tab: 'COMMAND_CENTER' as TabType },
    { label: 'CASE INTAKE', icon: FileText, tab: 'PREDICTION_ENGINE' as TabType },
    { label: 'RISK INTELLIGENCE', icon: ShieldAlert, tab: 'PREDICTION_ENGINE' as TabType },
    { label: 'GIS MAP', icon: MapPin, tab: 'GIS_MAP' as TabType, isGisMap: true },
    { label: 'TRANSACTION GRAPH', icon: GitFork, tab: 'TIMELINE' as TabType },
    { label: 'XAI DOSSIER', icon: FileCheck, tab: 'PREDICTION_ENGINE' as TabType },
    { label: 'CAMERA TELEMETRY', icon: Video, tab: 'SENSORS' as TabType },
    { label: 'ALERTS', icon: Bell, tab: 'ALERTS' as TabType, badge: '3' },
    { label: 'SIMULATION', icon: Sliders, tab: 'SIMULATION' as TabType },
    { label: 'ANALYTICS', icon: BarChart3, tab: 'ANALYTICS' as TabType },
    { label: 'INVESTIGATION', icon: Search, tab: 'TIMELINE' as TabType },
    { label: 'AUDIT TRAIL', icon: ShieldCheck, tab: 'SECURITY' as TabType },
    { label: 'REPORTS', icon: FileSpreadsheet, isAction: true, onClick: onOpenReportModal },
    { label: 'SYSTEM SETTINGS', icon: Settings, tab: 'SECURITY' as TabType },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-[#090e17] border-r border-slate-800/80 flex flex-col shrink-0
        transition-transform duration-200 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand / Logo */}
        <div className="p-4 border-b border-slate-800/80 bg-[#070b12]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-950/50 shrink-0">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <h1 className="font-tech font-bold text-xs tracking-wider text-slate-100 uppercase leading-tight truncate">
                PREDICTIVE CYBERCRIME
              </h1>
              <p className="text-[10px] text-cyan-400 font-semibold tracking-wide truncate">
                INTELLIGENCE SYSTEM
              </p>
            </div>
          </div>
          <p className="mt-2 text-[9px] text-slate-500 leading-tight">
            Cybercrime Intelligence | Risk Prediction | GIS | Explainable AI
          </p>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-2 px-2.5 space-y-0.5 scrollbar-thin">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = !item.isAction && activeTab === item.tab && (item.isGisMap ? activeTab === 'GIS_MAP' : true);

            return (
              <button
                key={idx}
                onClick={() => {
                  if (item.isAction && item.onClick) {
                    item.onClick();
                  } else if (item.tab) {
                    onSelectTab(item.tab);
                  }
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-xs font-medium transition-all cursor-pointer
                  ${isActive 
                    ? 'bg-cyan-950/60 text-cyan-300 font-semibold border-l-3 border-cyan-400 shadow-sm shadow-cyan-950/40' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-3 border-transparent'
                  }
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="flex-1 truncate tracking-wide text-[11px] font-tech font-bold uppercase">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono-code font-bold bg-red-600 text-white leading-tight shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Officer Info Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070b12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-200 truncate">OFF-024</span>
                <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold font-mono-code">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ONLINE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">District Analyst</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
