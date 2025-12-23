
import React from 'react';

interface InputFormProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ value, onChange, onAnalyze, isLoading }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <h2 className="text-xl font-semibold text-slate-100">Forensischer Daten-Input</h2>
      </div>
      <p className="text-sm text-slate-400 mb-4">
        Fügen Sie hier den kompletten Chatverlauf ein, den Sie analysieren möchten. Die KI wird linguistische Marker und Verhaltensmuster extrahieren.
      </p>
      <textarea
        className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none mono text-sm mb-4"
        placeholder="[User]: Hallo, kannst du mir helfen? ... [AI]: Sicher! ..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        onClick={onAnalyze}
        disabled={isLoading || !value.trim()}
        className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
          isLoading || !value.trim() 
            ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
            : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analysiere Muster...
          </>
        ) : 'Sequenzielle Analyse Starten'}
      </button>
    </div>
  );
};

export default InputForm;
