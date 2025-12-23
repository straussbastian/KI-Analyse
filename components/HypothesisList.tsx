
import React, { useState } from 'react';
import { HypothesisResult } from '../types';

interface HypothesisListProps {
  results: HypothesisResult[];
}

const HypothesisList: React.FC<HypothesisListProps> = ({ results }) => {
  const [filter, setFilter] = useState<'all' | 'true' | 'false'>('all');

  const filtered = results.filter(r => {
    if (filter === 'true') return r.result;
    if (filter === 'false') return !r.result;
    return true;
  });

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mt-8">
      <div className="p-8 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Forensischer Audit</h2>
          <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Linguistic Evidence Protocol</p>
        </div>
        <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
          {(['all', 'true', 'false'] as const).map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filter === f ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}
            >
              {f === 'all' ? 'Full Set' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-800/50">
        {filtered.map((item) => (
          <div key={item.id} className="p-8 hover:bg-slate-800/20 transition-all group">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                {item.result ? (
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center opacity-40">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${item.confidence}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.confidence}% CONF</span>
                  </div>
                </div>
                <h3 className="text-slate-100 font-bold text-lg mb-4 group-hover:text-blue-400 transition-colors">{item.statement}</h3>
                
                {item.result && (
                  <div className="space-y-3">
                    {item.evidence && (
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/50">
                        <span className="text-[9px] font-black text-slate-600 uppercase mb-2 block tracking-widest">Raw Extract</span>
                        <p className="text-sm italic text-slate-300 mono leading-relaxed">"{item.evidence}"</p>
                      </div>
                    )}
                    {/* @ts-ignore - reasoning comes from dynamic JSON response */}
                    {item.reasoning && (
                      <div className="px-4 py-2 border-l-2 border-blue-500/30">
                        <span className="text-[9px] font-black text-blue-500/50 uppercase mb-1 block tracking-widest">Linguistic Reasoning</span>
                        {/* @ts-ignore */}
                        <p className="text-xs text-slate-400 leading-relaxed">{item.reasoning}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HypothesisList;
