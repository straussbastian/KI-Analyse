
import React from 'react';
import { LLMProviderType } from '../types';

interface InputFormProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: (provider: LLMProviderType) => void;
  isLoading: boolean;
  progress?: number;
  progressText?: string;
}

const InputForm: React.FC<InputFormProps> = ({ 
  value, 
  onChange, 
  onAnalyze, 
  isLoading, 
  progress = 0, 
  progressText = '' 
}) => {
  const [selectedProvider, setSelectedProvider] = React.useState<LLMProviderType>('GEMINI_FLASH');

  const providers: { id: LLMProviderType; name: string; desc: string; color: string }[] = [
    { id: 'GEMINI_FLASH', name: 'Gemini 3 Flash', desc: 'Schnell & Präzise', color: 'bg-blue-600' },
    { id: 'GEMINI_PRO', name: 'Gemini 3 Pro', desc: 'Tiefenanalyse', color: 'bg-indigo-600' },
    { id: 'MISTRAL_LARGE', name: 'Mistral Large', desc: 'Alternative Logik', color: 'bg-amber-600' }
  ];

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`}></div>
          <h2 className="text-xl font-semibold text-slate-100">Forensischer Daten-Input</h2>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
          {providers.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProvider(p.id)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
                selectedProvider === p.id 
                  ? `${p.color} text-white shadow-lg` 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <textarea
        className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none mono text-sm mb-4"
        placeholder="Fügen Sie hier den Chatverlauf ein..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
      />
      
      {isLoading && (
        <div className="mb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-slate-500">
            <span>{progressText}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-300 ease-out ${providers.find(p => p.id === selectedProvider)?.color}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <button
        onClick={() => onAnalyze(selectedProvider)}
        disabled={isLoading || !value.trim()}
        className={`w-full py-4 rounded-lg font-black text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
          isLoading || !value.trim() 
            ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
            : `${providers.find(p => p.id === selectedProvider)?.color} hover:brightness-110 shadow-lg active:scale-[0.98]`
        }`}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : `Analyse via ${selectedProvider.split('_')[0]}`}
      </button>
    </div>
  );
};

export default InputForm;
