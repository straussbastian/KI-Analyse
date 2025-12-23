
import React, { useState, useCallback } from 'react';
import { HypothesisResult } from './types';
import { performForensicAnalysis } from './services/geminiService';
import { HYPOTHESES } from './constants';
import InputForm from './components/InputForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import HypothesisList from './components/HypothesisList';

const App: React.FC = () => {
  const [chatContent, setChatContent] = useState('');
  const [results, setResults] = useState<HypothesisResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!chatContent.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const rawResults = await performForensicAnalysis(chatContent);
      
      // Map back to our full hypothesis objects
      const fullResults: HypothesisResult[] = HYPOTHESES.map(h => {
        const found = rawResults.find((r: any) => r.id === h.id);
        return {
          ...h,
          result: found?.result ?? false,
          confidence: found?.confidence ?? 0,
          evidence: found?.evidence
        };
      });
      
      setResults(fullResults);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError('Analyse fehlgeschlagen. Bitte prüfen Sie Ihre Verbindung oder den API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setChatContent('');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Forensische Linguistik</h1>
              <div className="flex items-center gap-1.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Cognitive Pattern Detection Engine</span>
              </div>
            </div>
          </div>
          {results && (
            <button 
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-slate-100 transition-colors uppercase tracking-wider"
            >
              Neue Analyse
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        {!results ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                Analysiere die <span className="text-blue-500">Intelligenz</span> deiner Konversationen.
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Basierend auf statistischen Modellen extrahiert unsere Engine Reifegrade, Systemdenken und Abstraktionslevel aus Ihren Chat-Logs.
              </p>
            </div>

            <InputForm 
              value={chatContent} 
              onChange={setChatContent} 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading} 
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {[
                { label: 'Hypothesen', val: '30' },
                { label: 'Kategorien', val: '6' },
                { label: 'Engine', val: 'Gemini 3' },
                { label: 'Fokus', val: 'Forensisch' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 text-center">
                  <div className="text-2xl font-bold text-blue-400">{stat.val}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div id="analysis-results" className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Analyse-Bericht #7429</h2>
                <p className="text-slate-400">Status: Verifiziert | Methode: Statistische Inferenz</p>
              </div>
              <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full">
                <span className="text-blue-400 text-sm font-semibold tracking-wide">Berechnungs-Modus: CRITICAL EXTREME</span>
              </div>
            </div>

            <AnalysisDashboard results={results} />
            <HypothesisList results={results} />

            <div className="flex justify-center pt-8">
              <button 
                onClick={handleReset}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-white font-semibold transition-all shadow-lg hover:shadow-slate-900/40"
              >
                Weiteren Kontext prüfen
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm text-center">
            {error}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-800 py-12 text-center">
        <p className="text-slate-500 text-sm mono">
          &copy; 2024 FORENSIC LINGUISTICS ENGINE // VERSION 2.5.0-ALPHA
        </p>
      </footer>
    </div>
  );
};

export default App;
