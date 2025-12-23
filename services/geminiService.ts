
import { GoogleGenAI, Type } from "@google/genai";
import { HYPOTHESES } from "../constants";

export const performForensicAnalysis = async (chatContext: string) => {
  // Fix: Initialize GoogleGenAI instance with the named apiKey parameter from environment variables
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-pro-preview for complex reasoning and forensic analysis tasks
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = `
    Du bist ein forensischer Linguist. Deine Aufgabe ist es, einen Chatverlauf auf spezifische Verhaltensmuster zu prüfen.
    Analysiere den Kontext extrem objektiv und kritisch.
    
    Wähle "true" nur, wenn explizite Beweise im Text vorliegen. Wenn kein direkter Beweis vorliegt, ist die Antwort zwingend "false".
    
    Du erhältst eine Liste von Hypothesen. Für jede Hypothese musst du:
    1. Entscheiden ob sie "true" oder "false" ist.
    2. Einen Confidence-Score zwischen 0 und 100 vergeben.
    3. Bei "true" einen kurzen Ausschnitt (Evidence) aus dem Text zitieren.
    
    Gib das Ergebnis strikt als JSON-Array zurück.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: `KONTEXT:\n${chatContext}\n\nHYPOTHESEN:\n${JSON.stringify(HYPOTHESES.map(h => ({ id: h.id, statement: h.statement })))}` }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            result: { type: Type.BOOLEAN },
            confidence: { type: Type.INTEGER },
            evidence: { type: Type.STRING }
          },
          required: ["id", "result", "confidence"]
        }
      }
    }
  });

  // Fix: Extract generated text directly from the .text property of GenerateContentResponse
  const jsonStr = response.text?.trim();
  if (!jsonStr) {
    throw new Error("Analysis failed: Empty response from AI.");
  }
  
  return JSON.parse(jsonStr);
};
