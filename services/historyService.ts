import { HypothesisResult, LLMProviderType } from '../types';

export interface AnalysisHistory {
  id: string;
  timestamp: number;
  chatContent: string;
  results: HypothesisResult[];
  signalStability: number;
  isLogprobBased: boolean;
  provider: LLMProviderType;
  metadata?: {
    chatLength: number;
    analysisDate: string;
  };
}

const STORAGE_KEY = 'ki-analyse-history';
const MAX_HISTORY_ITEMS = 50;

export const saveAnalysisToHistory = (
  chatContent: string,
  results: HypothesisResult[],
  signalStability: number,
  isLogprobBased: boolean,
  provider: LLMProviderType
): AnalysisHistory => {
  const history = getAnalysisHistory();
  
  const newEntry: AnalysisHistory = {
    id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    chatContent: chatContent.substring(0, 1000), // Nur erste 1000 Zeichen speichern
    results,
    signalStability,
    isLogprobBased,
    provider,
    metadata: {
      chatLength: chatContent.length,
      analysisDate: new Date().toLocaleString('de-DE')
    }
  };

  history.unshift(newEntry);
  
  // Limit auf MAX_HISTORY_ITEMS
  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  
  // Custom Event auslösen für UI-Update
  window.dispatchEvent(new CustomEvent('history-update'));
  
  return newEntry;
};

export const getAnalysisHistory = (): AnalysisHistory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Fehler beim Laden der Historie:', error);
    return [];
  }
};

export const deleteAnalysisFromHistory = (id: string): void => {
  const history = getAnalysisHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  
  // Custom Event auslösen für UI-Update
  window.dispatchEvent(new CustomEvent('history-update'));
};

export const clearAnalysisHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  
  // Custom Event auslösen für UI-Update
  window.dispatchEvent(new CustomEvent('history-update'));
};

export const getAnalysisById = (id: string): AnalysisHistory | null => {
  const history = getAnalysisHistory();
  return history.find(item => item.id === id) || null;
};

export const getHistoryStats = () => {
  const history = getAnalysisHistory();
  
  if (history.length === 0) {
    return {
      totalAnalyses: 0,
      avgSignalStability: 0,
      providerUsage: {},
      logprobsUsage: 0
    };
  }

  const providerUsage: Record<string, number> = {};
  let logprobsCount = 0;
  let totalStability = 0;

  history.forEach(item => {
    providerUsage[item.provider] = (providerUsage[item.provider] || 0) + 1;
    if (item.isLogprobBased) logprobsCount++;
    totalStability += item.signalStability;
  });

  return {
    totalAnalyses: history.length,
    avgSignalStability: Math.round(totalStability / history.length),
    providerUsage,
    logprobsUsage: Math.round((logprobsCount / history.length) * 100)
  };
};
