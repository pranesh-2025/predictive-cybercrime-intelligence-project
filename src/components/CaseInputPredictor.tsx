import React, { useState } from 'react';
import { 
  ComplaintInput, 
  PredictedLocation, 
  UserProfile 
} from '../types';
import { PRESET_CASES } from '../data/mockData';
import { 
  Sparkles, 
  Send, 
  AlertTriangle, 
  RotateCcw, 
  Layers, 
  Building2, 
  Clock, 
  HelpCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface CaseInputPredictorProps {
  onAnalyze: (input: ComplaintInput) => Promise<void>;
  predictedLocations: PredictedLocation[];
  onSelectLocation: (loc: PredictedLocation) => void;
  selectedLocation: PredictedLocation | null;
  currentUser: UserProfile;
  isAnalyzing: boolean;
  demoRiskScore: number | null;
  confidenceScore: number | null;
  predictionWindow: string | null;
}

export const CaseInputPredictor: React.FC<CaseInputPredictorProps> = ({
  onAnalyze,
  predictedLocations,
  onSelectLocation,
  selectedLocation,
  currentUser,
  isAnalyzing,
  demoRiskScore,
  confidenceScore,
  predictionWindow
}) => {
  const [formData, setFormData] = useState<ComplaintInput>({
    complaintType: 'Part-Time Job / Task Investment Scam',
    amount: 350000,
    complaintTimestamp: new Date().toISOString().slice(0, 16),
    expectedWithdrawalTime: '20:00 – 22:00',
    previousComplaintsCount: 7,
    accountRef: 'TXN-984210-NGP-HDFC',
    region: 'Nagapattinam Coastal'
  });

  const complaintTypes = [
    'Part-Time Job / Task Investment Scam',
    'UPI QR Code / Phishing Link Deception',
    'Digital Arrest / Fake Police Extortion',
    'AePS Biometric Skimming / Clone Fraud',
    'Instant Loan App Blackmail / Harassment',
    'APK Malware Banking Trojan',
    'Cryptocurrency / Forex Arbitrage Fraud',
    'Fake Lottery / KYC Update Deception'
  ];

  const regions = [
    'Nagapattinam Coastal',
    'Chennai Central',
    'Coimbatore West',
    'Madurai North',
    'Tiruchirappalli Central',
    'Salem Junction',
    'Tirunelveli South',
    'Vellore North'
  ];

  const handleLoadPreset = (presetIndex: number) => {
    const preset = PRESET_CASES[presetIndex];
    if (preset) {
      setFormData({
        complaintType: preset.complaintType,
        amount: preset.amount,
        complaintTimestamp: preset.complaintTimestamp,
        expectedWithdrawalTime: preset.expectedWithdrawalTime,
        previousComplaintsCount: preset.previousComplaintsCount,
        accountRef: preset.accountRef,
        region: preset.region
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAnalyze(formData);
  };

  const top5 = predictedLocations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-tech font-bold uppercase tracking-wider text-amber-300">
            PROTOTYPE / DEMO PREDICTION MODEL — SMART INDIA HACKATHON
          </div>
          <p className="text-slate-300 mt-1 leading-relaxed">
            This module forecasts probable cash withdrawal locations using geospatial clustering, transaction velocity, 
            and historical mule terminal patterns. All predictions are generated using calibrated synthetic algorithms for evaluation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cybercrime Case Input Form */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide">
                  Cybercrime Case Intake Parameters
                </h3>
                <p className="text-[11px] text-slate-400">
                  Officer: <span className="text-cyan-400 font-mono-code">{currentUser.name}</span>
                </p>
              </div>
            </div>

            {/* Presets dropdown */}
            <div className="relative">
              <select
                id="select-preset-case"
                onChange={(e) => handleLoadPreset(Number(e.target.value))}
                className="bg-slate-950 text-cyan-300 border border-slate-700 text-[11px] rounded-lg px-2.5 py-1 font-mono-code cursor-pointer focus:outline-none focus:border-cyan-500"
              >
                <option value="">Load SIH Preset Case...</option>
                {PRESET_CASES.map((preset, idx) => (
                  <option key={idx} value={idx}>
                    Preset {idx + 1}: {preset.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Complaint Type */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Complaint Type / Modus Operandi *
              </label>
              <select
                id="input-complaint-type"
                value={formData.complaintType}
                onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-slate-200 outline-none transition cursor-pointer"
                required
              >
                {complaintTypes.map((type, i) => (
                  <option key={i} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Transaction Amount & Account Ref */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Suspicious Amount (INR ₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 font-mono-code">₹</span>
                  <input
                    id="input-amount"
                    type="number"
                    min="1000"
                    max="10000000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-7 pr-3 py-2 text-slate-100 font-mono-code outline-none transition"
                    required
                  />
                </div>
                <div className="flex gap-1.5 mt-1 text-[10px] text-slate-400 font-mono-code">
                  <button type="button" onClick={() => setFormData({...formData, amount: 50000})} className="hover:text-cyan-400 cursor-pointer">₹50K</button>
                  <span>•</span>
                  <button type="button" onClick={() => setFormData({...formData, amount: 150000})} className="hover:text-cyan-400 cursor-pointer">₹1.5L</button>
                  <span>•</span>
                  <button type="button" onClick={() => setFormData({...formData, amount: 350000})} className="hover:text-cyan-400 cursor-pointer">₹3.5L</button>
                  <span>•</span>
                  <button type="button" onClick={() => setFormData({...formData, amount: 750000})} className="hover:text-cyan-400 cursor-pointer">₹7.5L</button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Account / Transaction Ref *
                </label>
                <input
                  id="input-account-ref"
                  type="text"
                  value={formData.accountRef}
                  onChange={(e) => setFormData({ ...formData, accountRef: e.target.value })}
                  placeholder="e.g. TXN-984210-NGP-HDFC"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-slate-100 font-mono-code outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Complaint Timestamp *
                </label>
                <input
                  id="input-complaint-timestamp"
                  type="datetime-local"
                  value={formData.complaintTimestamp}
                  onChange={(e) => setFormData({ ...formData, complaintTimestamp: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-slate-100 font-mono-code outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Expected Withdrawal Time *
                </label>
                <select
                  id="input-expected-withdrawal-time"
                  value={formData.expectedWithdrawalTime}
                  onChange={(e) => setFormData({ ...formData, expectedWithdrawalTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-slate-100 font-mono-code outline-none transition cursor-pointer"
                  required
                >
                  <option value="Immediate (< 1 Hour)">Immediate (&lt; 1 Hour)</option>
                  <option value="18:30 – 20:30">Evening Window (18:30 – 20:30)</option>
                  <option value="20:00 – 22:00">Night Surge (20:00 – 22:00)</option>
                  <option value="22:00 – 01:00">Late Night (22:00 – 01:00)</option>
                  <option value="Next Day Morning (06:00 – 09:00)">Next Day Morning (06:00 – 09:00)</option>
                </select>
              </div>
            </div>

            {/* Previous Complaints & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                  <span>Previous Related Complaints</span>
                  <span className="text-cyan-400 font-mono-code">{formData.previousComplaintsCount}</span>
                </label>
                <input
                  id="input-previous-complaints"
                  type="range"
                  min="0"
                  max="15"
                  value={formData.previousComplaintsCount}
                  onChange={(e) => setFormData({ ...formData, previousComplaintsCount: Number(e.target.value) })}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">
                  Number of correlated reports referencing this mule syndicate
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Geographic Region / District *
                </label>
                <select
                  id="input-region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-slate-100 outline-none transition cursor-pointer"
                  required
                >
                  {regions.map((reg, i) => (
                    <option key={i} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Analyze & Predict Button */}
            <div className="pt-2">
              <button
                id="btn-analyze-predict"
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-500 hover:to-indigo-600 text-white font-tech font-bold uppercase tracking-wider text-sm shadow-xl shadow-cyan-950/60 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-cyan-200" />
                    <span>Analyzing Geospatial Modus Operandi & Scoring...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Analyze & Predict Withdrawal Locations</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: AI PREDICTION ENGINE OUTPUT */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Engine Summary Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <h3 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  AI Prediction Engine (Demo)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Multivariate neural spatial ranking algorithm
                </p>
              </div>
              <span className="text-[10px] font-mono-code uppercase bg-blue-500/10 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-bold">
                SIH EVALUATION ENGINE
              </span>
            </div>

            {/* Metrics Triad */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg text-center">
                <span className="text-[10px] uppercase font-mono-code text-slate-500 block">DEMO RISK SCORE</span>
                <span className="text-2xl font-tech font-bold text-red-400 font-mono-code">
                  {demoRiskScore !== null ? `${demoRiskScore}%` : '92%'}
                </span>
                <span className="text-[10px] text-rose-400 block font-mono-code">CRITICAL SURGE</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg text-center">
                <span className="text-[10px] uppercase font-mono-code text-slate-500 block">CONFIDENCE SCORE</span>
                <span className="text-2xl font-tech font-bold text-cyan-300 font-mono-code">
                  {confidenceScore !== null ? `${confidenceScore}%` : '89%'}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono-code">STATISTICAL CI</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg text-center">
                <span className="text-[10px] uppercase font-mono-code text-slate-500 block">TIME WINDOW</span>
                <span className="text-xs font-tech font-bold text-amber-300 block mt-2 font-mono-code">
                  {predictionWindow || formData.expectedWithdrawalTime}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono-code">PROBABLE CASHOUT</span>
              </div>
            </div>

            {/* Top 5 Predicted Locations List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-tech text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Top 5 Ranked Candidate Cash-Out Locations
                </h4>
                <span className="text-[10px] text-slate-500 font-mono-code">
                  Sorted by Probability
                </span>
              </div>

              <div className="space-y-2">
                {top5.map((loc, idx) => {
                  const isSelected = selectedLocation?.id === loc.id;
                  const isHigh = loc.riskLevel === 'HIGH';

                  return (
                    <div
                      key={loc.id}
                      id={`card-predicted-location-${loc.id}`}
                      onClick={() => onSelectLocation(loc)}
                      className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/50' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono-code font-bold text-xs ${
                          idx === 0 ? 'bg-red-500 text-white ring-2 ring-red-400/40' :
                          idx === 1 ? 'bg-orange-500 text-white' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-tech font-bold text-slate-200 text-xs">
                              {loc.name}
                            </span>
                            <span className="text-[10px] font-mono-code text-slate-400">
                              ({loc.bank})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {loc.city}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-mono-code text-cyan-400">
                              <Clock className="w-3 h-3" />
                              {loc.predictedWindow}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-mono-code font-bold text-sm ${isHigh ? 'text-red-400' : 'text-orange-400'}`}>
                          {loc.riskScore}%
                        </div>
                        <div className="text-[10px] font-mono-code text-slate-500">
                          {loc.confidence}% conf.
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
