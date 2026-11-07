import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface RiskLegendProps {
  compact?: boolean;
  showDescriptions?: boolean;
  className?: string;
}

/**
 * STRICT 3-COLOR RISK LEGEND COMPONENT
 * 🔴 RED — HIGH (75%–100%)
 * 🔵 BLUE — MEDIUM (45%–74%)
 * 🟢 GREEN — LOW (0%–44%)
 * 
 * Enforces consistency across GIS Map, Command Center, and Panels.
 */
export const RiskLegend: React.FC<RiskLegendProps> = ({
  compact = false,
  showDescriptions = true,
  className = ''
}) => {
  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-2 text-[11px] font-mono-code ${className}`}>
        <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-cyan-400" /> Risk Scale:
        </span>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/80 border border-red-700 text-red-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>🔴 HIGH 75–100%</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700 text-blue-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>🔵 MEDIUM 45–74%</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>🟢 LOW 0–44%</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-950/90 border border-slate-800 rounded-lg p-3 shadow-xl backdrop-blur-md ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs font-tech font-bold uppercase tracking-wider text-slate-200">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>ATM &amp; Bank Risk Intelligence Scale</span>
        </div>
        <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          3-TIER OPERATIONAL
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Tier 1: HIGH */}
        <div className="p-2 rounded-lg bg-red-950/40 border border-red-800/80">
          <div className="flex items-center justify-between font-mono-code font-bold text-xs text-red-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
              🔴 HIGH RISK
            </span>
            <span className="text-red-300 bg-red-900/60 px-1.5 py-0.5 rounded text-[10px]">
              75%–100%
            </span>
          </div>
          {showDescriptions && (
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Immediate operational dispatch priority. Correlated mule layering &amp; rapid burst cash-outs.
            </p>
          )}
        </div>

        {/* Tier 2: MEDIUM */}
        <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-800/80">
          <div className="flex items-center justify-between font-mono-code font-bold text-xs text-blue-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              🔵 MEDIUM RISK
            </span>
            <span className="text-blue-300 bg-blue-900/60 px-1.5 py-0.5 rounded text-[10px]">
              45%–74%
            </span>
          </div>
          {showDescriptions && (
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Corridor surveillance &amp; perimeter sensor tracking. Secondary mule diversion node.
            </p>
          )}
        </div>

        {/* Tier 3: LOW */}
        <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/80">
          <div className="flex items-center justify-between font-mono-code font-bold text-xs text-emerald-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              🟢 LOW RISK
            </span>
            <span className="text-emerald-300 bg-emerald-900/60 px-1.5 py-0.5 rounded text-[10px]">
              0%–44%
            </span>
          </div>
          {showDescriptions && (
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Routine background audit logging. Standard genuine citizen and commuter cash traffic.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
