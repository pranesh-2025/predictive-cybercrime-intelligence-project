import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Cell 
} from 'recharts';
import { HOURLY_RISK_TRENDS, REGION_METRICS, TAMIL_NADU_ATMS } from '../data/mockData';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  Building2, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  // Sort ATMs by risk score for high-risk ranking
  const rankedAtms = [...TAMIL_NADU_ATMS]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6)
    .map(atm => ({
      name: atm.atmCode,
      fullName: atm.name,
      city: atm.city,
      risk: atm.riskScore,
      complaints: atm.relatedComplaints,
      mules: atm.muleAccountLinks
    }));

  const alertStats = [
    { label: 'Total Dispatched Interceptions', count: 128, color: 'text-purple-400', border: 'border-purple-800/60' },
    { label: 'Active Critical Alarms', count: 4, color: 'text-red-400', border: 'border-red-800/60' },
    { label: 'Under Investigation', count: 14, color: 'text-cyan-400', border: 'border-cyan-800/60' },
    { label: 'Prevented Loss Realization', count: '₹4.28 Cr', color: 'text-emerald-400', border: 'border-emerald-800/60' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {alertStats.map((stat, i) => (
          <div 
            key={i} 
            className={`bg-slate-900/90 border ${stat.border} rounded-xl p-4 shadow-xl`}
          >
            <span className="text-[10px] uppercase font-mono-code text-slate-500 block">
              {stat.label}
            </span>
            <span className={`text-2xl font-tech font-bold font-mono-code mt-1 block ${stat.color}`}>
              {stat.count}
            </span>
            <span className="text-[11px] text-slate-400 font-mono-code">
              NCRP & Cyber Cell Tamil Nadu
            </span>
          </div>
        ))}
      </div>

      {/* Chart Row 1: Complaints by Region & Withdrawal Prediction Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints by Region */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h4 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide">
                Complaints Volume by Geographic Region
              </h4>
            </div>
            <span className="text-[10px] font-mono-code text-slate-500">
              TAMIL NADU CYBER CELLS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGION_METRICS} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="region" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  angle={-18}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                  labelStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                />
                <Bar dataKey="complaints" name="Complaints Tracked" fill="#0284c7" radius={[4, 4, 0, 0]}>
                  {REGION_METRICS.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.avgRisk > 80 ? '#ef4444' : entry.avgRisk > 70 ? '#f97316' : '#0284c7'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-500 font-mono-code text-center mt-2">
            Red = &gt;80% Avg Risk • Orange = 70–80% Avg Risk • Blue = Standard Density
          </div>
        </div>

        {/* Withdrawal Prediction Trend vs Actual Realization */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide">
                Withdrawal Prediction Realization by Hour
              </h4>
            </div>
            <span className="text-[10px] font-mono-code text-slate-500">
              24-HR SURGE CURVE
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_RISK_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="predColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="complaintColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                  labelStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area 
                  type="monotone" 
                  dataKey="predictedAttempts" 
                  name="Predicted Cash-Outs" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#predColor)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="actualComplaints" 
                  name="Ingested Complaints" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#complaintColor)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-500 font-mono-code text-center mt-2">
            Peak cash-out surge manifests reliably between 18:00 and 22:00 IST post-banking cutoff
          </div>
        </div>
      </div>

      {/* Chart Row 2: High-Risk ATM Ranking & Spatial Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Horizontal Bar: High-Risk ATM Ranking */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <h4 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide">
                High-Risk ATM Terminal Ranking (Tactical Intercept List)
              </h4>
            </div>
            <span className="text-[10px] font-mono-code text-red-400 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded">
              TOP HOTSPOTS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={rankedAtms} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                  formatter={(value) => [`${value}% Risk Score`, 'Risk']}
                  labelFormatter={(label) => {
                    const atm = rankedAtms.find(a => a.name === label);
                    return atm ? `${atm.name} - ${atm.fullName} (${atm.city})` : label;
                  }}
                />
                <Bar dataKey="risk" name="Risk Score %" fill="#ef4444" radius={[0, 4, 4, 0]}>
                  {rankedAtms.map((entry, index) => (
                    <Cell 
                      key={`atm-cell-${index}`} 
                      fill={entry.risk >= 90 ? '#ef4444' : entry.risk >= 80 ? '#f97316' : '#eab308'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tactical Summary Cards */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col justify-between text-xs">
          <div>
            <h4 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wide pb-2 border-b border-slate-800 mb-3">
              Strategic Interception Insights
            </h4>
            <div className="space-y-3">
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-mono-code text-cyan-400 block font-semibold">
                  PRIMARY CORRIDOR IDENTIFIED
                </span>
                <p className="text-slate-200 mt-1 font-medium">
                  Nagapattinam Coastal &amp; Velankanni Transit Axis
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Syndicates exploit coastal transit to obscure mule identities. Average withdrawal ticket: ₹38,500.
                </p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-mono-code text-amber-400 block font-semibold">
                  SURGE WINDOW DETECTION
                </span>
                <p className="text-slate-200 mt-1 font-medium">
                  20:00 – 22:30 IST
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  67% of high-value cash-outs occur within 150 minutes of victim filing complaint with Cyber Helpline 1930.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono-code text-slate-500">
            Analytics aggregated from internal police logs &amp; simulated SIH telemetry.
          </div>
        </div>
      </div>
    </div>
  );
};
