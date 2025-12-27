import React, { useState, useEffect } from 'react';
import { AnalysisCategory } from '../types';

interface Hypothesis {
  id: number;
  category: AnalysisCategory;
  statement: string;
}

interface HypothesisEditorProps {
  onSave: (hypotheses: Hypothesis[]) => void;
  onCancel: () => void;
}

const HypothesisEditor: React.FC<HypothesisEditorProps> = ({ onSave, onCancel }) => {
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    // Lade aktuelle Hypothesen aus localStorage oder defaults
    const saved = localStorage.getItem('custom_hypotheses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Hypothesis[];
        if (Array.isArray(parsed)) {
          setHypotheses(parsed);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Hypothesen:', error);
      }
    }
    
    // Lade defaults aus constants falls noch nicht geladen
    if (hypotheses.length === 0) {
      import('../constants').then(({ HYPOTHESES }) => {
        setHypotheses(HYPOTHESES);
      });
    }
  }, []);

  const handleStatementChange = (id: number, newStatement: string) => {
    setHypotheses(prev => 
      prev.map(h => h.id === id ? { ...h, statement: newStatement } : h)
    );
  };

  const handleSave = () => {
    // Validiere dass alle Statements nicht leer sind
    const invalid = hypotheses.filter(h => !h.statement.trim());
    if (invalid.length > 0) {
      alert('Alle Hypothesen müssen einen Text haben!');
      return;
    }

    // Speichere in localStorage
    localStorage.setItem('custom_hypotheses', JSON.stringify(hypotheses));
    onSave(hypotheses);
  };

  const handleReset = () => {
    if (confirm('Wirklich auf Standard-Hypothesen zurücksetzen?')) {
      import('../constants').then(({ HYPOTHESES }) => {
        setHypotheses(HYPOTHESES);
      });
    }
  };

  const groupedHypotheses = hypotheses.reduce((acc, h) => {
    if (!acc[h.category]) acc[h.category] = [];
    acc[h.category].push(h);
    return acc;
  }, {} as Record<AnalysisCategory, Hypothesis[]>);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="text-lg font-bold text-white">Hypothesen bearbeiten</h3>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider font-bold"
        >
          Zurücksetzen
        </button>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Bearbeiten Sie die 30 Hypothesen für die linguistische Analyse. Änderungen werden lokal gespeichert.
      </p>

      <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
        {Object.entries(groupedHypotheses).map(([category, items]: [string, Hypothesis[]]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
              {category}
            </h4>
            {items.map((hypothesis) => (
              <div key={hypothesis.id} className="flex items-start gap-3">
                <span className="text-xs text-slate-500 font-bold mt-2 w-8">
                  {hypothesis.id}.
                </span>
                <textarea
                  value={hypothesis.statement}
                  onChange={(e) => handleStatementChange(hypothesis.id, e.target.value)}
                  onFocus={() => setEditingId(hypothesis.id)}
                  onBlur={() => setEditingId(null)}
                  className={`flex-1 bg-slate-900 border rounded-lg px-3 py-2 text-slate-300 text-sm resize-none transition-all ${
                    editingId === hypothesis.id
                      ? 'border-blue-500 ring-1 ring-blue-500'
                      : 'border-slate-700 focus:border-blue-500'
                  }`}
                  rows={2}
                  placeholder="Hypothese eingeben..."
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-700">
        <button
          onClick={handleSave}
          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider rounded-lg transition-all"
        >
          Speichern
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold uppercase tracking-wider rounded-lg transition-all"
        >
          Abbrechen
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-400">
          <strong>Tipp:</strong> Sie können die Hypothesen jederzeit wieder bearbeiten. Ihre Änderungen werden nur in Ihrem Browser gespeichert.
        </p>
      </div>
    </div>
  );
};

export default HypothesisEditor;
