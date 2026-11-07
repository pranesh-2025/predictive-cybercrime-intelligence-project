import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Bell, 
  Menu, 
  User, 
  Activity,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';

interface TopHeaderProps {
  currentUser: UserProfile;
  onOpenMobileSidebar: () => void;
  onSwitchUser?: (user: UserProfile) => void;
  availableUsers?: UserProfile[];
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  onOpenMobileSidebar,
  onSwitchUser,
  availableUsers = []
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('04 Sep 2026 20:17 IST');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      // Format as e.g. "04 Sep 2026 20:17 IST"
      try {
        const str = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
        setCurrentTime(`${str} ${timeStr} IST`);
      } catch {
        setCurrentTime('04 Sep 2026 20:17 IST');
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#090e17] border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xs md:text-sm font-tech font-bold text-slate-100 tracking-wider uppercase leading-tight">
              PREDICTIVE CYBERCRIME INTELLIGENCE SYSTEM
            </h1>
            <p className="hidden md:block text-[10px] text-slate-400 leading-tight truncate">
              Cybercrime Intelligence | Risk Prediction | GIS | Explainable AI | Human Verification
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* System Operational Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-[10px] font-mono-code font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SYSTEM OPERATIONAL</span>
        </div>

        {/* Live Date / Time */}
        <div className="hidden md:flex items-center text-[11px] font-mono-code text-slate-400 px-2 py-1 bg-slate-900/60 rounded border border-slate-800/60">
          <span>{currentTime}</span>
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer text-left"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold text-[10px]">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="text-[11px] font-bold text-slate-200 leading-tight flex items-center gap-1">
                {currentUser.name}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[9px] text-slate-400 leading-tight">
                {currentUser.designation || 'District Analyst'}
              </div>
            </div>
          </button>

          {/* User switcher dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-1.5 w-60 bg-[#0d1424] border border-slate-800 rounded-lg shadow-xl z-50 p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono-code text-slate-400 uppercase tracking-wider border-b border-slate-800">
                Switch Operational Persona
              </div>
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    if (onSwitchUser) onSwitchUser(u);
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left p-1.5 rounded text-xs flex items-center justify-between transition cursor-pointer ${
                    u.id === currentUser.id ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <p className="font-semibold leading-tight text-[11px]">{u.name}</p>
                    <p className="text-[9px] text-slate-400 truncate">{u.designation}</p>
                  </div>
                  {u.id === currentUser.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center shadow-md">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
