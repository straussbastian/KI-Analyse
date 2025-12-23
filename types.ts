
export type LLMProviderType = 'GEMINI_FLASH' | 'GEMINI_PRO' | 'MISTRAL_LARGE';

export interface HypothesisResult {
  id: number;
  category: string;
  statement: string;
  result: boolean;
  confidence: number;
  evidence?: string;
  reasoning?: string;
}

export interface AnalysisSummary {
  categories: {
    [key: string]: {
      score: number;
      count: number;
      total: number;
    }
  };
  overallIndex: number;
  signalStability: number; 
  isLogprobBased: boolean;
  provider: LLMProviderType;
}

export enum AnalysisCategory {
  ANALYSIS = 'Analysefähigkeit',
  ABSTRACTION = 'Abstraktionsfähigkeit',
  SYSTEMS = 'Kontext- & Systemdenken',
  REFLECTION = 'Reflexionsfähigkeit',
  GOAL = 'Zielklarheit',
  COMPLEXITY = 'Umgang mit Komplexität'
}
