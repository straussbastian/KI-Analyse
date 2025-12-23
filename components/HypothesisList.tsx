
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
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-xl overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Detaillierter Hypothesen-Check</h2>
          <p className="text-sm text-slate-400">Einzelbewertung der 30 Verhaltensindikatoren</p>
        </div>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'all' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Alle
          </button>
          <button 
            onClick={() => setFilter('true')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'true' ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            True
          </button>
          <button 
            onClick={() => setFilter('false')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'false' ? 'bg-rose-600/20 text-rose-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            False
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-700/50">
        {filtered.map((item) => (
          <div key={item.id} className="p-6 hover:bg-slate-700/20 transition-colors group">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                {item.result ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.category}</span>
                  <span className="text-xs font-mono text-slate-500">Confidence: {item.confidence}%</span>
                </div>
                <h3 className="text-slate-100 font-medium mb-2 leading-relaxed">{item.statement}</h3>
                {item.result && item.evidence && (
                  <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <p className="text-xs text-slate-500 mb-1 font-semibold flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      EVIDENCE (EXTRACT)
                    </p>
                    <p className="text-sm italic text-slate-300 mono">"{item.evidence}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            Keine Einträge für diesen Filter gefunden.
          </div>
        )}
      </div>
    </div>
  );
};

export default HypothesisList;
