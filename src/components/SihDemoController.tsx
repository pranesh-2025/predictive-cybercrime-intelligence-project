import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  ShieldCheck, 
  Sliders, 
  Radio, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { TabType, SihDemoStepInfo } from '../types';
import { IntelligenceScenarioId, INTELLIGENCE_SCENARIOS } from '../utils/riskEngine';

export const SIH_DEMO_STEPS: SihDemoStepInfo[] = [
  {
    step: 1,
    title: '1. Complaint Ingestion',
    subtitle: 'NCRP Investment Task Scam',
    tab: 'PREDICTION_ENGINE',
    description: 'Victim reports unauthorized ₹3,50,000 debit in Nagapattinam Coastal district after Telegram task deception.',
    judgeHighlight: 'Demonstrates automated NCRP portal integration with structured loss parameters.'
  },
  {
    step: 2,
    title: '2. Transaction Analysis',
    subtitle: 'Mule Layering Detection',
    tab: 'PREDICTION_ENGINE',
    description: 'High-velocity 3-hop layering telemetry identified across secondary digital wallets heading to physical ATM.',
    judgeHighlight: 'Extracts money mule layering patterns and cash-out velocity in under 5 minutes.'
  },
  {
    step: 3,
    title: '3. Risk Prediction',
    subtitle: 'Heuristic Probability 92%',
    tab: 'PREDICTION_ENGINE',
    description: 'AI Risk Engine scores 92% cash-out probability with 89% confidence in the 20:00–22:00 IST window.',
    judgeHighlight: 'Deterministic evaluation score based on trained synthetic cyber fraud distributions.'
  },
  {
    step: 4,
    title: '4. Explainable AI (XAI)',
    subtitle: '6 Causal Factor Weights',
    tab: 'PREDICTION_ENGINE',
    description: 'Explainable decomposition highlights Historical Density (94%), Night Pattern (95%), and Mule Links (92%).',
    judgeHighlight: 'Zero black-box decisions: clear mathematical contributions for courtroom transparency.'
  },
  {
    step: 5,
    title: '5. GIS Hotspot Map',
    subtitle: 'Nagapattinam Port ATM-NGP-04 (SBI)',
    tab: 'GIS_MAP',
    description: 'Tamil Nadu interactive map pinpoints Beach Road Kiosk (ATM-NGP-04) as #1 high-risk cash-out node with geospatial cluster.',
    judgeHighlight: 'Statewide geospatial intelligence ranking with clickable diagnostic overlay.'
  },
  {
    step: 6,
    title: '6. Camera Supporting Signal',
    subtitle: 'Off-Hours Loitering Telemetry',
    tab: 'SENSORS',
    description: 'Perimeter Sensor CAM-ATM-01 detects vehicle idling (18 min) and loitering. Zero facial recognition performed.',
    judgeHighlight: 'Privacy-preserving environmental telemetry compliant with IT Act Sec 43A.'
  },
  {
    step: 7,
    title: '7. Human Verification',
    subtitle: 'Sworn Investigator Sign-Off',
    tab: 'VERIFICATION',
    description: 'Investigator Insp. V. Raghavan audits all 4 evidence quadrants and issues official CONFIRMATION.',
    judgeHighlight: 'Strict Human-in-the-Loop governance prevents automated false arrests or unlawful actions.'
  },
  {
    step: 8,
    title: '8. P1 Critical Alert',
    subtitle: 'Emergency Tactical Alert',
    tab: 'ALERTS',
    description: 'Priority 1 Critical Alert ALERT-HIGH-001 generated with duplicate prevention and assigned to patrol.',
    judgeHighlight: 'Real-time alert engine with P1–P4 triage and instant escalation status.'
  },
  {
    step: 9,
    title: '9. QRT Tactical Dispatch',
    subtitle: 'Coastal Interception Unit QRT-04',
    tab: 'ALERTS',
    description: 'Quick Response Team QRT-04 dispatched to Nagapattinam Port kiosk with live 8-min ETA countdown.',
    judgeHighlight: 'Bridges digital cybercrime intelligence directly to physical ground interception.'
  },
  {
    step: 10,
    title: '10. Audit Trail',
    subtitle: 'Tamper-Evident SHA-256 Chaining',
    tab: 'SECURITY',
    description: 'Non-repudiable cryptographically hash-chained blockchain ledger records every decision and telemetry read.',
    judgeHighlight: 'Courtroom-admissible immutable evidence chain with digital officer signatures.'
  },
  {
    step: 11,
    title: '11. Official Dossier Report',
    subtitle: 'Interception Advisory PDF',
    tab: 'COMMAND_CENTER',
    description: 'Complete synthesized police dossier ready for printing, judicial submission, and bank freeze enforcement.',
    judgeHighlight: 'Comprehensive executive advisory uniting intelligence, GIS, and legal custody.'
  }
];

interface SihDemoControllerProps {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  onResetDemo: () => void;
  onOpenReportModal?: () => void;
  activeScenarioId?: IntelligenceScenarioId;
  onSelectScenario?: (scenarioId: IntelligenceScenarioId) => void;
  onRefreshIntelligence?: () => void;
  isRefreshing?: boolean;
}

export const SihDemoController: React.FC<SihDemoControllerProps> = ({
  currentStepIndex = 0,
  onSelectStep,
  onResetDemo,
  onOpenReportModal,
  activeScenarioId = 'BASELINE_FLAGSHIP',
  onSelectScenario,
  onRefreshIntelligence,
  isRefreshing = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const safeStepIndex = Math.max(0, Math.min(SIH_DEMO_STEPS.length - 1, currentStepIndex || 0));
  const activeStep = SIH_DEMO_STEPS[safeStepIndex] || SIH_DEMO_STEPS[0];
  const totalSteps = SIH_DEMO_STEPS.length;

  // Auto-play timer (advances step every 5 seconds)
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgressPercent(0);
      return;
    }

    const intervalMs = 100;
    const stepDurationMs = 5000;
    let elapsed = 0;

    timerRef.current = setInterval(() => {
      elapsed += intervalMs;
      setProgressPercent(Math.min(100, (elapsed / stepDurationMs) * 100));

      if (elapsed >= stepDurationMs) {
        elapsed = 0;
        setProgressPercent(0);
        if (safeStepIndex < totalSteps - 1) {
          if (onSelectStep) onSelectStep(safeStepIndex + 1);
        } else {
          setIsPlaying(false);
          if (onOpenReportModal) onOpenReportModal();
        }
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, safeStepIndex, totalSteps, onSelectStep, onOpenReportModal]);

  const handleNext = () => {
    if (safeStepIndex < totalSteps - 1) {
      if (onSelectStep) onSelectStep(safeStepIndex + 1);
    } else if (onOpenReportModal) {
      onOpenReportModal();
    }
  };

  const handlePrev = () => {
    if (safeStepIndex > 0) {
      if (onSelectStep) onSelectStep(safeStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgressPercent(0);
    if (onResetDemo) onResetDemo();
  };

  return (
    <div className="bg-slate-900 border-b border-cyan-500/30 sticky top-14 z-30 shadow-2xl backdrop-blur-md">
      {/* Auto-play progress bar */}
      {isPlaying && (
        <div className="h-1 w-full bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Flagship Scenario Badge & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-md text-[11px] font-mono-code font-bold tracking-wider shrink-0">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>SIH DEMO JURY MODE</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-tech text-sm font-bold text-white uppercase tracking-wide truncate">
                  Flagship Case: Nagapattinam Coastal Mule Cash-Out
                </span>
                <span className="bg-cyan-500/10 text-cyan-300 font-mono-code text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/20 shrink-0">
                  Step {activeStep.step} of {totalSteps}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-body truncate hidden sm:block">
                <strong className="text-cyan-300 font-semibold">{activeStep.title}:</strong> {activeStep.description}
              </p>
            </div>
          </div>

          {/* Middle & Right: Scenario Selector, Refresh, & Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-auto">
            {/* Deterministic Intelligence Scenario Selector (for SIH Judges) */}
            {onSelectScenario && (
              <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-700 rounded-lg p-0.5 text-xs font-mono-code">
                <span className="text-slate-500 px-1 text-[10px] hidden xl:inline">SCENARIO:</span>
                <button
                  onClick={() => onSelectScenario('BASELINE_FLAGSHIP')}
                  className={`px-2 py-1 rounded cursor-pointer transition flex items-center gap-1 ${activeScenarioId === 'BASELINE_FLAGSHIP' ? 'bg-red-950 text-red-300 border border-red-700 font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="Scenario 1: Flagship Nagapattinam Baseline (91% 🔴 HIGH)"
                >
                  <span>🔴</span>
                  <span className="hidden sm:inline">Baseline (91%)</span>
                </button>
                <button
                  onClick={() => onSelectScenario('ESCALATED_BURST')}
                  className={`px-2 py-1 rounded cursor-pointer transition flex items-center gap-1 ${activeScenarioId === 'ESCALATED_BURST' ? 'bg-red-950 text-red-300 border border-red-700 font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="Scenario 2: Night-time Burst Surge (96% 🔴 HIGH)"
                >
                  <span>🔴</span>
                  <span className="hidden sm:inline">Surge (96%)</span>
                </button>
                <button
                  onClick={() => onSelectScenario('INTERCEPTION_SUPPRESSED')}
                  className={`px-2 py-1 rounded cursor-pointer transition flex items-center gap-1 ${activeScenarioId === 'INTERCEPTION_SUPPRESSED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="Scenario 3: Post-QRT Interception (38% 🟢 LOW)"
                >
                  <span>🟢</span>
                  <span className="hidden sm:inline">Suppressed</span>
                </button>
              </div>
            )}

            {/* Live Update Risk Button */}
            {onRefreshIntelligence && (
              <button
                id="btn-sih-refresh-risk"
                onClick={onRefreshIntelligence}
                disabled={isRefreshing}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition active:scale-95 disabled:opacity-50"
                title="Recalculate ATM risks deterministically"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                <span className="hidden md:inline">{isRefreshing ? 'Updating...' : 'Update Risk'}</span>
              </button>
            )}

            {/* Step Dropdown for Quick Jump */}
            <select
              id="select-sih-demo-step"
              value={safeStepIndex}
              onChange={(e) => onSelectStep && onSelectStep(Number(e.target.value))}
              aria-label="Select SIH Demo Step"
              className="bg-slate-950 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 font-mono-code focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[150px] sm:max-w-none"
            >
              {SIH_DEMO_STEPS.map((s, idx) => (
                <option key={s.step} value={idx}>
                  Step {s.step}: {s.subtitle}
                </option>
              ))}
            </select>

            {/* Prev Step */}
            <button
              id="btn-sih-demo-prev"
              onClick={handlePrev}
              disabled={safeStepIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Play / Pause Auto Demo */}
            <button
              id="btn-sih-demo-play-pause"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-lg font-tech font-bold uppercase text-xs tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-md ${
                isPlaying 
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Auto Demo</span>
                </>
              )}
            </button>

            {/* Next Step */}
            <button
              id="btn-sih-demo-next"
              onClick={handleNext}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-tech font-bold uppercase text-xs tracking-wider transition cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Reset Demo */}
            <button
              id="btn-sih-demo-reset"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition cursor-pointer"
              title="Reset Demo to Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Judge Highlight Banner */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono-code text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> EVALUATION NOTE:
            </span>
            <span className="text-slate-200">{activeStep.judgeHighlight}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[10px]">
            <span className="text-cyan-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Zero Biometric ID
            </span>
            <span className="text-emerald-400">
              IT Act 2000 Compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
