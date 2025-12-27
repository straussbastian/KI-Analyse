# Logprobs-basierte Analyse mit OpenAI GPT-4o

**BYOK-Architektur:** Keine API-Keys im Build - Keys nur im Browser!

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
const totalProb = jaProb + neinProb;
const normalizedJaProb = totalProb > 0 ? (jaProb / totalProb) : 0;

// Confidence = Sicherheit der gegebenen Antwort
const isYes = answer.includes('JA') || answer.includes('YES') || answer.includes('TRUE');
const confidence = isYes 
  ? normalizedJaProb * 100                    // Bei JA: Zeige JA-Wahrscheinlichkeit
  : (1 - normalizedJaProb) * 100;            // Bei NEIN: Zeige NEIN-Wahrscheinlichkeit
```

### 4. Deutsche Token-Erkennung (WICHTIG!)
GPT-4o antwortet auf Deutsch oft mit "NEIN", aber die Logprobs enthalten "NE" (das erste Token von "NEIN"):

```typescript
// Token-Erkennung für deutsche Antworten
topLogprobs.forEach((item) => {
  const token = item.token.toUpperCase().trim();
  const prob = Math.exp(item.logprob);
  
  if (token.includes('JA') || token.includes('YES') || token.includes('TRUE') || token === '1') {
    jaProb += prob;
  } else if (token.includes('NEIN') || token.includes('NE') || token.includes('NO') || token.includes('FALSE') || token === '0') {
    neinProb += prob;  // ⭐ NE ist entscheidend für deutsche Antworten!
  }
});
```

**Beispiel:**
```
Antwort: "NEIN"
Top Tokens: ["NE" (0.679), "JA" (0.321), ...]
JA: 0.321, NEIN: 0.679
Confidence: 68% (Modell war sich zu 68% sicher bei NEIN)
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
- **NEIN**: `NEIN`, `NE`, `NO`, `FALSE`, `0` ⭐ **NE für deutsche Antworten!**

### Confidence-gewichtetes Scoring
Die Bewertung ist nicht mehr binär, sondern nuanciert:

```typescript
// Punkte-Berechnung pro Hypothese
const points = result 
  ? confidence / 100              // JA: confidence als Punkte
  : (100 - confidence) / 100;     // NEIN: Unsicherheit als Punkte

// Kategorie-Score = Summe der Punkte / Anzahl Hypothesen
```

**Beispiel:**
- JA mit 85% Confidence → 0.85 Punkte
- NEIN mit 85% Confidence → 0.15 Punkte
- Kategorie mit 5 Hypothesen: 3.91 / 5 = 78% Score

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

## Verwendung (BYOK - Bring Your Own Key)

1. **API Keys in der UI einrichten**:
   - App öffnen → API-Key-Manager ausfüllen
   - OpenAI GPT-4o API Key eingeben
   - Keys werden nur im Browser gespeichert (LocalStorage)
   - **Keine .env-Dateien mehr nötig!**

2. **Provider auswählen**:
   - In der UI "GPT-4o" auswählen
   - Chatverlauf einfügen
   - Analyse starten

3. **Ergebnisse interpretieren**:
   - `result: true/false` - Objektive Bewertung
   - `confidence: 0-100` - Mathematisch fundierte Sicherheit
   - `evidence` - Zeigt die Logprobs-Verteilung
   - `score` - Confidence-gewichtete Punkte

4. **Filter verwenden**:
   - **Result-Filter**: Full Set / TRUE / FALSE
   - **Kategorie-Filter**: 6 Kategorien einzeln filterbar
   - **Kombinierbar**: TRUE + "Analysefähigkeit" → Nur erfolgreiche Analyse-Hypothesen

5. **Hypothesen anpassen** (optional):
   - "Hypothesen bearbeiten" klicken
   - Fragen nach Bedarf anpassen
   - Speichern oder zurücksetzen

## Beispiel-Output (v3.1.0)

```json
{
  "id": 1,
  "category": "Analysefähigkeit",
  "statement": "Der Nutzer identifiziert logische Lücken in den Antworten der KI.",
  "result": true,
  "confidence": 95,
  "evidence": "Logprob-basierte Analyse (JA: 95.2%, NEIN: 4.8%)",
  "reasoning": "Objektive Wahrscheinlichkeit basierend auf Token-Logprobs",
  "score": 0.95
}
```

## Debug-Logging (v3.1.0)

Die Console zeigt detaillierte Token-Informationen:

```javascript
Hypothese 3: Antwort="NEIN"
Top Tokens: ['"NE" (0.679)', '"JA" (0.321)', '"Nein" (0.000)', ...]
JA: 0.321, NEIN: 0.679
✓ Hypothese 3/30 analysiert (ID: 3)
```

## Fazit

Die Logprobs-basierte Analyse mit OpenAI GPT-4o bietet eine **objektive, mathematisch fundierte Alternative** zur semantischen Bewertung. 

### **v3.1.0 Verbesserungen:**
- ✅ **NE-Token-Erkennung** für deutsche Antworten
- ✅ **Confidence-gewichtetes Scoring** statt binär
- ✅ **BYOK-Architektur** für maximale Sicherheit
- ✅ **Kategorie-Filter** für detaillierte Analyse
- ✅ **Benutzerdefinierte Hypothesen** für Flexibilität

Während Gemini schneller und günstiger ist, liefert GPT-4o präzisere, transparentere und nuanciertere Ergebnisse.

### **Empfehlung:**
- **Schnelle Screenshots:** Gemini Pro
- **Forensische Analysen:** OpenAI GPT-4o mit Logprobs
- **Production:** BYOK-Architektur für Sicherheit
