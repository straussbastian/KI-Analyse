import React, { useState, useEffect } from 'react';
import { AnalysisHistory, getAnalysisHistory, deleteAnalysisFromHistory, clearAnalysisHistory, getHistoryStats } from '../services/historyService';
import { HypothesisResult } from '../types';

interface HistoryPanelProps {
  onLoadAnalysis: (history: AnalysisHistory) => void;
  currentAnalysisId?: string;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onLoadAnalysis, currentAnalysisId }) => {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadHistory();
    
    // Storage Event Listener für Cross-Tab-Sync und Auto-Refresh
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ki-analyse-history') {
        loadHistory();
      }
    };
    
    // Custom Event für App-interne Updates
    const handleHistoryUpdate = () => {
      loadHistory();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('history-update', handleHistoryUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('history-update', handleHistoryUpdate);
    };
  }, []);

  const loadHistory = () => {
    setHistory(getAnalysisHistory());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Diese Analyse wirklich löschen?')) {
      deleteAnalysisFromHistory(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm(`Wirklich alle ${history.length} Analysen löschen?`)) {
      clearAnalysisHistory();
      loadHistory();
    }
  };

  const stats = getHistoryStats();

  const getCategoryScore = (results: HypothesisResult[], category: string) => {
    const categoryResults = results.filter(r => r.category === category);
    if (categoryResults.length === 0) return 0;
    
    const score = categoryResults.reduce((acc, r) => {
      return acc + (r.result ? r.confidence / 100 : (100 - r.confidence) / 100);
    }, 0);
    
    return Math.round((score / categoryResults.length) * 100);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-all flex items-center gap-2 font-bold text-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Historie ({history.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Analyse-Historie</h2>
            <p className="text-slate-400 text-sm mt-1">{history.length} gespeicherte Analysen</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
            >
              {showStats ? 'Liste' : 'Statistik'}
            </button>
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30"
              >
                Alle löschen
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats View */}
        {showStats && history.length > 0 && (
          <div className="p-6 border-b border-slate-800 bg-slate-800/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Gesamt</div>
                <div className="text-2xl font-black text-white">{stats.totalAnalyses}</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Ø Stabilität</div>
                <div className="text-2xl font-black text-emerald-400">{stats.avgSignalStability}%</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Logprobs</div>
                <div className="text-2xl font-black text-blue-400">{stats.logprobsUsage}%</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Provider</div>
                <div className="text-xs font-bold text-white space-y-1 mt-1">
                  {Object.entries(stats.providerUsage).map(([provider, count]) => (
                    <div key={provider} className="flex justify-between">
                      <span className="text-slate-400">{provider.split('_')[0]}:</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-slate-400 text-sm">Noch keine Analysen gespeichert</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const trueCount = item.results.filter(r => r.result).length;
                const categories = ['Analysefähigkeit', 'Abstraktionsfähigkeit', 'Kontext- & Systemdenken', 'Reflexionsfähigkeit', 'Zielklarheit', 'Umgang mit Komplexität'];
                
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onLoadAnalysis(item);
                      setIsOpen(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      currentAnalysisId === item.id
                        ? 'bg-blue-600/20 border-blue-500/50'
                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                            {item.metadata?.analysisDate}
                          </span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                            item.isLogprobBased ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-700 text-slate-400'
                          }`}>
                            {item.provider}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                          {item.chatContent}
                        </p>

                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-slate-400">TRUE: <span className="text-white font-bold">{trueCount}/30</span></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-slate-400">Stabilität: <span className="text-white font-bold">{item.signalStability}%</span></span>
                          </div>
                        </div>

                        {/* Mini Category Scores */}
                        <div className="mt-3 flex gap-1.5 flex-wrap">
                          {categories.map(cat => {
                            const score = getCategoryScore(item.results, cat);
                            return (
                              <div key={cat} className="text-[10px] px-2 py-0.5 rounded bg-slate-700/50 text-slate-400">
                                {cat.split(' ')[0]}: <span className="text-white font-bold">{score}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-2 flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
