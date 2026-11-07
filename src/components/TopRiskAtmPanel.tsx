import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  MapPin, 
  TrendingUp, 
  Building2, 
  Clock, 
  AlertTriangle, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { PredictedLocation, RiskLevel } from '../types';
import { getRiskColorInfo } from '../utils/riskColors';
import { RiskLegend } from './RiskLegend';

interface TopRiskAtmPanelProps {
  locations: PredictedLocation[];
  selectedLocation: PredictedLocation | null;
  onSelectLocation: (location: PredictedLocation) => void;
  onRefreshIntelligence?: () => void;
  isRefreshing?: boolean;
  onOpenReport?: (location: PredictedLocation) => void;
  className?: string;
  showFilters?: boolean;
  maxItems?: number;
}

export const TopRiskAtmPanel: React.FC<TopRiskAtmPanelProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onRefreshIntelligence,
  isRefreshing = false,
  onOpenReport,
  className = '',
  showFilters = true,
  maxItems
}) => {
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique districts
  const districts = useMemo(() => {
    const set = new Set<string>();
    locations.forEach(loc => {
      if (loc.district) set.add(loc.district);
      else if (loc.city) set.add(loc.city);
    });
    return Array.from(set).sort();
  }, [locations]);

  // Sort and filter locations: Highest risk -> Lowest risk
  const sortedAndFiltered = useMemo(() => {
    return [...locations]
      .sort((a, b) => b.riskScore - a.riskScore)
      .filter(loc => {
        // District filter
        if (districtFilter !== 'ALL') {
          const locDistrict = loc.district || loc.city;
          if (locDistrict !== districtFilter) return false;
        }
        // Risk level filter
        if (riskFilter !== 'ALL' && loc.riskLevel !== riskFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = loc.atmCode.toLowerCase().includes(q);
          const matchName = loc.name.toLowerCase().includes(q);
          const matchBank = loc.bank.toLowerCase().includes(q);
          const matchArea = (loc.area || '').toLowerCase().includes(q);
          const matchDistrict = (loc.district || loc.city || '').toLowerCase().includes(q);
          if (!matchCode && !matchName && !matchBank && !matchArea && !matchDistrict) {
            return false;
          }
        }
        return true;
      });
  }, [locations, districtFilter, riskFilter, searchQuery]);

  const displayList = maxItems ? sortedAndFiltered.slice(0, maxItems) : sortedAndFiltered;

  return (
    <div className={`bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-700 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Highest Risk ATM &amp; Bank Kiosks
              <span className="bg-slate-800 text-cyan-400 text-[10px] font-mono-code px-2 py-0.5 rounded border border-slate-700">
                {displayList.length} Nodes
              </span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-mono-code mt-0.5">
            Ranked by AI cash-out probability (High to Low) • Supporting Intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRefreshIntelligence && (
            <button
              id="btn-refresh-risk-intel"
              onClick={onRefreshIntelligence}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition active:scale-95 disabled:opacity-50"
              title="Recalculates scores deterministically across all Tamil Nadu nodes"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'Updating...' : 'Update Risk'}</span>
            </button>
          )}

          <div className="hidden sm:block text-[10px] font-mono-code px-2 py-1 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300">
            SYNTHETIC DEMO DATA
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      {showFilters && (
        <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ATM ID, Bank, Area..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-code"
            />
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono-code text-slate-500 uppercase">District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              aria-label="Filter by district"
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono-code cursor-pointer"
            >
              <option value="ALL">All Tamil Nadu</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Risk Filter - STRICT 3 COLORS */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 font-mono-code text-[11px]">
            <button
              onClick={() => setRiskFilter('ALL')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${riskFilter === 'ALL' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setRiskFilter('HIGH')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition cursor-pointer ${riskFilter === 'HIGH' ? 'bg-red-950 border border-red-700 text-red-300 font-bold' : 'text-red-400/80 hover:text-red-300'}`}
            >
              <span>🔴</span>
              <span>High (75–100%)</span>
            </button>
            <button
              onClick={() => setRiskFilter('MEDIUM')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition cursor-pointer ${riskFilter === 'MEDIUM' ? 'bg-blue-950 border border-blue-700 text-blue-300 font-bold' : 'text-blue-400/80 hover:text-blue-300'}`}
            >
              <span>🔵</span>
              <span>Med (45–74%)</span>
            </button>
            <button
              onClick={() => setRiskFilter('LOW')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition cursor-pointer ${riskFilter === 'LOW' ? 'bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold' : 'text-emerald-400/80 hover:text-emerald-300'}`}
            >
              <span>🟢</span>
              <span>Low (0–44%)</span>
            </button>
          </div>
        </div>
      )}

      {/* ATM List Table / Cards */}
      <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[500px]">
        {displayList.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono-code text-xs">
            No ATM kiosks matching filter criteria.
          </div>
        ) : (
          displayList.map((loc, idx) => {
            const isSelected = selectedLocation?.id === loc.id;
            const colorMeta = getRiskColorInfo(loc.riskScore, loc.riskLevel);

            return (
              <div
                key={loc.id}
                id={`atm-row-${loc.atmCode}`}
                onClick={() => onSelectLocation(loc)}
                className={`p-3.5 transition cursor-pointer relative group ${
                  isSelected 
                    ? 'bg-slate-800/90 border-l-4 border-cyan-400 shadow-lg' 
                    : 'hover:bg-slate-800/50 bg-slate-900/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left Column: Rank + ATM ID + Bank + Location */}
                  <div className="flex items-start gap-3 min-w-[260px]">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono-code font-bold text-xs ${
                        idx === 0 
                          ? 'bg-red-600 text-white shadow-md shadow-red-900/60 ring-2 ring-red-400/50' 
                          : loc.riskScore >= 75 
                          ? 'bg-red-950 text-red-300 border border-red-700' 
                          : loc.riskScore >= 45 
                          ? 'bg-blue-950 text-blue-300 border border-blue-700' 
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      }`}>
                        #{idx + 1}
                      </span>
                      {loc.isFlagshipScenario && (
                        <span className="text-[9px] font-mono-code font-bold text-red-400 mt-1 uppercase">
                          SIH Top
                        </span>
                      )}
                    </div>

                    {/* ATM Core Details */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono-code font-bold text-sm text-cyan-300">
                          {loc.atmCode}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="font-tech font-bold text-slate-100 text-xs">
                          {loc.bank}
                        </span>
                        <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {loc.atmType || 'Kiosk'}
                        </span>
                        {loc.isFlagshipScenario && (
                          <span className="bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] px-1.5 py-0.5 rounded font-mono-code font-bold">
                            Nagapattinam Flagship
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300 font-body mt-1">
                        <span className="font-semibold text-slate-200">{loc.name}</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400 font-mono-code text-[11px]">
                          {loc.district || loc.city} ({loc.area || loc.region})
                        </span>
                      </div>

                      {/* Main Contributing Factor & Anomaly */}
                      <div className="mt-1.5 text-[11px] text-slate-400 leading-snug">
                        <span className="text-slate-500 font-mono-code">Primary Factor: </span>
                        <span className="text-slate-300 font-medium">
                          {loc.mainContributingFactor || loc.whyHighRisk?.[0] || 'Historical density and velocity anomaly'}
                        </span>
                      </div>

                      {/* Transaction Anomaly Callout */}
                      {loc.transactionAnomaly && (
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono-code text-amber-300/90">
                          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[420px]">{loc.transactionAnomaly}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Risk Metrics & Timing */}
                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    {/* Complaints & Peak Window */}
                    <div className="text-left md:text-right text-[11px] font-mono-code">
                      <div className="text-slate-300 font-semibold flex items-center md:justify-end gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>Peak: {loc.peakCashOutWindow || loc.predictedWindow}</span>
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        <span className="text-cyan-300 font-bold">{loc.relatedComplaints}</span> linked complaints
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Updated: {loc.lastUpdateTime || '19:48:15 IST'}
                      </div>
                    </div>

                    {/* Strict 3-Color Risk Score Badge */}
                    <div className="text-right shrink-0">
                      <div className={`px-3 py-1.5 rounded-lg border flex flex-col items-center justify-center min-w-[90px] ${colorMeta.badge}`}>
                        <div className="flex items-center gap-1 font-mono-code font-bold text-base leading-none">
                          <span>{colorMeta.emoji}</span>
                          <span className={colorMeta.text}>{loc.riskScore}%</span>
                        </div>
                        <span className="text-[9px] font-mono-code font-bold uppercase tracking-wider mt-1 text-slate-300">
                          {colorMeta.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Indicator Bar */}
                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-code text-cyan-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Target active on Tamil Nadu GIS Map
                    </span>
                    {onOpenReport && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenReport(loc);
                        }}
                        className="hover:underline flex items-center gap-1 text-slate-200 cursor-pointer"
                      >
                        Generate Incident Dossier <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Risk Legend */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <RiskLegend compact={true} />
        <span className="text-[10px] font-mono-code text-slate-500">
          Responsible AI • Zero Black-Box Decisions
        </span>
      </div>
    </div>
  );
};
