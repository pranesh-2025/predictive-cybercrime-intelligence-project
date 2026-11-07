import React, { useState } from 'react';
import { InvestigationTimelineStep } from '../types';
import { 
  CheckCircle, 
  Clock, 
  User, 
  ChevronRight, 
  ChevronDown, 
  FileCheck2, 
  Radio, 
  ArrowRight,
  ShieldAlert,
  Play
} from 'lucide-react';

interface InvestigationTimelineProps {
  timeline: InvestigationTimelineStep[];
  onAdvanceStep?: () => void;
}

export const InvestigationTimeline: React.FC<InvestigationTimelineProps> = ({
  timeline,
  onAdvanceStep
}) => {
  const [expandedStepId, setExpandedStepId] = useState<string>('step-3');

  const toggleExpand = (id: string) => {
    setExpandedStepId(expandedStepId === id ? '' : id);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-tech text-base font-bold text-slate-100 uppercase tracking-wide">
                Investigation Audit Pipeline & Chain of Custody
              </h3>
              <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] px-2 py-0.5 rounded font-mono-code font-bold uppercase">
                End-to-End Workflow
              </span>
            </div>
            <p className="text-xs text-slate-400 font-body mt-0.5">
              Case Ref: <span className="font-mono-code text-cyan-300 font-semibold">CYB-TN-2026-8891</span> (Nagapattinam Port Coastal ATM Cash-Out)
            </p>
          </div>
        </div>

        {onAdvanceStep && (
          <button
            id="btn-advance-timeline-step"
            onClick={onAdvanceStep}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-tech font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Next Case Step</span>
          </button>
        )}
      </div>

      {/* Horizontal Flow Indicator */}
      <div className="hidden lg:flex items-center justify-between bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 mb-6 overflow-x-auto text-[11px] font-mono-code">
        {timeline.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step.status === 'COMPLETED' ? 'bg-emerald-500 text-black' :
                step.status === 'IN_PROGRESS' ? 'bg-cyan-500 text-black animate-pulse' :
                'bg-slate-800 text-slate-500'
              }`}>
                {step.order}
              </span>
              <span className={`font-medium ${
                step.status === 'COMPLETED' ? 'text-slate-200' :
                step.status === 'IN_PROGRESS' ? 'text-cyan-300' :
                'text-slate-500'
              }`}>
                {step.title}
              </span>
            </div>
            {idx < timeline.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-1" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Detailed Step-by-Step Vertical Pipeline */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {timeline.map((step) => {
          const isCompleted = step.status === 'COMPLETED';
          const isInProgress = step.status === 'IN_PROGRESS';
          const isExpanded = expandedStepId === step.id;

          return (
            <div 
              key={step.id} 
              id={`timeline-step-${step.id}`}
              className="relative text-xs group"
            >
              {/* Bullet Node */}
              <div className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-slate-900 ${
                isCompleted ? 'bg-emerald-500 text-slate-950' :
                isInProgress ? 'bg-cyan-400 text-slate-950 animate-ping' :
                'bg-slate-800 text-slate-600'
              }`}>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>

              {/* Step Card */}
              <div 
                onClick={() => toggleExpand(step.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  isExpanded 
                    ? 'bg-slate-950 border-cyan-500/50 shadow-lg shadow-black/60' 
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono-code font-bold text-cyan-400 text-xs">
                      STEP {step.order}:
                    </span>
                    <h4 className="font-tech font-bold text-slate-100 text-sm">
                      {step.title}
                    </h4>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-mono-code font-bold ${
                      isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      isInProgress ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 animate-pulse' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {step.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 font-mono-code text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{step.timestamp}</span>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>

                <p className="text-slate-300 font-body mt-2 leading-relaxed">
                  {step.description}
                </p>

                {/* Expanded Technical Payload */}
                {isExpanded && step.detailPayload && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 bg-slate-900/80 p-3 rounded-lg font-mono-code text-[11px] text-cyan-300/90 leading-relaxed border border-cyan-900/30">
                    <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      AUDIT TELEMETRY & SYSTEM PAYLOAD
                    </div>
                    {step.detailPayload}
                    <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-cyan-400" />
                      <span>Authenticated Actor: <strong>{step.actor}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
