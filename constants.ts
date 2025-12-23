
import { AnalysisCategory } from './types';

export const HYPOTHESES = [
  // Kategorie 1: Analysefähigkeit
  { id: 1, category: AnalysisCategory.ANALYSIS, statement: "Der Nutzer zerlegt komplexe Probleme eigenständig in Teilkomponenten." },
  { id: 2, category: AnalysisCategory.ANALYSIS, statement: "Der Nutzer fordert den Abgleich von mindestens zwei verschiedenen Datenquellen an." },
  { id: 3, category: AnalysisCategory.ANALYSIS, statement: "Der Nutzer identifiziert logische Lücken in den Antworten der KI." },
  { id: 4, category: AnalysisCategory.ANALYSIS, statement: "Der Nutzer nutzt deduktive Logik (wenn A, dann muss B folgen)." },
  { id: 5, category: AnalysisCategory.ANALYSIS, statement: "Der Nutzer verlangt eine Validierung von Behauptungen durch Fakten oder Zahlen." },
  
  // Kategorie 2: Abstraktionsfähigkeit
  { id: 6, category: AnalysisCategory.ABSTRACTION, statement: "Der Nutzer nutzt Analogien, um komplexe Sachverhalte zu erklären oder zu verstehen." },
  { id: 7, category: AnalysisCategory.ABSTRACTION, statement: "Der Nutzer fragt nach zugrunde liegenden Modellen oder Frameworks." },
  { id: 8, category: AnalysisCategory.ABSTRACTION, statement: "Der Nutzer abstrahiert von einem Einzelfall auf eine allgemeingültige Regel." },
  { id: 9, category: AnalysisCategory.ABSTRACTION, statement: "Der Nutzer erkennt Redundanzen in langen Texten oder Argumentationen." },
  { id: 10, category: AnalysisCategory.ABSTRACTION, statement: "Der Nutzer verwendet Fachterminologie über mehrere Domänen hinweg (z.B. Tech & Recht)." },
  
  // Kategorie 3: Kontext- & Systemdenken
  { id: 11, category: AnalysisCategory.SYSTEMS, statement: "Der Nutzer bezieht Informationen aus früheren Chat-Turns explizit wieder mit ein." },
  { id: 12, category: AnalysisCategory.SYSTEMS, statement: "Der Nutzer fragt nach den Auswirkungen einer Entscheidung auf ein gesamtes System." },
  { id: 13, category: AnalysisCategory.SYSTEMS, statement: "Der Nutzer erkennt Abhängigkeiten zwischen verschiedenen Themengebieten." },
  { id: 14, category: AnalysisCategory.SYSTEMS, statement: "Der Nutzer liefert unaufgefordert notwendigen Kontext (Links, Dokumente)." },
  { id: 15, category: AnalysisCategory.SYSTEMS, statement: "Der Nutzer warnt vor potenziellen Domino-Effekten oder Risiken." },
  
  // Kategorie 4: Reflexionsfähigkeit
  { id: 16, category: AnalysisCategory.REFLECTION, statement: "Der Nutzer korrigiert die KI bei methodischen Fehlern." },
  { id: 17, category: AnalysisCategory.REFLECTION, statement: "Der Nutzer reflektiert über die Qualität seiner eigenen Prompts." },
  { id: 18, category: AnalysisCategory.REFLECTION, statement: "Der Nutzer hinterfragt aktiv die 'Sicherheit' oder 'Confidence' der KI-Aussagen." },
  { id: 19, category: AnalysisCategory.REFLECTION, statement: "Der Nutzer gibt Unsicherheiten im eigenen Wissen offen zu." },
  { id: 20, category: AnalysisCategory.REFLECTION, statement: "Der Nutzer fordert alternative Perspektiven oder Gegenargumente an." },
  
  // Kategorie 5: Zielklarheit
  { id: 21, category: AnalysisCategory.GOAL, statement: "Der Nutzer gibt für jeden Prompt ein klares Ziel oder ein gewünschtes Ergebnis vor." },
  { id: 22, category: AnalysisCategory.GOAL, statement: "Der Nutzer definiert strikte Formate (z.B. Tabellen, Wortbegrenzungen)." },
  { id: 23, category: AnalysisCategory.GOAL, statement: "Der Nutzer nutzt negative Constraints (Sagt explizit, was die KI NICHT tun soll)." },
  { id: 24, category: AnalysisCategory.GOAL, statement: "Der Nutzer weist der KI eine spezifische Rolle oder Persona zu." },
  { id: 25, category: AnalysisCategory.GOAL, statement: "Der Nutzer strukturiert seine Anfragen mit klaren Trennern (z.B. Überschriften)." },
  
  // Kategorie 6: Umgang mit Komplexität
  { id: 26, category: AnalysisCategory.COMPLEXITY, statement: "Der Nutzer führt Diskussionen über mehr als 3 Iterationstiefe fort." },
  { id: 27, category: AnalysisCategory.COMPLEXITY, statement: "Der Nutzer lässt sich durch Fachterminologie nicht abschrecken und fragt gezielt nach." },
  { id: 28, category: AnalysisCategory.COMPLEXITY, statement: "Der Nutzer steuert die Komplexität des Outputs aktiv (z.B. 'erkläre es technischer')." },
  { id: 29, category: AnalysisCategory.COMPLEXITY, statement: "Der Nutzer verarbeitet widersprüchliche Informationen ohne die Logik zu verlieren." },
  { id: 30, category: AnalysisCategory.COMPLEXITY, statement: "Der Nutzer schlägt eigene technische Lösungswege für komplexe Probleme vor." }
];
