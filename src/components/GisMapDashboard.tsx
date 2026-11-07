import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { PredictedLocation } from '../types';
import { 
  Shield, 
  MapPin, 
  RefreshCw, 
  ChevronDown, 
  AlertCircle, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Coins, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Compass, 
  Plus, 
  Minus, 
  Crosshair, 
  ExternalLink,
  Building,
  Target
} from 'lucide-react';
import { BankLogo } from './BankLogos';

interface GisMapDashboardProps {
  locations: PredictedLocation[];
  selectedLocation: PredictedLocation | null;
  onSelectLocation: (loc: PredictedLocation) => void;
  onInvestigateLocation?: (loc: PredictedLocation) => void;
  onRefreshIntelligence?: () => void;
  isRefreshing?: boolean;
}

export const GisMapDashboard: React.FC<GisMapDashboardProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onInvestigateLocation,
  onRefreshIntelligence,
  isRefreshing = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const calloutLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState('Tamil Nadu');
  const [activeSort, setActiveSort] = useState<'risk' | 'time'>('risk');

  // Find Nagapattinam flagship ATM or active selected
  const activeAtm = selectedLocation || locations.find(l => l.atmCode === 'ATM-NGP-04') || locations[0];

  // Ranked ATM list matching prompt requirements & screenshot
  const sortedAtms = [...locations].sort((a, b) => b.riskScore - a.riskScore);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on Tamil Nadu
      const map = L.map(mapContainerRef.current, {
        center: [10.8505, 79.15],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      // Dark styled CartoDB / OSM tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      calloutLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers and Nagapattinam Callout on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !calloutLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    calloutLayerRef.current.clearLayers();

    // Add city label annotations to give geographic orientation like in the image
    const cityLabels = [
      { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
      { name: 'Coimbatore', lat: 11.0168, lng: 76.9673 },
      { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
      { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
      { name: 'Nagapattinam', lat: 10.7656, lng: 79.8424 },
      { name: 'Bay of Bengal', lat: 11.5, lng: 81.2, isWater: true }
    ];

    cityLabels.forEach(city => {
      const cityIcon = L.divIcon({
        className: 'city-label-icon',
        html: `<div class="text-[11px] font-tech font-bold uppercase tracking-wider ${city.isWater ? 'text-slate-600 italic' : 'text-slate-400/90'} pointer-events-none drop-shadow">${city.name}</div>`,
        iconSize: [120, 20],
        iconAnchor: [60, 10]
      });
      L.marker([city.lat, city.lng], { icon: cityIcon, interactive: false }).addTo(markersLayerRef.current!);
    });

    // Render ATMs
    locations.forEach((loc) => {
      const isSelected = activeAtm?.id === loc.id;
      const isHigh = loc.riskScore >= 75;
      const isMed = loc.riskScore >= 45 && loc.riskScore < 75;

      // Strictly 3 colors: RED, BLUE, GREEN
      const color = isHigh ? '#ef4444' : isMed ? '#3b82f6' : '#10b981';
      const glow = isHigh ? 'rgba(239, 68, 68, 0.4)' : isMed ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)';

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group" style="transform: translate(-50%, -50%);">
          ${isHigh ? `<span class="absolute inline-flex h-7 w-7 rounded-full animate-ping opacity-60" style="background-color: ${color}"></span>` : ''}
          <div class="relative w-4 h-4 rounded-full border-2 border-white/90 shadow-lg flex items-center justify-center transition-transform hover:scale-125 ${isSelected ? 'ring-4 ring-cyan-400 scale-125' : ''}" style="background-color: ${color}; box-shadow: 0 0 10px ${glow}">
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: markerHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });
      marker.on('click', () => {
        onSelectLocation(loc);
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // Render Callout for activeAtm / Nagapattinam
    if (activeAtm) {
      const isHigh = activeAtm.riskScore >= 75;
      const isMed = activeAtm.riskScore >= 45 && activeAtm.riskScore < 75;
      const levelLabel = isHigh ? 'HIGH' : isMed ? 'MEDIUM' : 'LOW';
      const colorHex = isHigh ? '#ef4444' : isMed ? '#3b82f6' : '#10b981';

      const calloutHtml = `
        <div class="relative flex flex-col items-center pointer-events-none" style="transform: translate(-50%, -100%); margin-top: -10px;">
          <div class="px-2.5 py-1.5 rounded-md bg-[#0a0f1d]/95 border border-red-500 shadow-xl shadow-red-950/50 flex flex-col items-center">
            <span class="text-[11px] font-tech font-bold text-white tracking-wider whitespace-nowrap">
              ${activeAtm.bank.includes('SBI') ? 'SBI' : activeAtm.bank.includes('HDFC') ? 'HDFC' : 'ICICI'} ${activeAtm.atmCode}
            </span>
            <span class="text-[10px] font-mono-code font-bold tracking-tight" style="color: ${colorHex}">
              ${activeAtm.riskScore}% (${levelLabel})
            </span>
          </div>
          <div class="w-2 h-2 rotate-45 bg-[#0a0f1d] border-r border-b border-red-500 -mt-1"></div>
        </div>
      `;

      const calloutIcon = L.divIcon({
        className: 'custom-callout-overlay',
        html: calloutHtml,
        iconSize: [140, 50],
        iconAnchor: [70, 0]
      });

      const calloutMarker = L.marker([activeAtm.lat, activeAtm.lng], { 
        icon: calloutIcon,
        interactive: false,
        zIndexOffset: 1000
      });
      calloutLayerRef.current?.addLayer(calloutMarker);
    }
  }, [locations, activeAtm, onSelectLocation]);

  // Zoom controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    if (activeAtm && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([activeAtm.lat, activeAtm.lng], 10, { duration: 1 });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([10.8505, 79.15], 7, { duration: 1 });
    }
  };

  // Circular gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const activeScore = activeAtm?.riskScore || 91;
  const strokeDashoffset = circumference - (activeScore / 100) * circumference;

  return (
    <div className="space-y-4 pb-8">
      {/* ============================================================ */}
      {/* ROW 1: 5 KPI STATS CARDS                                     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Complaints */}
        <div className="bg-[#0c121e] border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-tech font-bold text-slate-400 uppercase tracking-wider">
              TOTAL COMPLAINTS
            </span>
            <div className="w-6 h-6 rounded-full bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-tech font-bold text-slate-100 tracking-tight">12,482</span>
            <span className="text-[11px] font-mono-code font-bold text-red-400 flex items-center">
              ↑ 8.4% today
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/50 text-[10px] font-mono-code text-slate-500">
            Last updated: 20:17 IST
          </div>
        </div>

        {/* Card 2: Active Critical Alerts */}
        <div className="bg-[#0c121e] border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-tech font-bold text-slate-400 uppercase tracking-wider">
              ACTIVE CRITICAL ALERTS
            </span>
            <div className="w-6 h-6 rounded-full bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-tech font-bold text-slate-100 tracking-tight">7</span>
            <span className="text-[11px] font-mono-code font-bold text-red-400 flex items-center">
              ↑ 2 new
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/50 text-[10px] font-mono-code text-slate-500">
            Last updated: 20:17 IST
          </div>
        </div>

        {/* Card 3: High-Risk Kiosks */}
        <div className="bg-[#0c121e] border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-tech font-bold text-slate-400 uppercase tracking-wider">
              HIGH-RISK KIOSKS
            </span>
            <div className="w-6 h-6 rounded-full bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-tech font-bold text-slate-100 tracking-tight">18</span>
            <span className="text-[11px] font-mono-code font-bold text-red-400 flex items-center">
              ↑ 3 new
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/50 text-[10px] font-mono-code text-slate-500">
            Last updated: 20:17 IST
          </div>
        </div>

        {/* Card 4: Predicted Cash-Out Volume */}
        <div className="bg-[#0c121e] border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-tech font-bold text-slate-400 uppercase tracking-wider">
              PREDICTED CASH-OUT VOLUME
            </span>
            <div className="w-6 h-6 rounded-full bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-tech font-bold text-slate-100 tracking-tight">₹ 4.8 Cr</span>
            <span className="text-[11px] font-mono-code font-bold text-emerald-400 flex items-center">
              ↑ 12.6% today
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/50 text-[10px] font-mono-code text-slate-500">
            Last updated: 20:17 IST
          </div>
        </div>

        {/* Card 5: Est. Loss Prevented */}
        <div className="bg-[#0c121e] border border-slate-800/80 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-tech font-bold text-slate-400 uppercase tracking-wider">
              EST. LOSS PREVENTED
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-tech font-bold text-slate-100 tracking-tight">₹ 18.7 L</span>
            <span className="text-[11px] font-mono-code font-bold text-emerald-400 flex items-center">
              ↑ 6.3% today
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/50 text-[10px] font-mono-code text-slate-500">
            Last updated: 20:17 IST
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROW 2: MAP (68%) + ATM RISK RANKING TABLE (32%)              */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Panel (Left ~68%) */}
        <div className="lg:col-span-8 bg-[#0c121e] border border-slate-800/80 rounded-xl overflow-hidden shadow-lg flex flex-col">
          {/* Map Header */}
          <div className="p-3.5 bg-[#090e17] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs md:text-sm font-tech font-bold text-slate-100 tracking-wider uppercase leading-tight">
                  ATM & BANK RISK INTELLIGENCE
                </h2>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Nearby ATMs / Bank Kiosks with Risk Score
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Synthetic demo data badge */}
              <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/80 text-amber-300 font-mono-code font-bold text-[10px] tracking-wider uppercase shadow-xs">
                SYNTHETIC DEMO DATA
              </span>

              {/* District Dropdown */}
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    if (e.target.value === 'Nagapattinam' && mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([10.7656, 79.8424], 12, { duration: 1 });
                    } else if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([10.8505, 79.15], 7, { duration: 1 });
                    }
                  }}
                  className="appearance-none bg-slate-900 border border-slate-700 text-slate-200 text-xs font-tech font-bold px-3 py-1.5 pr-7 rounded-lg cursor-pointer hover:border-slate-600 focus:outline-hidden"
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Nagapattinam">Nagapattinam District</option>
                  <option value="Chennai">Chennai Central</option>
                  <option value="Coimbatore">Coimbatore West</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              {/* Refresh button */}
              <button
                onClick={onRefreshIntelligence}
                disabled={isRefreshing}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 text-xs font-tech font-bold transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Map View Canvas */}
          <div className="relative w-full h-[460px] bg-[#070b14]">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Custom Map Zoom / Recenter Controls (Top Left) */}
            <div className="absolute top-3 left-3 z-[400] flex flex-col gap-1.5">
              <button
                onClick={handleZoomIn}
                className="w-7 h-7 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shadow-lg transition cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-7 h-7 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shadow-lg transition cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRecenter}
                className="w-7 h-7 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shadow-lg transition cursor-pointer"
                title="Recenter Map"
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom-Left Legend Overlay (Strict 3 Colors) */}
            <div className="absolute bottom-3 left-3 z-[400] bg-[#090e17]/90 backdrop-blur-xs border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-3 text-[11px] font-mono-code font-bold shadow-xl">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50"></span>
                <span>HIGH (75–100%)</span>
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-sm shadow-blue-500/50"></span>
                <span>MEDIUM (45–74%)</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50"></span>
                <span>LOW (0–44%)</span>
              </span>
            </div>

            {/* Bottom-Right Scale & Compass Overlay */}
            <div className="absolute bottom-3 right-3 z-[400] flex items-center gap-2">
              <div className="bg-[#090e17]/90 border border-slate-800 rounded px-2 py-0.5 text-[9px] font-mono-code text-slate-400 flex flex-col items-center">
                <span>0 &nbsp;&nbsp;&nbsp; 50 &nbsp;&nbsp;&nbsp; 100 km</span>
                <div className="w-24 h-0.5 bg-slate-500 flex justify-between">
                  <div className="w-0.5 h-1.5 bg-slate-400 -mt-0.5"></div>
                  <div className="w-0.5 h-1.5 bg-slate-400 -mt-0.5"></div>
                  <div className="w-0.5 h-1.5 bg-slate-400 -mt-0.5"></div>
                </div>
              </div>

              <div 
                onClick={handleRecenter}
                className="w-7 h-7 rounded-full bg-[#090e17]/90 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition shadow-lg cursor-pointer"
                title="North Compass"
              >
                <div className="w-3 h-3 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-red-500"></div>
                  <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[6px] border-t-slate-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ATM Risk Ranking Table Panel (Right ~32%) */}
        <div className="lg:col-span-4 bg-[#0c121e] border border-slate-800/80 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="p-3.5 bg-[#090e17] border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-tech font-bold text-slate-200 tracking-wider uppercase">
                  ATM RISK RANKING (NEARBY)
                </h3>
              </div>
              <button 
                onClick={() => {
                  if (activeAtm && onInvestigateLocation) onInvestigateLocation(activeAtm);
                }}
                className="text-[11px] font-tech text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
              >
                View All
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[10px] font-mono-code text-slate-400 uppercase tracking-wider bg-slate-950/40">
                    <th className="py-2 px-2.5 w-7 text-center">#</th>
                    <th className="py-2 px-2.5">ATM / Bank</th>
                    <th className="py-2 px-2 text-right">Risk %</th>
                    <th className="py-2 px-2 text-center">Level</th>
                    <th className="py-2 px-2.5 text-right">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs">
                  {sortedAtms.slice(0, 8).map((atm, idx) => {
                    const isCurrent = activeAtm?.id === atm.id;
                    const isHigh = atm.riskScore >= 75;
                    const isMed = atm.riskScore >= 45 && atm.riskScore < 75;
                    const levelLabel = isHigh ? 'HIGH' : isMed ? 'MEDIUM' : 'LOW';

                    return (
                      <tr
                        key={atm.id}
                        onClick={() => onSelectLocation(atm)}
                        className={`cursor-pointer transition-colors ${
                          isCurrent 
                            ? 'bg-cyan-950/40 hover:bg-cyan-950/50' 
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Rank # */}
                        <td className="py-2.5 px-2.5 text-center">
                          <span className={`inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-mono-code font-bold ${
                            isHigh ? 'bg-red-950 text-red-400 border border-red-800/80' :
                            isMed ? 'bg-blue-950 text-blue-400 border border-blue-800/80' :
                            'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>

                        {/* ATM / Bank with crisp bank logo */}
                        <td className="py-2.5 px-2.5">
                          <div className="flex items-center gap-2">
                            <BankLogo bankName={atm.bank} size={22} />
                            <div className="min-w-0">
                              <p className="font-tech font-bold text-xs text-slate-200 leading-tight truncate">
                                {atm.bank.includes('SBI') ? 'SBI' : atm.bank.includes('HDFC') ? 'HDFC' : atm.bank.includes('ICICI') ? 'ICICI' : atm.bank.includes('Axis') ? 'Axis' : atm.bank.includes('Indian') ? 'Indian Bank' : 'ATM'} {atm.atmCode}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate leading-tight">
                                {atm.district || 'Nagapattinam'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Risk % */}
                        <td className="py-2.5 px-2 text-right">
                          <span className={`font-mono-code font-bold text-xs ${
                            isHigh ? 'text-red-400' : isMed ? 'text-blue-400' : 'text-emerald-400'
                          }`}>
                            {atm.riskScore}%
                          </span>
                        </td>

                        {/* Level pill */}
                        <td className="py-2.5 px-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold uppercase tracking-wider ${
                            isHigh ? 'bg-red-950/80 text-red-400 border border-red-800/80' :
                            isMed ? 'bg-blue-950/80 text-blue-400 border border-blue-800/80' :
                            'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                          }`}>
                            {levelLabel}
                          </span>
                        </td>

                        {/* Updated timestamp */}
                        <td className="py-2.5 px-2.5 text-right font-mono-code text-[10px] text-slate-400">
                          {atm.lastUpdateTime.includes(':') && atm.lastUpdateTime.length <= 8 
                            ? atm.lastUpdateTime 
                            : '20:17'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-2 border-t border-slate-800/80 bg-slate-950/40 text-center">
            <span className="text-[10px] font-mono-code text-slate-500">
              Showing top risk ranked kiosks for current operational shift
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROW 3: THREE SERIALLY ALIGNED DETAIL CARDS UNDERNEATH        */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Selected Kiosk Details */}
        <div className="bg-[#0c121e] border border-slate-800/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400 shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-tech font-bold text-sm text-slate-100 uppercase tracking-wider leading-tight">
                    {activeAtm.atmCode}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {activeAtm.bank} | ATM | {activeAtm.district}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold tracking-wider uppercase ${
                activeAtm.riskScore >= 75 ? 'bg-red-950 text-red-400 border border-red-800' :
                activeAtm.riskScore >= 45 ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {activeAtm.riskScore >= 75 ? 'HIGH RISK' : activeAtm.riskScore >= 45 ? 'MEDIUM RISK' : 'LOW RISK'}
              </span>
            </div>

            {/* Circular Gauge & Metrics */}
            <div className="mt-4 flex items-center gap-5">
              {/* Circular Gauge */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="text-slate-800 stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Glowing Progress Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="transition-all duration-700 ease-out"
                    stroke={activeAtm.riskScore >= 75 ? '#ef4444' : activeAtm.riskScore >= 45 ? '#3b82f6' : '#10b981'}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-tech font-bold text-slate-100 tracking-tight leading-none">
                    {activeAtm.riskScore}%
                  </span>
                  <span className="text-[9px] font-mono-code text-slate-400 uppercase tracking-wide mt-0.5">
                    Risk Score
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-2 text-xs flex-1">
                <div>
                  <div className="text-[10px] font-mono-code text-slate-400 uppercase">Related Complaints</div>
                  <div className="font-tech font-bold text-slate-200 text-sm flex items-center gap-1.5">
                    <span>{activeAtm.relatedComplaints}</span>
                    <span className="text-[10px] text-amber-400 font-mono-code font-normal">
                      • Transaction Anomaly
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono-code text-slate-400 uppercase">Threat Level</div>
                  <div className={`font-tech font-bold text-xs uppercase ${
                    activeAtm.riskScore >= 75 ? 'text-red-400' : activeAtm.riskScore >= 45 ? 'text-blue-400' : 'text-emerald-400'
                  }`}>
                    {activeAtm.riskScore >= 75 ? 'High' : activeAtm.riskScore >= 45 ? 'Medium' : 'Low'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono-code text-slate-400 uppercase">Peak Window</div>
                  <div className="font-mono-code font-medium text-slate-300 text-xs">
                    {activeAtm.peakCashOutWindow || '20:00 – 22:00'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
            <span className="truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
              <span>Location: {activeAtm.address || 'Velankanni Road, Nagapattinam, Tamil Nadu'}</span>
            </span>
            <span className="shrink-0 text-slate-500">
              Last Updated: {activeAtm.lastUpdateTime.includes(':') ? activeAtm.lastUpdateTime : '20:17'} IST
            </span>
          </div>
        </div>

        {/* Card 2: Why Ranked #1? */}
        <div className="bg-[#0c121e] border border-slate-800/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-3">
              <h3 className="font-tech font-bold text-xs text-slate-200 tracking-wider uppercase">
                Why Ranked #{sortedAtms.findIndex(a => a.id === activeAtm.id) + 1}?
              </h3>
              <span className="text-[10px] font-mono-code text-slate-400">
                XAI Decision Factors
              </span>
            </div>

            <div className="flex items-start gap-4">
              {/* Checklist */}
              <ul className="space-y-1.5 flex-1 text-xs">
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="text-[11px]">7 related complaints within 2.5 km</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="text-[11px]">4 unusual withdrawals after 20:00</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="text-[11px]">₹8.4L aggregate withdrawal</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="text-[11px]">3 correlated accounts</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="text-[11px]">2 previous incidents</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="text-[11px]">Major transit corridor proximity</span>
                </li>
              </ul>

              {/* Confidence Box */}
              <div className="shrink-0 bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-center flex flex-col items-center justify-center w-28">
                <span className="text-[10px] font-mono-code text-slate-400 uppercase">Confidence</span>
                <span className="text-2xl font-tech font-bold text-cyan-400 my-0.5">84%</span>
                <button
                  onClick={() => {
                    if (onInvestigateLocation) onInvestigateLocation(activeAtm);
                  }}
                  className="mt-1 w-full px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[10px] font-tech font-bold uppercase transition cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-800/60 text-[10px] font-mono-code text-slate-500 flex items-center justify-between">
            <span>Explainable AI Engine v4.2</span>
            <span>Deterministic Scoring</span>
          </div>
        </div>

        {/* Card 3: Real-time Updates */}
        <div className="bg-[#0c121e] border border-slate-800/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-tech font-bold text-xs text-slate-200 tracking-wider uppercase">
                  Real-time Updates
                </h3>
              </div>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[9px] font-mono-code font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE
              </span>
            </div>

            {/* Event Timeline */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="font-mono-code text-[11px] text-slate-500 shrink-0 mt-0.5">20:17</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-[11px] leading-snug">
                    Risk score updated for SBI ATM-NGP-04
                  </p>
                  <span className="text-[10px] font-mono-code text-emerald-400 font-bold">
                    91% → 91%
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-mono-code text-[11px] text-slate-500 shrink-0 mt-0.5">20:12</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-[11px] leading-snug">
                    New related complaint detected
                  </p>
                  <button className="text-[10px] font-mono-code text-cyan-400 hover:underline">
                    CMP-1187
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-mono-code text-[11px] text-slate-500 shrink-0 mt-0.5">20:09</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-[11px] leading-snug">
                    Transaction anomaly flagged
                  </p>
                  <button className="text-[10px] font-mono-code text-cyan-400 hover:underline">
                    TXN-4582
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-mono-code text-[11px] text-slate-500 shrink-0 mt-0.5">19:58</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-[11px] leading-snug">
                    Camera signal received
                  </p>
                  <button className="text-[10px] font-mono-code text-cyan-400 hover:underline">
                    CAM-ATM-03
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-800/60 text-[10px] font-mono-code text-slate-500 flex items-center justify-between">
            <span>WebSocket Live Bus: Connected</span>
            <span className="text-emerald-400">4 events logged</span>
          </div>
        </div>
      </div>
    </div>
  );
};
