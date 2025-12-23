
import { GoogleGenAI } from "@google/genai";
import { HYPOTHESES } from "../constants";

export const performForensicAnalysis = async (chatContext: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 'gemini-flash-latest' typically supports logprobs. 
  // We use this model name to stay close to the stable release that supports the feature.
  const modelName = 'gemini-flash-latest';
  
  const prompt = `
    Du bist ein forensischer Linguist der höchsten Stufe. Analysiere den folgenden Chatverlauf auf die unten aufgeführten Hypothesen.
    
    FORENSISCHES MATERIAL (CHAT):
    ${chatContext}
    
    HYPOTHESEN-SET (JSON):
    ${JSON.stringify(HYPOTHESES.map(h => ({ id: h.id, statement: h.statement })))}
    
    ANWEISUNG:
    Erstelle eine forensische Analyse. Gib das Ergebnis AUSSCHLIESSLICH als JSON-Array zurück.
    Jedes Objekt im Array muss folgende Felder haben:
    - id (number)
    - result (boolean)
    - confidence (number, 0-100)
    - evidence (string, kurzes Zitat)
    - reasoning (string, linguistische Begründung)
    
    WICHTIG: Antworte NUR mit dem JSON-Array im Code-Block. Kein Text davor oder danach.
  `;

  let response;
  let logprobsAvailable = false;

  try {
    // Attempt 1: Explicitly request Logprobs
    response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseLogprobs: true,
        logprobs: 3,
        temperature: 0.1,
      }
    });
    
    // Check if the response actually contains logprobs
    // @ts-ignore
    if (response.candidates?.[0]?.logprobsResult) {
      logprobsAvailable = true;
      console.log("Logprobs successfully retrieved from API.");
    }
  } catch (error: any) {
    const errorMsg = error?.message || "";
    if (errorMsg.includes("Logprobs is not enabled") || errorMsg.includes("400")) {
      console.warn("Logprobs failed. Triggering standard fallback.");
      response = await ai.models.generateContent({
        model: modelName,
        contents: [{ parts: [{ text: prompt }] }],
        config: { temperature: 0.1 }
      });
      logprobsAvailable = false;
    } else {
      throw error;
    }
  }

  const rawText = response.text || "";
  let jsonStr = rawText.trim();
  const jsonBlockMatch = jsonStr.match(/```(?:json)?([\s\S]*?)```/);
  if (jsonBlockMatch) {
    jsonStr = jsonBlockMatch[1].trim();
  } else {
    const firstBracket = jsonStr.indexOf('[');
    const lastBracket = jsonStr.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
      jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
    }
  }

  let data;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("Linguistische Engine: JSON-Parsing fehlgeschlagen.");
  }

  let statisticalStability = 0;
  // @ts-ignore
  const logprobsResult = response.candidates?.[0]?.logprobsResult;
  
  if (logprobsAvailable && logprobsResult?.chosenCandidates) {
    const linearProbs = logprobsResult.chosenCandidates.map((c: any) => 
      Math.exp(c.logProbability || 0)
    );
    const avgProb = linearProbs.reduce((a: number, b: number) => a + b, 0) / linearProbs.length;
    statisticalStability = Math.round(avgProb * 100);
  } else {
    // Fallback mean calculation
    const totalConf = data.reduce((acc: number, curr: any) => acc + (curr.confidence || 0), 0);
    statisticalStability = Math.round(totalConf / (data.length || 1));
  }
  
  return {
    data,
    signalStability: statisticalStability,
    isLogprobBased: logprobsAvailable
  };
};
