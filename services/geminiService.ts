
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

const callOpenAI = async (hypothesis: { id: number; statement: string; category: string }, chatContext: string) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_API_KEY;
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const question = `Analysiere den folgenden Chatverlauf und beantworte die Frage mit JA oder NEIN.

Frage: ${hypothesis.statement}

Chatverlauf:
${chatContext}

Antworte ausschließlich mit JA oder NEIN.`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Du bist ein präziser Analyst. Antworte nur mit JA oder NEIN." },
        { role: "user", content: question }
      ],
      temperature: 0,
      max_tokens: 5,
      logprobs: true,
      top_logprobs: 5
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`OpenAI API Error: ${err.error?.message || response.statusText}`);
  }

  const result = await response.json();
  const choice = result.choices[0];
  const answer = choice.message.content.trim().toUpperCase();
  
  const logprobsData = choice.logprobs?.content?.[0];
  if (!logprobsData) {
    throw new Error(`Keine Logprobs für Hypothese ${hypothesis.id}`);
  }

  const topLogprobs = logprobsData.top_logprobs || [];
  let jaProb = 0;
  let neinProb = 0;

  topLogprobs.forEach((item: any) => {
    const token = item.token.toUpperCase();
    const prob = Math.exp(item.logprob);
    
    if (token === 'JA' || token === 'YES' || token === 'TRUE' || token === '1') {
      jaProb += prob;
    } else if (token === 'NEIN' || token === 'NO' || token === 'FALSE' || token === '0') {
      neinProb += prob;
    }
  });

  const totalProb = jaProb + neinProb;
  const normalizedJaProb = totalProb > 0 ? (jaProb / totalProb) : 0;
  
  const isYes = answer.includes('JA') || answer.includes('YES') || answer.includes('TRUE');
  const confidence = Math.round(normalizedJaProb * 100);

  return {
    id: hypothesis.id,
    result: isYes,
    confidence: confidence,
    evidence: `Logprob-basierte Analyse (JA: ${(normalizedJaProb * 100).toFixed(1)}%, NEIN: ${((1 - normalizedJaProb) * 100).toFixed(1)}%)`,
    reasoning: `Objektive Wahrscheinlichkeit basierend auf Token-Logprobs`
  };
};

const callMistral = async (prompt: string, chatContext: string) => {
  // Mistral Integration via Standard-Fetch (OpenAI-kompatibel)
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY || import.meta.env.VITE_API_KEY; 
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

  if (provider === 'OPENAI_GPT4O') {
    const results = [];
    let completedCount = 0;

    for (const hypothesis of HYPOTHESES) {
      try {
        const result = await callOpenAI(hypothesis, chatContext);
        results.push(result);
        completedCount++;
        console.log(`✓ Hypothese ${completedCount}/30 analysiert (ID: ${hypothesis.id})`);
      } catch (error: any) {
        console.error(`✗ Fehler bei Hypothese ${hypothesis.id}:`, error.message);
        results.push({
          id: hypothesis.id,
          result: false,
          confidence: 0,
          evidence: 'Fehler bei der Analyse',
          reasoning: error.message
        });
      }
    }

    const validResults = results.filter(r => r.confidence > 0);
    const avgConfidence = validResults.length > 0
      ? Math.round(validResults.reduce((acc, r) => acc + r.confidence, 0) / validResults.length)
      : 0;

    return {
      data: results,
      signalStability: avgConfidence,
      isLogprobBased: true,
      provider
    };
  }

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
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
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
