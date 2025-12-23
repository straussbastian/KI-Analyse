
import React, { useMemo } from 'react';
import { HypothesisResult, AnalysisSummary } from '../types';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';

interface AnalysisDashboardProps {
  results: HypothesisResult[];
  signalStability: number;
  isLogprobBased: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ results, signalStability, isLogprobBased }) => {
  const summary = useMemo<AnalysisSummary>(() => {
    const categories: AnalysisSummary['categories'] = {};
    let trueCount = 0;

    results.forEach(r => {
      if (!categories[r.category]) {
        categories[r.category] = { score: 0, count: 0, total: 0 };
      }
      categories[r.category].total += 1;
      if (r.result) {
        categories[r.category].count += 1;
        trueCount += 1;
      }
    });

    Object.keys(categories).forEach(cat => {
      categories[cat].score = Math.round((categories[cat].count / categories[cat].total) * 100);
    });

    return {
      categories,
      overallIndex: results.length > 0 ? Math.round((trueCount / results.length) * 100) : 0,
      signalStability,
      isLogprobBased
    };
  }, [results, signalStability, isLogprobBased]);

  const radarData = useMemo(() => {
    return (Object.entries(summary.categories) as [string, { score: number; count: number; total: number }][]).map(([name, data]) => ({
      subject: name,
      A: data.score,
      fullMark: 100,
    }));
  }, [summary]);

  const getRank = (index: number) => {
    if (index > 80) return { label: 'Forensische Exzellenz', color: 'text-purple-400' };
    if (index > 60) return { label: 'Signifikante Evidenz', color: 'text-blue-400' };
    if (index > 40) return { label: 'Indikative Muster', color: 'text-green-400' };
    if (index > 20) return { label: 'Minimale Signale', color: 'text-yellow-400' };
    return { label: 'Keine signifikanten Muster', color: 'text-slate-400' };
  };

  const rank = getRank(summary.overallIndex);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Overall Index Card */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Muster-Konzentration</h3>
          <div className="relative flex items-center justify-center w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * summary.overallIndex) / 100} className="text-blue-500 transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            </svg>
            <span className="absolute text-4xl font-black text-white">{summary.overallIndex}%</span>
          </div>
          <span className={`text-sm font-bold uppercase tracking-widest ${rank.color}`}>{rank.label}</span>
        </div>

        {/* Statistical Signal Integrity Card (Logprobs) */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-2xl group relative overflow-hidden">
          <div className={`absolute top-0 right-0 p-1.5 px-3 rounded-bl-lg text-[8px] font-black tracking-widest uppercase ${summary.isLogprobBased ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {summary.isLogprobBased ? 'Logprob Verified' : 'Model Estimate'}
          </div>
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Statistisches Vertrauen</h3>
          <div className={`text-5xl font-black mb-2 drop-shadow-lg ${summary.isLogprobBased ? 'text-emerald-400' : 'text-amber-400'}`}>{summary.signalStability}%</div>
          <p className="text-[9px] text-slate-500 uppercase tracking-tighter mb-4 italic">
            {summary.isLogprobBased ? 'Signalgüte via e^log_p' : 'Interpolierte Selbstauskunft'}
          </p>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${summary.isLogprobBased ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]'}`} style={{ width: `${summary.signalStability}%` }}></div>
          </div>
          <div className={`mt-4 text-[10px] font-mono ${summary.isLogprobBased ? 'text-emerald-500/70' : 'text-amber-500/70'}`}>
            {summary.isLogprobBased ? (summary.signalStability > 90 ? 'DATA_CERTIFIED' : 'SIGNAL_NOISE_DETECTED') : 'HEURISTIC_RESULT'}
          </div>
        </div>

        {/* Radar Chart Card */}
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 md:col-span-2 h-64 shadow-2xl">
           <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} />
              <Radar name="Scoring" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} isAnimationActive strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.entries(summary.categories) as [string, { score: number; count: number; total: number }][]).map(([name, data], idx) => (
          <div key={name} className="bg-slate-900/30 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{name}</span>
              <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-500">
                {data.count}/{data.total}
              </span>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                    style={{ width: `${data.score}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                </div>
              </div>
              <span className="text-xl font-black text-slate-200 leading-none">{data.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisDashboard;
