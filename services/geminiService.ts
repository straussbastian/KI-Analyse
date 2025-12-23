
import { GoogleGenAI, Type } from "@google/genai";
import { HYPOTHESES } from "../constants";

export const performForensicAnalysis = async (chatContext: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Wir nutzen gemini-flash-latest, da dieses Modell eine breite Feature-Unterstützung bietet.
  const modelName = 'gemini-flash-latest';
  
  const prompt = `
    IDENTITÄT: Du bist ein forensischer Linguist. Dein Stil ist kühl, präzise und rein datenbasiert.
    AUFGABE: Analysiere den folgenden Chatverlauf auf 30 spezifische kognitive und linguistische Verhaltensmuster.
    
    FORENSISCHES MATERIAL:
    ${chatContext}
    
    ANALYSE-MODUS:
    - Jede Hypothese (ID 1-30) muss einzeln geprüft werden.
    - Suche nach Beweisen wie: Wortwahl, Satzstruktur, Abstraktionsgrad, logische Konsistenz.
    - Sei extrem skeptisch (Hohe Konfidenz nur bei klaren Beweisen).
  `;

  const baseConfig = {
    temperature: 0,
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

  const configWithLogprobs = {
    ...baseConfig,
    responseLogprobs: true,
    logprobs: 3,
  };

  let response;
  let logprobsAvailable = false;

  try {
    // Erster Versuch: Analyse mit mathematischen Logprobs
    response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt }] }],
      config: configWithLogprobs
    });
    logprobsAvailable = true;
  } catch (error: any) {
    const errorMsg = error.message || "";
    // Wenn das Modell oder die Region keine Logprobs unterstützt, Fallback auf Standard-Analyse
    if (errorMsg.includes("Logprobs is not enabled") || errorMsg.includes("INVALID_ARGUMENT") || errorMsg.includes("400")) {
      console.warn("Logprobs nicht verfügbar, starte Fallback-Analyse ohne Logprobs...");
      response = await ai.models.generateContent({
        model: modelName,
        contents: [{ parts: [{ text: prompt }] }],
        config: baseConfig
      });
      logprobsAvailable = false;
    } else {
      // Andere kritische Fehler (z.B. Auth, Quota) weiterreichen
      throw error;
    }
  }

  const rawText = response.text || "[]";
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    console.error("JSON Parsing Error:", rawText);
    throw new Error("Die KI-Antwort konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.");
  }

  // --- BERECHNUNG DER SIGNAL-STABILITÄT ---
  let statisticalStability = 0;
  
  // @ts-ignore
  const logprobsResult = response.candidates?.[0]?.logprobsResult;
  
  if (logprobsAvailable && logprobsResult?.chosenCandidates) {
    const linearProbs = logprobsResult.chosenCandidates.map((c: any) => 
      Math.exp(c.logProbability || 0)
    );
    const avgProb = linearProbs.reduce((a: number, b: number) => a + b, 0) / (linearProbs.length || 1);
    statisticalStability = Math.round(avgProb * 100);
  } else {
    // Heuristischer Fallback: Durchschnitt der modell-internen Konfidenz-Scores
    const avgConf = data.reduce((acc: number, curr: any) => acc + (curr.confidence || 0), 0) / (data.length || 1);
    statisticalStability = Math.round(avgConf);
  }

  return {
    data,
    signalStability: statisticalStability,
    isLogprobBased: logprobsAvailable
  };
};
