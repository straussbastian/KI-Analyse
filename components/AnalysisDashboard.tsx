
import React, { useMemo } from 'react';
import { HypothesisResult, AnalysisSummary } from '../types';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';

interface AnalysisDashboardProps {
  results: HypothesisResult[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ results }) => {
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
      overallIndex: results.length > 0 ? Math.round((trueCount / results.length) * 100) : 0
    };
  }, [results]);

  const radarData = useMemo(() => {
    // Fix: Cast Object.entries to provide explicit typing for the category data to avoid 'unknown' errors (Line 41)
    return (Object.entries(summary.categories) as [string, { score: number; count: number; total: number }][]).map(([name, data]) => ({
      subject: name,
      A: data.score,
      fullMark: 100,
    }));
  }, [summary]);

  const getRank = (index: number) => {
    if (index > 80) return { label: 'Elite Expert', color: 'text-purple-400' };
    if (index > 60) return { label: 'Advanced User', color: 'text-blue-400' };
    if (index > 40) return { label: 'Competent Practitioner', color: 'text-green-400' };
    if (index > 20) return { label: 'Emerging Analyst', color: 'text-yellow-400' };
    return { label: 'Novice/Basic', color: 'text-slate-400' };
  };

  const rank = getRank(summary.overallIndex);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Index Card */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center">
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Gesamt-Reifegrad</h3>
          <div className="relative flex items-center justify-center w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * summary.overallIndex) / 100} className="text-blue-500 transition-all duration-1000" />
            </svg>
            <span className="absolute text-3xl font-bold">{summary.overallIndex}%</span>
          </div>
          <span className={`text-xl font-bold tracking-tight ${rank.color}`}>{rank.label}</span>
        </div>

        {/* Radar Chart Card */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 md:col-span-2 h-64">
           <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Radar name="Scoring" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Fix: Explicitly cast Object.entries to maintain type safety for properties 'count', 'total', and 'score' (Lines 91, 97, 101) */}
        {(Object.entries(summary.categories) as [string, { score: number; count: number; total: number }][]).map(([name, data], idx) => (
          <div key={name} className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-300">{name}</span>
              <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded text-slate-400">
                {data.count}/{data.total}
              </span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000" 
                style={{ width: `${data.score}%`, backgroundColor: COLORS[idx % COLORS.length] }}
              />
            </div>
            <div className="mt-2 text-right">
              <span className="text-lg font-bold text-slate-200">{data.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisDashboard;
