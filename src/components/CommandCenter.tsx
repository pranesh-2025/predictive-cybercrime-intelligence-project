import React, { useState } from 'react';
import { DashboardStats, PredictedLocation } from '../types';
import { GisHeatmap } from './GisHeatmap';
import { TopRiskAtmPanel } from './TopRiskAtmPanel';
import { getRiskColorInfo } from '../utils/riskColors';
import { 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  FileText, 
  ArrowUpRight, 
  Sparkles, 
  CreditCard, 
  Activity, 
  Clock, 
  Radio,
  RefreshCw,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { HOURLY_RISK_TRENDS } from '../data/mockData';

interface CommandCenterProps {
  stats: DashboardStats;
  locations: PredictedLocation[];
  selectedLocation: PredictedLocation | null;
  onSelectLocation: (loc: PredictedLocation) => void;
  onNavigateToPredict: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToGis: () => void;
  onOpenReport: (alert?: undefined, location?: PredictedLocation) => void;
  onRefreshIntelligence?: () => void;
  isRefreshing?: boolean;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  stats,
  locations,
  selectedLocation,
  onSelectLocation,
  onNavigateToPredict,
  onNavigateToAlerts,
  onNavigateToGis,
  onOpenReport,
  onRefreshIntelligence,
  isRefreshing = false
}) => {
  const topRisks = [...locations].sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Law Enforcement Emergency Telemetry Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold tracking-wide uppercase text-slate-100">
                Predictive Cybercrime Operational Grid
              </h2>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono-code font-bold px-2 py-0.5 rounded">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-body mt-0.5">
              Forecasting probable ATM cash-out points within 120-minute post-complaint intercept windows.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onRefreshIntelligence && (
            <button
              id="btn-cmd-refresh-risk"
              onClick={onRefreshIntelligence}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-tech font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 disabled:opacity-50"
              title="Recalculate ATM and kiosk risks deterministically"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'Updating Risk...' : 'Update Risk'}</span>
            </button>
          )}
          <button
            id="btn-quick-intake-case"
            onClick={onNavigateToPredict}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold uppercase tracking-wider text-xs shadow-lg shadow-cyan-950/60 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Intake New Case &amp; Predict</span>
          </button>
          <button
            id="btn-view-critical-alerts"
            onClick={onNavigateToAlerts}
            className="px-3.5 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-300 font-tech font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>View Alerts ({stats.activeAlerts})</span>
          </button>
        </div>
      </div>

      {/* 4 Core Command Center Metrics (Strictly Requirement 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Cybercrime Complaints */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider">
              TOTAL COMPLAINTS
            </span>
            <div className="p-1.5 rounded-md bg-slate-800 text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-tech font-bold font-mono-code text-white">
              {stats.totalComplaints.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-mono-code text-emerald-400 flex items-center">
              +14 today
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono-code block mt-1">
            NCRP portal &amp; Helpline 1930 feeds
          </span>
        </div>

        {/* Metric 2: Active Alerts */}
        <div className="bg-slate-900/90 border border-red-900/40 rounded-xl p-4 shadow-xl relative overflow-hidden group hover:border-red-800 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-code text-red-300 uppercase tracking-wider">
              ACTIVE ALERTS
            </span>
            <div className="p-1.5 rounded-md bg-red-950/80 text-red-400 border border-red-800 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-tech font-bold font-mono-code text-red-400">
              {stats.activeAlerts}
            </span>
            <span className="text-[11px] font-mono-code text-red-400 font-semibold">
              URGENT
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono-code block mt-1">
            Exceeding 85% risk threshold
          </span>
        </div>

        {/* Metric 3: High-Risk Locations */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-code text-amber-300 uppercase tracking-wider">
              HIGH-RISK LOCATIONS
            </span>
            <div className="p-1.5 rounded-md bg-amber-950/60 text-amber-400 border border-amber-800">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-tech font-bold font-mono-code text-amber-300">
              {stats.highRiskLocationsCount}
            </span>
            <span className="text-[11px] font-mono-code text-slate-400">
              Active Kiosks
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono-code block mt-1">
            Coastal &amp; transit terminal clusters
          </span>
        </div>

        {/* Metric 4: Predicted Withdrawals */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-code text-cyan-300 uppercase tracking-wider">
              PREDICTED WITHDRAWALS
            </span>
            <div className="p-1.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-tech font-bold font-mono-code text-cyan-300">
              {stats.predictedWithdrawalsCount}
            </span>
            <span className="text-[11px] font-mono-code text-emerald-400">
              {stats.preventedLossTotal} saved
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono-code block mt-1">
            87% historical accuracy
          </span>
        </div>
      </div>

      {/* Main Grid: GIS Map (Tamil Nadu focused) + Risk Trend Chart + Quick Risk Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left GIS Heatmap (8 Cols) */}
        <div className="lg:col-span-8 h-[520px]">
          <GisHeatmap
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            onInvestigateLocation={(loc) => onOpenReport(undefined, loc)}
            onRefreshIntelligence={onRefreshIntelligence}
            isRefreshing={isRefreshing}
          />
        </div>

        {/* Right Side Column (4 Cols): Risk Trend Chart & High-Risk Kiosks */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Risk Trend Chart (Hourly curve) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-200">
                <Activity className="w-3.5 h-3.5 text-red-400" />
                <span className="font-tech font-bold uppercase tracking-wide">
                  24-Hour Cash-Out Surge Curve
                </span>
              </div>
              <span className="text-[10px] font-mono-code text-slate-500">
                RISK INDEX
              </span>
            </div>

            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_RISK_TRENDS} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="curveRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '10px' }} 
                    labelStyle={{ color: '#38bdf8' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="riskScore" 
                    name="Risk Index" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#curveRisk)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] font-mono-code text-slate-500 mt-1 flex justify-between">
              <span>Day Quiet Period</span>
              <span className="text-amber-400 font-semibold">Night Surge (20:00–22:00)</span>
            </div>
          </div>

          {/* Top High-Risk Locations Quick Intercept Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-tech text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  Top Priority ATM Targets
                </span>
                <button
                  onClick={onNavigateToGis}
                  className="text-[10px] font-mono-code text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
                >
                  Full GIS View <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {topRisks.map((loc) => {
                  const isSelected = selectedLocation?.id === loc.id;
                  const colorMeta = getRiskColorInfo(loc.riskScore, loc.riskLevel);
                  return (
                    <div
                      key={loc.id}
                      onClick={() => onSelectLocation(loc)}
                      className={`p-2.5 rounded-lg border transition cursor-pointer text-xs ${
                        isSelected 
                          ? 'bg-cyan-950/40 border-cyan-500' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                          <span className="font-mono-code font-bold text-cyan-300 text-[11px]">
                            {loc.atmCode}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="font-tech font-bold text-slate-200 truncate">
                            {loc.bank.split(' ')[0]}
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 font-mono-code font-bold text-xs ${colorMeta.text}`}>
                          <span>{colorMeta.emoji}</span>
                          <span>{loc.riskScore}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 mt-1">
                        <span className="truncate max-w-[130px]">{loc.district || loc.city}</span>
                        <span className="text-cyan-300 font-medium">{loc.peakCashOutWindow || loc.predictedWindow}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-code">
              <span className="text-slate-500">Autonomous patrol routing</span>
              <span className="text-cyan-400 font-semibold">QRT ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ATM & Bank Risk Intelligence Layer: Statewide Table with Filters, Search, and Sorting */}
      <div className="mt-2">
        <TopRiskAtmPanel
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={(loc) => {
            onSelectLocation(loc);
            onNavigateToGis();
          }}
          onRefreshIntelligence={onRefreshIntelligence}
          isRefreshing={isRefreshing}
          onOpenReport={(loc) => onOpenReport(undefined, loc)}
        />
      </div>
    </div>
  );
};
