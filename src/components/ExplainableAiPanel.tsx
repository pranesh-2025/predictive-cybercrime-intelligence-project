import React from 'react';
import { PredictedLocation } from '../types';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertOctagon, 
  Clock, 
  MapPin, 
  CreditCard, 
  Users, 
  CheckCircle2 
} from 'lucide-react';

interface ExplainableAiPanelProps {
  location: PredictedLocation;
  aiAnalysisText?: string;
  onGenerateAlert?: (location: PredictedLocation) => void;
}

export const ExplainableAiPanel: React.FC<ExplainableAiPanelProps> = ({
  location,
  aiAnalysisText,
  onGenerateAlert
}) => {
  const factors = location.factors;

  const factorItems = [
    {
      name: 'Historical Complaint Density',
      value: factors.historicalDensity,
      weight: '32% Model Weight',
      desc: 'High concentration of past NCRP cybercrime reports linked to this kiosk footprint.',
      icon: Users,
      color: 'bg-rose-500'
    },
    {
      name: 'Transaction Amount Threshold',
      value: factors.transactionAmountWeight,
      weight: '24% Model Weight',
      desc: 'Volume matches high-velocity mule cash-out patterns and daily ATM limits.',
      icon: CreditCard,
      color: 'bg-amber-500'
    },
    {
      name: 'Time Pattern Alignment',
      value: factors.timePatternMatch,
      weight: '18% Model Weight',
      desc: 'Correlated with nighttime post-banking hour withdrawal surge (20:00–23:00).',
      icon: Clock,
      color: 'bg-cyan-500'
    },
    {
      name: 'Geographic Proximity to Mules',
      value: factors.geoProximity,
      weight: '12% Model Weight',
      desc: 'Close transit distance to flagged mule account addresses & transport terminals.',
      icon: MapPin,
      color: 'bg-blue-500'
    },
    {
      name: 'Previous Related Cases Link',
      value: factors.previousCaseCorrelation,
      weight: '8% Model Weight',
      desc: 'Shared syndicate modus operandi with prior solved cyber fraud dockets.',
      icon: AlertOctagon,
      color: 'bg-purple-500'
    },
    {
      name: 'Transaction Relationship Score',
      value: factors.transactionRelationshipScore,
      weight: '6% Model Weight',
      desc: 'Synthesized layering score through upstream UPI accounts and neo-bank wallets.',
      icon: BrainCircuit,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-tech text-base font-bold text-slate-100 uppercase tracking-wide">
                Explainable AI (XAI) Intelligence Dossier
              </h3>
              <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] px-2 py-0.5 rounded font-mono-code font-bold uppercase">
                Glass-Box Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 font-body mt-0.5">
              Target: <span className="text-cyan-300 font-mono-code font-semibold">{location.atmCode}</span> — {location.name} ({location.city})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono-code text-slate-500">Predicted Risk Score</div>
            <div className="text-xl font-tech font-bold text-red-400 font-mono-code">
              {location.riskScore}% <span className="text-xs text-slate-400 font-normal">({location.riskLevel})</span>
            </div>
          </div>
          {onGenerateAlert && (
            <button
              id="btn-raise-alert-xai"
              onClick={() => onGenerateAlert(location)}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-tech font-bold uppercase tracking-wide text-xs shadow-lg shadow-red-950/60 transition cursor-pointer flex items-center gap-1.5"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Raise Critical Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Core Question: Why is this location high risk? */}
      <div className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-4 mb-5">
        <div className="flex items-center gap-2 mb-2 text-amber-300 font-tech font-bold text-sm tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Why is this location high risk?</span>
        </div>
        <ul className="space-y-2 text-xs text-slate-300">
          {location.whyHighRisk.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Factor Breakdown Bars */}
      <div className="mb-5">
        <h4 className="text-xs font-tech font-bold text-slate-300 uppercase tracking-wider mb-3">
          Feature Contribution & Weight Decomposition
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {factorItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-200 text-xs">{item.name}</span>
                  </div>
                  <span className="font-mono-code font-bold text-xs text-cyan-300">
                    {item.value}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 mb-1.5 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${item.color} transition-all duration-500`} 
                    style={{ width: `${item.value}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-code">
                  <span>{item.weight}</span>
                  <span className="text-slate-400 truncate ml-2 max-w-[200px]" title={item.desc}>
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Synthesis / Tactical Advisory */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-950/60 border border-cyan-800/40 rounded-lg p-4 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-cyan-300 font-tech font-bold uppercase tracking-wide flex items-center gap-1.5 text-xs">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            Tactical Intervention Advisory
          </span>
          <span className="text-[10px] font-mono-code text-cyan-400/80 bg-cyan-950 border border-cyan-800/60 px-2 py-0.5 rounded">
            CONFIDENCE: {location.confidence}%
          </span>
        </div>
        <p className="text-slate-300 leading-relaxed font-body">
          {aiAnalysisText || location.tacticalAdvisory}
        </p>
      </div>
    </div>
  );
};
