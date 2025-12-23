
export interface HypothesisResult {
  id: number;
  category: string;
  statement: string;
  result: boolean;
  confidence: number;
  evidence?: string;
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
}

export enum AnalysisCategory {
  ANALYSIS = 'Analysefähigkeit',
  ABSTRACTION = 'Abstraktionsfähigkeit',
  SYSTEMS = 'Kontext- & Systemdenken',
  REFLECTION = 'Reflexionsfähigkeit',
  GOAL = 'Zielklarheit',
  COMPLEXITY = 'Umgang mit Komplexität'
}
