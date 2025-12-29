import React, { useState } from 'react';
import { HypothesisResult, LLMProviderType } from '../types';
import { saveAnalysisToHistory } from '../services/historyService';

interface SaveButtonProps {
  results: HypothesisResult[];
  signalStability: number;
  isLogprobBased: boolean;
  provider: LLMProviderType;
  chatContent?: string;
  currentAnalysisId?: string;
  onSave: (id: string) => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  results,
  signalStability,
  isLogprobBased,
  provider,
  chatContent,
  currentAnalysisId,
  onSave
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Wenn bereits gespeichert, zeige gespeicherten Status
  if (currentAnalysisId) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-lg">
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Gespeichert</span>
      </div>
    );
  }

  const handleSave = async () => {
    if (!chatContent?.trim()) {
      alert('Kein Inhalt zum Speichern vorhanden.');
      return;
    }

    setIsSaving(true);
    try {
      const savedAnalysis = saveAnalysisToHistory(
        chatContent,
        results,
        signalStability,
        isLogprobBased,
        provider
      );
      
      onSave(savedAnalysis.id);
      setShowSaved(true);
      
      // Nach 3 Sekunden den "Gespeichert" Status ausblenden
      setTimeout(() => {
        setShowSaved(false);
      }, 3000);
      
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern der Analyse.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving || showSaved}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white rounded-lg transition-all font-bold text-sm uppercase tracking-wider shadow-lg disabled:cursor-not-allowed"
    >
      {isSaving ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Speichert...
        </>
      ) : showSaved ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Gespeichert!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
          </svg>
          Speichern
        </>
      )}
    </button>
  );
};

export default SaveButton;
