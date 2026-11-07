import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { PredictedLocation } from '../types';
import { 
  MapPin, 
  Layers, 
  Crosshair, 
  ExternalLink, 
  Radio, 
  Eye,
  RefreshCw,
  Clock,
  AlertTriangle,
  Building2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getRiskColorInfo } from '../utils/riskColors';
import { RiskLegend } from './RiskLegend';

interface GisHeatmapProps {
  locations: PredictedLocation[];
  selectedLocation: PredictedLocation | null;
  onSelectLocation: (loc: PredictedLocation) => void;
  onInvestigateLocation?: (loc: PredictedLocation) => void;
  onRefreshIntelligence?: () => void;
  isRefreshing?: boolean;
}

export const GisHeatmap: React.FC<GisHeatmapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onInvestigateLocation,
  onRefreshIntelligence,
  isRefreshing = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);

  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [showRings, setShowRings] = useState(true);
  const [showRankPanel, setShowRankPanel] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on Tamil Nadu
      const map = L.map(mapContainerRef.current, {
        center: [10.8505, 79.15],
        zoom: 7,
        zoomControl: true,
        attributionControl: false
      });

      // Dark styled OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        className: 'dark-tiles'
      }).addTo(map);

      L.control.attribution({ position: 'bottomright' })
        .addAttribution('&copy; OpenStreetMap | TN Cyber Crime Command GIS')
        .addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      circlesLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Render Markers & Density Heat Rings using STRICT 3-COLOR RULE
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !circlesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    circlesLayerRef.current.clearLayers();

    const filtered = locations.filter(loc => {
      if (riskFilter === 'ALL') return true;
      return loc.riskLevel === riskFilter;
    });

    filtered.forEach((loc) => {
      const isSelected = selectedLocation?.id === loc.id;
      const colorMeta = getRiskColorInfo(loc.riskScore, loc.riskLevel);
      const isHigh = loc.riskLevel === 'HIGH' || loc.riskScore >= 75;

      // Heat Risk Radius Circle
      if (showRings) {
        const radiusMeters = isHigh ? 3800 : loc.riskScore >= 45 ? 2400 : 1300;
        const heatCircle = L.circle([loc.lat, loc.lng], {
          radius: radiusMeters,
          color: colorMeta.hexStroke,
          weight: isSelected ? 2.5 : 1,
          opacity: 0.75,
          fillColor: colorMeta.hexFill,
          fillOpacity: isHigh ? 0.22 : loc.riskScore >= 45 ? 0.14 : 0.08
        });
        circlesLayerRef.current?.addLayer(heatCircle);
      }

      // Professional Tactical Marker HTML
      const bankAbbr = loc.bank.includes('SBI') || loc.bank.includes('State Bank') ? 'SBI'
        : loc.bank.includes('HDFC') ? 'HDFC'
        : loc.bank.includes('ICICI') ? 'ICICI'
        : loc.bank.includes('Axis') ? 'AXIS'
        : loc.bank.includes('Baroda') ? 'BOB'
        : loc.bank.includes('Canara') ? 'CAN'
        : 'ATM';

      const iconHtml = `
        <div class="relative flex flex-col items-center justify-center cursor-pointer group" style="transform: translate(-50%, -50%);">
          ${isHigh ? `<span class="absolute inline-flex h-9 w-9 rounded-full opacity-70 animate-ping" style="background-color: ${colorMeta.hexStroke};"></span>` : ''}
          <div class="relative flex items-center justify-center px-2 py-1 rounded-full text-[10px] font-mono-code font-bold text-white shadow-xl border-2 transition-transform duration-200 ${isSelected ? 'scale-125 ring-4 ring-cyan-400' : 'hover:scale-110'}" style="background-color: ${colorMeta.hexFill}; border-color: ${isSelected ? '#38bdf8' : '#ffffff'};">
            <span>${colorMeta.emoji}</span>
            <span class="ml-1">${loc.riskScore}%</span>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-[9px] font-mono-code text-slate-200 whitespace-nowrap shadow-md pointer-events-none">
            ${loc.atmCode} • ${bankAbbr}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-atm-marker-container',
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [locations, selectedLocation, riskFilter, showRings, onSelectLocation]);

  // Center on selected location smoothly
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 12, {
        duration: 1.2
      });
    }
  }, [selectedLocation]);

  // Focus quick-jumps
  const handleQuickJump = (lat: number, lng: number, zoom: number = 12) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1 });
    }
  };

  // Selected location color meta
  const selectedColorMeta = selectedLocation 
    ? getRiskColorInfo(selectedLocation.riskScore, selectedLocation.riskLevel)
    : null;

  // Sorted list for ranked quick-list
  const topRanked = [...locations].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Map Header Bar */}
      <div className="p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-tech text-sm font-bold uppercase tracking-wider text-slate-100">
                Tamil Nadu ATM &amp; Bank Risk Intelligence GIS
              </h3>
              <span className="bg-amber-950/60 text-amber-300 border border-amber-800 text-[9px] px-1.5 py-0.5 rounded font-mono-code">
                SYNTHETIC DEMO DATA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-body">
              3-Tier Strict Classification • Controlled Deterministic Evaluation
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Update Risk Button */}
          {onRefreshIntelligence && (
            <button
              id="btn-gis-refresh-risk"
              onClick={onRefreshIntelligence}
              disabled={isRefreshing}
              className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition active:scale-95 disabled:opacity-50"
              title="Recalculates risk scores deterministically"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'Updating...' : 'Update Risk'}</span>
            </button>
          )}

          {/* STRICT 3-COLOR FILTER TABS */}
          <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-mono-code">
            <button
              id="filter-risk-all"
              onClick={() => setRiskFilter('ALL')}
              className={`px-2 py-1 rounded cursor-pointer transition ${riskFilter === 'ALL' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              All ({locations.length})
            </button>
            <button
              id="filter-risk-high"
              onClick={() => setRiskFilter('HIGH')}
              className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition ${riskFilter === 'HIGH' ? 'bg-red-950 text-red-300 border border-red-700 font-bold' : 'text-red-400/80 hover:text-red-300'}`}
            >
              <span>🔴</span>
              <span>High</span>
            </button>
            <button
              id="filter-risk-medium"
              onClick={() => setRiskFilter('MEDIUM')}
              className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition ${riskFilter === 'MEDIUM' ? 'bg-blue-950 text-blue-300 border border-blue-700 font-bold' : 'text-blue-400/80 hover:text-blue-300'}`}
            >
              <span>🔵</span>
              <span>Med</span>
            </button>
            <button
              id="filter-risk-low"
              onClick={() => setRiskFilter('LOW')}
              className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition ${riskFilter === 'LOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold' : 'text-emerald-400/80 hover:text-emerald-300'}`}
            >
              <span>🟢</span>
              <span>Low</span>
            </button>
          </div>

          {/* Toggle Heat Rings */}
          <button
            id="toggle-heat-rings"
            onClick={() => setShowRings(!showRings)}
            className={`px-2 py-1 rounded-lg border text-xs font-medium flex items-center gap-1 transition cursor-pointer ${showRings ? 'bg-cyan-950/60 border-cyan-700 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Heat Radius</span>
          </button>

          {/* Toggle Ranked Sidebar */}
          <button
            onClick={() => setShowRankPanel(!showRankPanel)}
            className={`px-2 py-1 rounded-lg border text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${showRankPanel ? 'bg-slate-800 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Top ATMs</span>
            {showRankPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Quick Jump Hotspot Targets Bar */}
      <div className="px-3 py-1 bg-slate-950/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono-code scrollbar-none">
        <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
          <Crosshair className="w-3 h-3 text-cyan-400" /> Quick Hotspot:
        </span>
        <button
          id="jump-nagapattinam"
          onClick={() => {
            const ngpLoc = locations.find(l => l.atmCode === 'ATM-NGP-04' || l.id === 'atm-001');
            if (ngpLoc) onSelectLocation(ngpLoc);
            handleQuickJump(10.7656, 79.8424, 13);
          }}
          className="px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/80 transition whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <span>🔴</span>
          <span>Nagapattinam (Port ATM-NGP-04)</span>
        </button>
        <button
          id="jump-chennai-central"
          onClick={() => {
            const chnLoc = locations.find(l => l.atmCode === 'ATM-CHN-042');
            if (chnLoc) onSelectLocation(chnLoc);
            handleQuickJump(13.0827, 80.2707, 13);
          }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition whitespace-nowrap border border-slate-700 cursor-pointer"
        >
          Chennai Central (ATM-CHN-042)
        </button>
        <button
          id="jump-chennai-tnagar"
          onClick={() => {
            const tnrLoc = locations.find(l => l.atmCode === 'ATM-CHN-014');
            if (tnrLoc) onSelectLocation(tnrLoc);
            handleQuickJump(13.0418, 80.2341, 13);
          }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition whitespace-nowrap border border-slate-700 cursor-pointer"
        >
          Chennai T. Nagar (ATM-CHN-014)
        </button>
        <button
          id="jump-coimbatore"
          onClick={() => {
            const cbeLoc = locations.find(l => l.atmCode === 'ATM-CBE-007');
            if (cbeLoc) onSelectLocation(cbeLoc);
            handleQuickJump(11.0168, 76.9673, 13);
          }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition whitespace-nowrap border border-slate-700 cursor-pointer"
        >
          Coimbatore (ATM-CBE-007)
        </button>
        <button
          id="jump-state"
          onClick={() => handleQuickJump(10.8505, 79.15, 7)}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 transition whitespace-nowrap border border-cyan-800/40 cursor-pointer ml-auto"
        >
          Reset View (TN State)
        </button>
      </div>

      {/* SIH Flagship Scenario Explainer Banner (When Nagapattinam Port is selected or active) */}
      {(selectedLocation?.atmCode === 'ATM-NGP-04' || selectedLocation?.isFlagshipScenario) && (
        <div className="bg-red-950/50 border-b border-red-800/80 px-3.5 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-tech font-bold uppercase tracking-wider text-red-300 mr-2">
                FLAGSHIP SIH SCENARIO: NAGAPATTINAM COASTAL MULE CASH-OUT
              </span>
              <span className="text-[11px] text-slate-300 font-mono-code">
                #1 Statewide Priority Node • 9 Linked Telegram Investment Fraud Debits
              </span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono-code text-slate-400 overflow-x-auto">
            <span className="text-slate-200">Complaints (9)</span>
            <span>→</span>
            <span className="text-slate-200">Mule Layering</span>
            <span>→</span>
            <span className="text-red-400 font-bold">92% Risk</span>
            <span>→</span>
            <span className="text-cyan-400 font-bold">#1 ATM Rank</span>
            <span>→</span>
            <span className="text-slate-200">GIS Hotspot</span>
            <span>→</span>
            <span className="text-amber-300">Human Verify</span>
            <span>→</span>
            <span className="text-red-300 font-bold">P1 QRT-04</span>
          </div>
        </div>
      )}

      {/* Map Canvas and Interactive Overlays */}
      <div className="relative flex-1 min-h-[440px] w-full">
        <div ref={mapContainerRef} className="absolute inset-0 z-0" />

        {/* Selected Location Diagnostic Popup (Requirement 3: Professional Diagnostic Popup) */}
        {selectedLocation && selectedColorMeta && (
          <div className="absolute top-3 right-3 z-10 w-84 sm:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl shadow-black/80 text-xs">
            {/* Header: ID, Bank, Risk Score */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-code text-xs text-cyan-300 font-bold">
                    {selectedLocation.atmCode}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="font-tech font-bold text-slate-200 text-xs">
                    {selectedLocation.bank}
                  </span>
                </div>
                <h4 className="font-tech font-bold text-sm text-slate-100 leading-snug mt-0.5">
                  {selectedLocation.name}
                </h4>
                <div className="text-[11px] text-slate-400 font-mono-code mt-0.5 flex items-center gap-2">
                  <span>{selectedLocation.district || selectedLocation.city}</span>
                  <span>•</span>
                  <span className="text-slate-400">{selectedLocation.atmType || 'Kiosk'}</span>
                </div>
              </div>

              {/* STRICT 3-COLOR RISK BADGE */}
              <div className={`px-2.5 py-1 rounded-lg border text-right shrink-0 ${selectedColorMeta.badge}`}>
                <div className="flex items-center justify-end gap-1 font-mono-code font-bold text-sm">
                  <span>{selectedColorMeta.emoji}</span>
                  <span className={selectedColorMeta.text}>{selectedLocation.riskScore}%</span>
                </div>
                <div className="text-[9px] font-mono-code font-bold uppercase tracking-wider text-slate-300">
                  {selectedColorMeta.label}
                </div>
              </div>
            </div>

            {/* Diagnostic Details Grid */}
            <div className="space-y-2.5 mb-3 font-mono-code text-[11px]">
              {/* Location Address */}
              <div className="text-slate-300 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed text-slate-400">
                  {selectedLocation.address}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">PEAK CASH-OUT WINDOW</span>
                  <span className="font-semibold text-cyan-300">
                    {selectedLocation.peakCashOutWindow || selectedLocation.predictedWindow}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">RELATED COMPLAINTS</span>
                  <span className="font-semibold text-amber-400">
                    {selectedLocation.relatedComplaints} cases linked
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">LINKED MULE ACCOUNTS</span>
                  <span className="font-semibold text-red-400">
                    {selectedLocation.muleAccountLinks} flagged accounts
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">LAST TELEMETRY SYNC</span>
                  <span className="font-semibold text-slate-300">
                    {selectedLocation.lastUpdateTime || '19:48:15 IST'}
                  </span>
                </div>
              </div>

              {/* Transaction Anomaly (Required by prompt) */}
              {selectedLocation.transactionAnomaly && (
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-[11px]">
                  <div className="text-slate-400 font-semibold mb-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Transaction Anomaly:</span>
                  </div>
                  <div className="text-slate-300 leading-snug">
                    {selectedLocation.transactionAnomaly}
                  </div>
                </div>
              )}

              {/* Main Contributing Factor (XAI summary) */}
              <div className="text-[11px] text-slate-400">
                <span className="text-slate-500">Contributing Factor: </span>
                <span className="text-slate-300 font-medium">
                  {selectedLocation.mainContributingFactor || selectedLocation.whyHighRisk?.[0]}
                </span>
              </div>

              {/* Camera Supporting Signal */}
              {selectedLocation.cameraId && (
                <div className="flex items-center justify-between bg-cyan-950/40 border border-cyan-800/40 p-1.5 rounded px-2 text-cyan-300 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    Perimeter Sensor: {selectedLocation.cameraId}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">ONLINE</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                id="btn-close-location-card"
                onClick={() => onSelectLocation(null as unknown as PredictedLocation)}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer text-xs"
              >
                Dismiss
              </button>
              {onInvestigateLocation && (
                <button
                  id="btn-investigate-selected-location"
                  onClick={() => onInvestigateLocation(selectedLocation)}
                  className="flex-1 px-3 py-1.5 rounded bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-tech font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/50 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Investigate &amp; Dispatch Alert</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Expandable Ranked ATM Drawer on Map */}
        {showRankPanel && (
          <div className="absolute top-3 left-3 z-10 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl max-h-[380px] flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="font-tech text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                Statewide ATM Risk Ranking
              </span>
              <button
                onClick={() => setShowRankPanel(false)}
                className="text-[10px] text-slate-400 hover:text-white font-mono-code"
              >
                Hide
              </button>
            </div>
            <div className="overflow-y-auto space-y-1.5 divide-y divide-slate-800/60 flex-1">
              {topRanked.map((loc, idx) => {
                const colorMeta = getRiskColorInfo(loc.riskScore, loc.riskLevel);
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => onSelectLocation(loc)}
                    className={`pt-1.5 pb-1 px-2 rounded cursor-pointer transition text-xs ${isSelected ? 'bg-cyan-950/50 border border-cyan-500/50' : 'hover:bg-slate-800/60'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-code font-bold text-slate-400 text-[10px]">
                          #{idx + 1}
                        </span>
                        <span className="font-mono-code font-semibold text-slate-200">
                          {loc.atmCode}
                        </span>
                        <span className="text-[10px] text-slate-400">({loc.bank.split(' ')[0]})</span>
                      </div>
                      <span className={`font-mono-code font-bold text-xs ${colorMeta.text}`}>
                        {colorMeta.emoji} {loc.riskScore}%
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {loc.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Floating Strict Risk Legend on bottom right */}
        <div className="absolute bottom-3 right-3 z-10 max-w-sm hidden sm:block">
          <RiskLegend compact={true} className="bg-slate-950/90 border-slate-800 shadow-xl" />
        </div>

        {/* Bottom map status watermark */}
        <div className="absolute bottom-2 left-2 z-10 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded border border-slate-800 text-[10px] font-mono-code text-slate-400 pointer-events-none">
          GIS ENGINE: LEAFLET 1.9 • TAMIL NADU POLICE CYBER WING • SYNTHETIC DEMONSTRATION INTELLIGENCE
        </div>
      </div>

      {/* Bottom Risk Legend for Mobile */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 sm:hidden">
        <RiskLegend compact={true} />
      </div>
    </div>
  );
};
