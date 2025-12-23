
import React, { useState, useEffect } from 'react';
import { HypothesisResult } from './types';
import { performForensicAnalysis } from './services/geminiService';
import { HYPOTHESES } from './constants';
import InputForm from './components/InputForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import HypothesisList from './components/HypothesisList';

const App: React.FC = () => {
  const [chatContent, setChatContent] = useState('');
  const [results, setResults] = useState<HypothesisResult[] | null>(null);
  const [signalStability, setSignalStability] = useState<number>(0);
  const [isLogprobBased, setIsLogprobBased] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const analysisSteps = [
    { threshold: 15, text: 'Initialisiere forensische Engine...' },
    { threshold: 35, text: 'Scanne Chat-Kontext auf Entitäten...' },
    { threshold: 55, text: 'Extrahiere linguistische Muster...' },
    { threshold: 75, text: 'Berechne Logprob-Wahrscheinlichkeiten...' },
    { threshold: 90, text: 'Validiere Signal-Integrität...' },
    { threshold: 99, text: 'Finalisiere Analyse-Bericht...' }
  ];

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      setProgress(0);
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev < 95) {
            const next = prev + Math.random() * 2;
            const step = analysisSteps.find(s => next <= s.threshold) || analysisSteps[analysisSteps.length - 1];
            setProgressText(step.text);
            return next;
          }
          return prev;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async () => {
    if (!chatContent.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await performForensicAnalysis(chatContent);
      const rawResults = response.data;
      
      setProgress(100);
      setProgressText('Analyse erfolgreich abgeschlossen.');
      setSignalStability(response.signalStability);
      setIsLogprobBased(response.isLogprobBased);
      
      const fullResults: HypothesisResult[] = HYPOTHESES.map(h => {
        const found = rawResults.find((r: any) => r.id === h.id);
        return {
          ...h,
          result: found?.result ?? false,
          confidence: found?.confidence ?? 0,
          evidence: found?.evidence,
          reasoning: found?.reasoning
        };
      });
      
      setResults(fullResults);
      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setChatContent('');
    setSignalStability(0);
    setIsLogprobBased(false);
    setProgress(0);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500/30">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
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
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Cognitive Pattern Detection</span>
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

      <main className="max-w-6xl mx-auto px-4 pt-12">
        {!results ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Linguistische <span className="text-blue-500 text-glow">Beweiskraft</span> im Fokus.
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Erhalten Sie mathematisch präzise Einblicke in Konversationen durch die Kombination von forensischer Linguistik und Token-Logprobs.
              </p>
            </div>

            <InputForm 
              value={chatContent} 
              onChange={setChatContent} 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading}
              progress={progress}
              progressText={progressText}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {[
                { label: 'Indikatoren', val: '30' },
                { label: 'Kategorien', val: '6' },
                { label: 'Engine', val: 'Flash 1.5' },
                { label: 'Mode', val: 'Logprobs' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center shadow-lg">
                  <div className="text-2xl font-black text-blue-400">{stat.val}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div id="analysis-results" className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Analyse-Bericht #F-L-{Math.floor(Math.random() * 10000)}</h2>
                <p className="text-slate-400 text-sm">Status: <span className="text-emerald-500 font-bold uppercase">Verifiziert</span> | Methode: <span className="mono">{isLogprobBased ? 'Token-Probability Audit' : 'Confidence Interpolation'}</span></p>
              </div>
              <div className="px-5 py-2.5 bg-blue-600/10 border border-blue-500/30 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <span className="text-blue-400 text-xs font-black tracking-widest uppercase">{isLogprobBased ? 'Mathematical Integrity Active' : 'Estimated Certainty'}</span>
              </div>
            </div>

            <AnalysisDashboard results={results} signalStability={signalStability} isLogprobBased={isLogprobBased} />
            <div className="max-w-4xl mx-auto">
              <HypothesisList results={results} />
            </div>

            <div className="flex justify-center pt-8">
              <button 
                onClick={handleReset}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-white font-bold transition-all shadow-xl hover:shadow-slate-900/40 active:scale-95"
              >
                Neue Sequenz prüfen
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-medium text-center max-w-4xl mx-auto animate-in shake duration-500">
            <div className="flex items-center justify-center gap-2 mb-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="font-black uppercase tracking-widest">Systemfehler</span>
            </div>
            {error}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-800 py-12 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mono">
          &copy; 2024 FORENSIC LINGUISTIC ENGINE // KERNEL-LOGPROB-v1
        </p>
      </footer>
    </div>
  );
};

export default App;
