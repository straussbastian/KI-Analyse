# Logprobs-basierte Analyse mit OpenAI GPT-4o

## Was ist der Unterschied?

### Vorher (Semantische Bewertung)
- Das LLM bewertet **subjektiv**, ob eine Hypothese zutrifft
- Das Modell "rät" basierend auf seinem Verständnis
- Confidence-Scores sind **vom Modell geschätzt**
- Ergebnis: Unsichere, interpretative Bewertung

### Jetzt (Logprobs-basierte Bewertung)
- Jede Hypothese wird als **binäre Ja/Nein-Frage** gestellt
- Das Modell gibt **Logprobs** (Log-Wahrscheinlichkeiten) für jedes Token aus
- Wir messen die **objektive Wahrscheinlichkeit** für "JA" vs "NEIN"
- Ergebnis: Mathematisch fundierte, objektive Confidence-Scores

## Wie funktioniert es?

### 1. Binäre Fragen
Statt: "Analysiere den Chatverlauf auf 30 Muster"
Jetzt: 30 separate Fragen wie:
```
"Zerlegt der Nutzer komplexe Probleme in Teilkomponenten? 
Antworte nur mit JA oder NEIN."
```

### 2. Logprobs-Extraktion
OpenAI gibt für jedes generierte Token die Wahrscheinlichkeit zurück:

```json
{
  "choices": [{
    "message": { "content": "JA" },
    "logprobs": {
      "content": [{
        "token": "JA",
        "logprob": -0.05,
        "top_logprobs": [
          { "token": "JA", "logprob": -0.05 },    // ~95% sicher
          { "token": "NEIN", "logprob": -3.2 }    // ~5% sicher
        ]
      }]
    }
  }]
}
```

### 3. Confidence-Berechnung
```typescript
// Logprobs in Wahrscheinlichkeiten umrechnen
const jaProb = Math.exp(-0.05);    // ≈ 0.95 (95%)
const neinProb = Math.exp(-3.2);   // ≈ 0.04 (4%)

// Normalisieren
const confidence = (jaProb / (jaProb + neinProb)) * 100;  // 95%
```

## Vorteile

✅ **Objektiv**: Keine subjektive Interpretation durch das Modell
✅ **Präzise**: Mathematisch fundierte Confidence-Scores (0-100%)
✅ **Transparent**: Wir sehen genau, wie sicher sich das Modell ist
✅ **Vergleichbar**: Scores sind über verschiedene Analysen hinweg konsistent

## Technische Details

### API-Calls
- **30 separate API-Calls** (einer pro Hypothese)
- Jeder Call ist unabhängig und fokussiert
- Parallelisierung möglich (aktuell sequenziell für Stabilität)

### Modell-Konfiguration
```typescript
{
  model: "gpt-4o",
  temperature: 0,        // Deterministisch
  max_tokens: 5,         // Nur "JA" oder "NEIN"
  logprobs: true,        // Logprobs aktivieren
  top_logprobs: 5        // Top 5 Token-Wahrscheinlichkeiten
}
```

### Token-Mapping
Das System erkennt verschiedene Antwortformate:
- **JA**: `JA`, `YES`, `TRUE`, `1`
- **NEIN**: `NEIN`, `NO`, `FALSE`, `0`

## Kosten & Performance

### Kosten
- **30 API-Calls** pro Analyse
- Jeder Call: ~100-500 Input-Tokens + 5 Output-Tokens
- Geschätzte Kosten: ~$0.01-0.05 pro Analyse (GPT-4o Preise)

### Performance
- **Sequenziell**: ~30-60 Sekunden pro Analyse
- **Parallel** (zukünftig): ~5-10 Sekunden pro Analyse

## Vergleich: Gemini vs OpenAI

| Feature | Gemini Flash/Pro | OpenAI GPT-4o |
|---------|------------------|---------------|
| Bewertung | Semantisch | Logprobs-basiert |
| API-Calls | 1 | 30 |
| Confidence | Geschätzt | Objektiv |
| Kosten | Niedrig | Mittel |
| Präzision | Gut | Exzellent |
| Logprobs | ❌ Nicht verfügbar | ✅ Verfügbar |

## Verwendung

1. **API Key konfigurieren**:
   ```bash
   cp .env.example .env
   # Füge deinen OpenAI API Key hinzu
   OPENAI_API_KEY=sk-...
   ```

2. **Provider auswählen**:
   - In der UI "GPT-4o" auswählen
   - Chatverlauf einfügen
   - Analyse starten

3. **Ergebnisse interpretieren**:
   - `result: true/false` - Objektive Bewertung
   - `confidence: 0-100` - Mathematisch fundierte Sicherheit
   - `evidence` - Zeigt die Logprobs-Verteilung

## Beispiel-Output

```json
{
  "id": 1,
  "result": true,
  "confidence": 95,
  "evidence": "Logprob-basierte Analyse (JA: 95.2%, NEIN: 4.8%)",
  "reasoning": "Objektive Wahrscheinlichkeit basierend auf Token-Logprobs"
}
```

## Fazit

Die Logprobs-basierte Analyse mit OpenAI GPT-4o bietet eine **objektive, mathematisch fundierte Alternative** zur semantischen Bewertung. Während Gemini schneller und günstiger ist, liefert GPT-4o präzisere und transparentere Ergebnisse.
