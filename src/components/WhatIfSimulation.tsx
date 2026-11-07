import React, { useState } from 'react';
import { PredictedLocation } from '../types';
import { 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Clock 
} from 'lucide-react';

interface WhatIfSimulationProps {
  locations: PredictedLocation[];
  onApplySimulation: (simulatedLocations: PredictedLocation[], simulatedRisk: number) => void;
  onSelectLocation: (loc: PredictedLocation) => void;
}

export const WhatIfSimulation: React.FC<WhatIfSimulationProps> = ({
  locations,
  onApplySimulation,
  onSelectLocation
}) => {
  const [simAmount, setSimAmount] = useState<number>(450000);
  const [simWindowHours, setSimWindowHours] = useState<string>('20:00 – 22:00');
  const [simRegion, setSimRegion] = useState<string>('Nagapattinam Coastal');
  const [simPreviousComplaints, setSimPreviousComplaints] = useState<number>(8);
  const [riskSensitivity, setRiskSensitivity] = useState<number>(1.2);

  // Dynamic simulation formula
  const computeSimulatedScore = (loc: PredictedLocation) => {
    const isTargetRegion = loc.region.toLowerCase().includes(simRegion.toLowerCase()) || 
                          simRegion.toLowerCase().includes(loc.city.toLowerCase());

    const regionMultiplier = isTargetRegion ? 1.35 : 0.85;
    const amountFactor = Math.min(1.4, Math.max(0.6, (simAmount / 250000) * 0.9));
    const historyFactor = Math.min(1.4, Math.max(0.7, 0.75 + (simPreviousComplaints / 10) * 0.5));

    const recalculated = Math.min(99, Math.max(15, Math.round(
      loc.riskScore * regionMultiplier * amountFactor * historyFactor * (riskSensitivity / 1.1)
    )));

    return recalculated;
  };

  const simulatedLocations: PredictedLocation[] = locations.map(loc => {
    const newScore = computeSimulatedScore(loc);
    const newLevel = newScore >= 75 ? 'HIGH' : newScore >= 45 ? 'MEDIUM' : 'LOW';
    return {
      ...loc,
      riskScore: newScore,
      riskLevel: newLevel,
      confidence: Math.min(96, Math.max(65, Math.round(newScore * 0.94)))
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  const topLocation = simulatedLocations[0];
  const overallRisk = topLocation ? topLocation.riskScore : 88;

  const handleApplyToCommandCenter = () => {
    onApplySimulation(simulatedLocations, overallRisk);
  };

  const handleResetSimulation = () => {
    setSimAmount(350000);
    setSimWindowHours('20:00 – 22:00');
    setSimRegion('Nagapattinam Coastal');
    setSimPreviousComplaints(7);
    setRiskSensitivity(1.0);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-700 text-indigo-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-tech text-base font-bold text-slate-100 uppercase tracking-wide">
                Interactive What-If Tactical Simulation Sandbox
              </h3>
              <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded font-mono-code font-bold uppercase">
                Dynamic Recalibration
              </span>
            </div>
            <p className="text-xs text-slate-400 font-body mt-0.5">
              Simulate shifting crime syndicates, altered withdrawal time windows, and multi-lakh fund dispersion to test proactive police deployment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-reset-simulation"
            onClick={handleResetSimulation}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono-code flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            id="btn-apply-simulation"
            onClick={handleApplyToCommandCenter}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-tech font-bold uppercase tracking-wider text-xs shadow-lg shadow-indigo-950/60 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Apply To Live Command Center</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Simulation Controls */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-5 text-xs">
          <h4 className="font-tech font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Simulation Hypotheses & Variables
          </h4>

          {/* Slider 1: Transaction Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">Suspicious Transaction Amount</label>
              <span className="font-mono-code font-bold text-emerald-400 text-sm">
                ₹{simAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              id="slider-sim-amount"
              type="range"
              min="20000"
              max="1500000"
              step="10000"
              value={simAmount}
              onChange={(e) => setSimAmount(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono-code mt-1">
              <span>₹20,000</span>
              <span>₹5,00,000</span>
              <span>₹15,00,000</span>
            </div>
          </div>

          {/* Slider 2: Withdrawal Time Window */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Simulated Cash-Out Window
            </label>
            <select
              id="select-sim-window"
              value={simWindowHours}
              onChange={(e) => setSimWindowHours(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono-code outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Immediate (< 1 Hour)">Immediate (&lt; 1 Hour)</option>
              <option value="18:30 – 20:30">Evening Prime Window (18:30 – 20:30)</option>
              <option value="20:00 – 22:00">Night Surge Window (20:00 – 22:00)</option>
              <option value="22:00 – 02:00">Post-Midnight Window (22:00 – 02:00)</option>
              <option value="Next Day Morning (07:00 – 10:00)">Morning Terminal Window (07:00 – 10:00)</option>
            </select>
          </div>

          {/* Dropdown 3: Target Geographic Region */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Simulated Target Region / Corridor
            </label>
            <select
              id="select-sim-region"
              value={simRegion}
              onChange={(e) => setSimRegion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Nagapattinam Coastal">Nagapattinam Coastal Corridor</option>
              <option value="Chennai Central">Chennai Central Transit Corridor</option>
              <option value="Coimbatore West">Coimbatore West Commercial Hub</option>
              <option value="Madurai North">Madurai North Bus Concourse</option>
              <option value="Tiruchirappalli Central">Tiruchirappalli Central Bus Stand</option>
              <option value="Salem Junction">Salem Five Roads Tech Corridor</option>
            </select>
          </div>

          {/* Slider 4: Previous Related Complaints Count */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">Correlated Prior Complaints</label>
              <span className="font-mono-code font-bold text-amber-400 text-sm">
                {simPreviousComplaints} cases
              </span>
            </div>
            <input
              id="slider-sim-complaints"
              type="range"
              min="0"
              max="15"
              value={simPreviousComplaints}
              onChange={(e) => setSimPreviousComplaints(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono-code mt-1">
              <span>0 (Isolated)</span>
              <span>7 (Moderate syndicate)</span>
              <span>15 (Major cartel)</span>
            </div>
          </div>

          {/* Slider 5: AI Model Sensitivity Bias */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">Model Sensitivity Multiplier</label>
              <span className="font-mono-code font-bold text-cyan-300 text-xs">
                {riskSensitivity.toFixed(1)}x
              </span>
            </div>
            <input
              id="slider-sim-sensitivity"
              type="range"
              min="0.8"
              max="1.6"
              step="0.1"
              value={riskSensitivity}
              onChange={(e) => setRiskSensitivity(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right Side: Real-Time Dynamic Simulation Results */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Recalibrated Spatial Forecast Results
              </h4>
              <p className="text-[11px] text-slate-400">
                Dynamic risk recalculation across all ATM nodes
              </p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono-code px-2 py-0.5 rounded font-bold">
              REAL-TIME RECALC
            </span>
          </div>

          {/* Top Simulated Hotspot Highlight */}
          {topLocation && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase text-slate-500">
                  TOP FORECASTED CASHOUT NODE UNDER SIMULATION
                </span>
                <h3 className="text-base font-tech font-bold text-slate-100 mt-0.5">
                  {topLocation.name}
                </h3>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                  <span className="font-mono-code text-cyan-400 font-semibold">{topLocation.atmCode}</span>
                  <span>•</span>
                  <span>{topLocation.bank}</span>
                  <span>•</span>
                  <span>{topLocation.city}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase font-mono-code text-slate-500">SIMULATED RISK</div>
                <div className="text-3xl font-tech font-bold text-red-400 font-mono-code">
                  {topLocation.riskScore}%
                </div>
                <div className="text-[11px] font-mono-code text-slate-400">
                  {topLocation.confidence}% Confidence
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Ranked ATM List */}
          <div className="space-y-2">
            <h5 className="font-tech text-xs font-bold text-slate-300 uppercase tracking-wider">
              Updated Location Ranking (Top 4 Simulated)
            </h5>
            {simulatedLocations.slice(0, 4).map((loc, index) => {
              const isHigh = loc.riskLevel === 'HIGH';

              return (
                <div
                  key={loc.id}
                  id={`sim-location-${loc.id}`}
                  onClick={() => onSelectLocation(loc)}
                  className="p-3 bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-lg flex items-center justify-between gap-3 text-xs transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono-code font-bold text-[10px] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-tech font-bold text-slate-200">
                        {loc.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono-code flex items-center gap-2">
                        <span>{loc.city}</span>
                        <span>•</span>
                        <span className="text-cyan-400">{loc.predictedWindow}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-mono-code font-bold text-sm ${isHigh ? 'text-red-400' : 'text-orange-400'}`}>
                      {loc.riskScore}%
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono-code">
                      {loc.riskLevel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
