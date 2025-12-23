
import { GoogleGenAI, Type } from "@google/genai";
import { HYPOTHESES } from "../constants";
import { LLMProviderType } from "../types";

const getSystemPrompt = () => {
  const criteriaList = HYPOTHESES.map(h => `ID ${h.id} (${h.category}): ${h.statement}`).join('\n');
  return `
    IDENTITÄT: Du bist ein forensischer Linguist.
    AUFGABE: Analysiere den Chatverlauf auf die folgenden 30 kognitiven Verhaltensmuster.
    
    ZU PRÜFENDE HYPOTHESEN:
    ${criteriaList}
    
    ANALYSE-REGELN:
    - Gib für JEDE ID (1-30) ein Ergebnis zurück.
    - "result": true, wenn das Muster nachweisbar ist.
    - "confidence": 0-100.
    - "evidence": Wörtliches Zitat.
    - "reasoning": Kurze Begründung.
    
    ANTWORTE AUSSCHLIESSLICH ALS REINES JSON-ARRAY. KEIN TEXT DAVOR ODER DANACH.
  `;
};

const callMistral = async (prompt: string, chatContext: string) => {
  // Mistral Integration via Standard-Fetch (OpenAI-kompatibel)
  // Wir nutzen hier beispielhaft den API_KEY, idealerweise gäbe es einen separaten MISTRAL_API_KEY
  const apiKey = process.env.API_KEY; 
  const endpoint = "https://api.mistral.ai/v1/chat/completions";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Hier ist der Chatverlauf zur Analyse:\n\n${chatContext}` }
      ],
      response_format: { type: "json_object" }, // Mistral unterstützt JSON-Modus
      temperature: 0
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Mistral API Error: ${err.message || response.statusText}`);
  }

  const result = await response.json();
  const content = result.choices[0].message.content;
  
  // Mistral gibt oft ein Objekt zurück, das das Array enthält
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : (parsed.results || parsed.analysis || []);
};

export const performForensicAnalysis = async (chatContext: string, provider: LLMProviderType = 'GEMINI_FLASH') => {
  const systemPrompt = getSystemPrompt();

  if (provider === 'MISTRAL_LARGE') {
    const data = await callMistral(systemPrompt, chatContext);
    return {
      data,
      signalStability: 85, // Heuristischer Wert für Mistral
      isLogprobBased: false,
      provider
    };
  }

  // Gemini Path (Default)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = provider === 'GEMINI_PRO' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  const config = {
    temperature: 0,
    maxOutputTokens: 12000,
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
      contents: [{ parts: [{ text: `${systemPrompt}\n\nMATERIAL:\n${chatContext}` }] }],
      config: config
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("Keine Antwort von Gemini.");

    const sanitizedJson = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(sanitizedJson);

    const hits = data.filter((d: any) => d.result);
    const avgHitConf = hits.length > 0 
      ? hits.reduce((acc: number, curr: any) => acc + curr.confidence, 0) / hits.length 
      : 80;

    return {
      data,
      signalStability: Math.round(avgHitConf),
      isLogprobBased: false,
      provider
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
