import React, { useState, useEffect } from 'react';
import { LLMProviderType } from '../types';

interface ApiKeyManagerProps {
  onKeysConfigured: (keys: { gemini?: string; openai?: string }) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onKeysConfigured }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const savedGemini = localStorage.getItem('gemini_api_key');
    const savedOpenai = localStorage.getItem('openai_api_key');
    
    if (savedGemini) setGeminiKey(savedGemini);
    if (savedOpenai) setOpenaiKey(savedOpenai);
    
    if (savedGemini || savedOpenai) {
      setIsConfigured(true);
      onKeysConfigured({ 
        gemini: savedGemini || undefined, 
        openai: savedOpenai || undefined 
      });
    }
  }, []);

  const handleSave = () => {
    if (geminiKey) localStorage.setItem('gemini_api_key', geminiKey);
    if (openaiKey) localStorage.setItem('openai_api_key', openaiKey);
    
    setIsConfigured(true);
    onKeysConfigured({ 
      gemini: geminiKey || undefined, 
      openai: openaiKey || undefined 
    });
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('openai_api_key');
    setGeminiKey('');
    setOpenaiKey('');
    setIsConfigured(false);
    onKeysConfigured({});
  };

  if (isConfigured) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-emerald-400 text-sm font-bold">API-Keys konfiguriert</span>
          </div>
          <button 
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-wider font-bold"
          >
            Ändern
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        <h3 className="text-lg font-bold text-white">API-Keys konfigurieren</h3>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Ihre API-Keys werden nur lokal im Browser gespeichert und niemals an Server übertragen.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Google Gemini API Key (für Gemini Pro)
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mono text-sm"
          />
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
          >
            → API-Key erstellen
          </a>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            OpenAI API Key (für GPT-4o mit Logprobs)
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            placeholder="sk-proj-..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mono text-sm"
          />
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
          >
            → API-Key erstellen
          </a>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="showKeys"
            checked={showKeys}
            onChange={(e) => setShowKeys(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="showKeys" className="text-sm text-slate-400 cursor-pointer">
            Keys anzeigen
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={!geminiKey && !openaiKey}
          className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${
            geminiKey || openaiKey
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Keys speichern
        </button>
      </div>

      <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
        <p className="text-xs text-amber-400">
          <strong>Hinweis:</strong> Mindestens ein API-Key wird benötigt. Die Keys werden nur in Ihrem Browser gespeichert (LocalStorage).
        </p>
      </div>
    </div>
  );
};

export default ApiKeyManager;
