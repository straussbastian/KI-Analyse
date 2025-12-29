import { AnalysisCategory } from './types';

export const HYPOTHESES = [
  // Kategorie 1: Analysefähigkeit
  { id: 1, category: AnalysisCategory.ANALYSIS, statement: "Der Nutzer strukturiert ein Problem in explizite Teilfragen, Schritte oder Komponenten." },
  { id: 2, category: AnalysisCategory.ANALYSIS, statement: "Der Nutzer fordert explizit den Abgleich von mindestens zwei verschiedenen Quellen oder Dateninputs an." },
  { id: 3, category: AnalysisCategory.ANALYSIS, statement: "Der Nutzer weist auf logische Lücken, Inkonsistenzen oder fehlende Zwischenschritte in der KI-Antwort hin." },
  { id: 4, category: AnalysisCategory.ANALYSIS, statement: "Der Nutzer formuliert Wenn-Dann-Schlüsse oder fordert die Prüfung einer deduktiven Folgerung." },
  { id: 5, category: AnalysisCategory.ANALYSIS, statement: "Der Nutzer fordert eine Validierung von Aussagen durch überprüfbare Fakten, Zahlen oder messbare Kriterien." },

  // Kategorie 2: Abstraktionsfähigkeit
  { id: 6, category: AnalysisCategory.ABSTRACTION, statement: "Der Nutzer nutzt Analogien oder übertragene Vergleiche, um ein Konzept zu erklären oder zu verstehen." },
  { id: 7, category: AnalysisCategory.ABSTRACTION, statement: "Der Nutzer fragt nach zugrunde liegenden Modellen, Frameworks oder Reifegrad-Logiken." },
  { id: 8, category: AnalysisCategory.ABSTRACTION, statement: "Der Nutzer leitet aus einem konkreten Fall eine allgemeine Regel, Heuristik oder Strategie ab oder fordert diese Ableitung an." },
  { id: 9, category: AnalysisCategory.ABSTRACTION, statement: "Der Nutzer markiert Redundanzen oder Dopplungen und fordert Kürzung, Verdichtung oder Entdopplung." },
  { id: 10, category: AnalysisCategory.ABSTRACTION, statement: "Der Nutzer kombiniert Fachterminologie aus unterschiedlichen Domänen innerhalb einer Anfrage oder eines Projekts." },

  // Kategorie 3: Kontext- & Systemdenken
  { id: 11, category: AnalysisCategory.SYSTEMS, statement: "Der Nutzer referenziert frühere Chat-Turns oder Memory-Einträge explizit und nutzt sie als Grundlage für die aktuelle Anfrage." },
  { id: 12, category: AnalysisCategory.SYSTEMS, statement: "Der Nutzer fragt nach Auswirkungen einer Entscheidung auf das Gesamtsystem oder auf angrenzende Prozesse." },
  { id: 13, category: AnalysisCategory.SYSTEMS, statement: "Der Nutzer benennt Abhängigkeiten oder Wechselwirkungen zwischen Themenbereichen explizit." },
  { id: 14, category: AnalysisCategory.SYSTEMS, statement: "Der Nutzer liefert unaufgefordert zusätzlichen Kontext oder Detaildaten, ohne dass die KI danach gefragt hat." },
  { id: 15, category: AnalysisCategory.SYSTEMS, statement: "Der Nutzer benennt potenzielle Kaskaden-Effekte, Folgefehler oder Risiken explizit." },

  // Kategorie 4: Reflexionsfähigkeit
  { id: 16, category: AnalysisCategory.REFLECTION, statement: "Der Nutzer korrigiert die KI bei methodischen Fehlern und benennt die korrigierte Vorgehensweise oder Regel." },
  { id: 17, category: AnalysisCategory.REFLECTION, statement: "Der Nutzer bewertet oder überarbeitet seine eigenen Prompts und nennt konkrete Verbesserungen." },
  { id: 18, category: AnalysisCategory.REFLECTION, statement: "Der Nutzer fragt nach Unsicherheit, Grenzen oder Begründungsbasis von KI-Aussagen." },
  { id: 19, category: AnalysisCategory.REFLECTION, statement: "Der Nutzer formuliert Unsicherheiten oder Wissenslücken im eigenen Beitrag explizit." },
  { id: 20, category: AnalysisCategory.REFLECTION, statement: "Der Nutzer fordert alternative Perspektiven, Gegenargumente oder mehrere Lösungswege explizit an." },

  // Kategorie 5: Zielklarheit
  { id: 21, category: AnalysisCategory.GOAL, statement: "Der Nutzer formuliert im Prompt ein klares Ziel oder ein gewünschtes Ergebnis." },
  { id: 22, category: AnalysisCategory.GOAL, statement: "Der Nutzer definiert explizite Output-Formate sowie formale Constraints zu Struktur, Länge, Feldern oder Reihenfolge." },
  { id: 23, category: AnalysisCategory.GOAL, statement: "Der Nutzer setzt negative Constraints, indem er explizit formuliert, was die KI nicht tun soll." },
  { id: 24, category: AnalysisCategory.GOAL, statement: "Der Nutzer weist der KI explizit eine Rolle, Persona oder Funktionsbeschreibung zu." },
  { id: 25, category: AnalysisCategory.GOAL, statement: "Der Nutzer strukturiert seine Anfragen mit klaren Abschnitten, Trennern oder Überschriften." },

  // Kategorie 6: Umgang mit Komplexität
  { id: 26, category: AnalysisCategory.COMPLEXITY, statement: "Der Nutzer führt eine Diskussion über mindestens vier aufeinander aufbauende Iterationen fort." },
  { id: 27, category: AnalysisCategory.COMPLEXITY, statement: "Der Nutzer stellt gezielte Rückfragen zu Fachbegriffen oder Detailpunkten und fordert Präzisierung statt Vereinfachung." },
  { id: 28, category: AnalysisCategory.COMPLEXITY, statement: "Der Nutzer steuert die Detailtiefe des Outputs aktiv, indem er Technizität, Umfang oder Fokus explizit anpasst." },
  { id: 29, category: AnalysisCategory.COMPLEXITY, statement: "Der Nutzer benennt widersprüchliche Informationen und fordert eine konsistente Auflösung oder ein Entscheidungskriterium." },
  { id: 30, category: AnalysisCategory.COMPLEXITY, statement: "Der Nutzer schlägt eigene technische Lösungswege oder Implementationsansätze explizit vor." }
];
