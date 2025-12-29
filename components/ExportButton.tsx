import React, { useState } from 'react';
import { HypothesisResult, LLMProviderType } from '../types';
import { exportToPDF } from '../services/pdfExportService';

interface ExportButtonProps {
  results: HypothesisResult[];
  signalStability: number;
  isLogprobBased: boolean;
  provider: LLMProviderType;
  chatContent?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  results,
  signalStability,
  isLogprobBased,
  provider,
  chatContent
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF({
        results,
        signalStability,
        isLogprobBased,
        provider,
        timestamp: new Date().toLocaleString('de-DE'),
        chatContent
      });
    } catch (error) {
      console.error('PDF-Export fehlgeschlagen:', error);
      alert('Fehler beim PDF-Export. Bitte versuchen Sie es erneut.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 text-white rounded-lg transition-all font-bold text-sm uppercase tracking-wider shadow-lg disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Exportiere...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PDF Export
        </>
      )}
    </button>
  );
};

export default ExportButton;
