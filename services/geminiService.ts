
import { GoogleGenAI, Type } from "@google/genai";
import { HYPOTHESES } from "../constants";

export const performForensicAnalysis = async (chatContext: string) => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY ist nicht konfiguriert. Bitte prüfen Sie die Umgebungsvariablen.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-flash-preview';
  
  // Wir müssen der KI die Liste der Kriterien geben, sonst kann sie die IDs nicht zuordnen!
  const criteriaList = HYPOTHESES.map(h => `ID ${h.id} (${h.category}): ${h.statement}`).join('\n');

  const prompt = `
    IDENTITÄT: Du bist ein forensischer Linguist.
    AUFGABE: Analysiere den Chatverlauf auf die folgenden 30 kognitiven Verhaltensmuster.
    
    ZU PRÜFENDE HYPOTHESEN:
    ${criteriaList}
    
    FORENSISCHES MATERIAL (CHAT):
    ${chatContext}
    
    ANALYSE-REGELN:
    - Gib für JEDE ID (1-30) ein Ergebnis zurück.
    - "result": true, wenn das Muster nachweisbar ist.
    - "confidence": 0-100 (Sicherheit deiner Einschätzung).
    - "evidence": Wörtliches Zitat oder präzise Beschreibung der Stelle.
    - "reasoning": Kurze linguistische Herleitung.
    
    ANTWORTE STRENG ALS JSON-ARRAY.
  `;

  const config = {
    temperature: 0, // Maximale Präzision für forensische Aufgaben
    maxOutputTokens: 12000, // Erhöht für 30 detaillierte Ergebnisse
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          result: { type: Type.BOOLEAN },
          confidence: { type: Type.NUMBER },
          evidence: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["id", "result", "confidence", "evidence", "reasoning"],
      },
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt }] }],
      config: config
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Keine Antwort von der Engine erhalten.");
    }

    // Bereinigung von potentiellem Markdown-Rauschen
    const sanitizedJson = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(sanitizedJson);

    if (!Array.isArray(data)) {
      throw new Error("Ungültiges Datenformat von der KI erhalten.");
    }

    // Berechnung der Signalgüte basierend auf der durchschnittlichen KI-Konfidenz der Treffer
    const hits = data.filter(d => d.result);
    const avgHitConf = hits.length > 0 
      ? hits.reduce((acc, curr) => acc + curr.confidence, 0) / hits.length 
      : 80;

    return {
      data,
      signalStability: Math.round(avgHitConf),
      isLogprobBased: false
    };

  } catch (error: any) {
    console.error("Forensic Engine Error:", error);
    throw new Error(error.message || "Unbekannter Fehler in der Analyse-Engine.");
  }
};
