<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KI-Analyse - Forensic Linguist Analyst (BYOK)

Forensische Analyse von Chat-Konversationen zur Bewertung kognitiver Fähigkeiten mit **objektiver Logprobs-basierter Bewertung**.

🔐 **BYOK (Bring Your Own Key):** Ihre API-Keys werden nur lokal im Browser gespeichert und niemals an Server übertragen.

Die Anwendung analysiert Chat-Verläufe anhand von 30 Hypothesen in 6 Kategorien:

- **Analysefähigkeit** - Zerlegung komplexer Probleme
- **Abstraktionsfähigkeit** - Nutzung von Analogien und Modellen
- **Kontext- & Systemdenken** - Erkennung von Abhängigkeiten
- **Reflexionsfähigkeit** - Kritische Selbstbewertung
- **Zielklarheit** - Strukturierte Anfragen
- **Umgang mit Komplexität** - Technische Problemlösung

## 🚀 Schnellstart

**Voraussetzungen:** Node.js >= 22.11.0

### Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App läuft dann auf [http://localhost:3000](http://localhost:3000)

### Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",           // UI-Framework
    "react-dom": "^19.0.0",       // DOM-Rendering
    "@google/genai": "^1.34.0",   // Google Gemini API
    "recharts": "^3.6.0"          // Chart-Bibliothek
  },
  "devDependencies": {
    "vite": "^6.0.0",             // Build-Tool
    "@vitejs/plugin-react": "^4.3.0"  // React-Plugin
  }
}
```

**Installierte Pakete:**
- **React 19.0.0** - Modernes UI-Framework
- **Vite 6.0.0** - Lightning-fast Build Tool
- **@google/genai 1.34.0** - Google Gemini Pro Client
- **Recharts 3.6.0** - React-Charts für Visualisierung
- **TypeScript** - Typsichere Entwicklung
- **Node.js >=22.11.0** - JavaScript Runtime

### API-Keys konfigurieren

**Keine .env-Dateien mehr nötig!** Die App nutzt BYOK (Bring Your Own Key):

1. Öffne die App im Browser
2. Gib deine API-Keys direkt in der UI ein
3. Keys werden nur lokal im Browser gespeichert (LocalStorage)
4. Niemals werden Keys an Server übertragen

**API Keys erhalten:**
- **Google Gemini Pro:** [Google AI Studio](https://aistudio.google.com/app/apikey)
- **OpenAI GPT-4o:** [OpenAI Platform](https://platform.openai.com/api-keys) - Empfohlen für Logprobs-basierte Analyse

**Mindestens ein API-Key wird benötigt.**

## 🎮 Bedienungsanleitung

### 1. API-Keys einrichten
1. App öffnen → API-Key-Manager ausfüllen
2. Keys speichern (werden lokal gespeichert)
3. Provider auswählen (Gemini Pro oder GPT-4o)

### 2. Hypothesen anpassen (optional)
1. "Hypothesen bearbeiten" klicken
2. Fragen nach Bedarf anpassen
3. Speichern oder zurücksetzen

### 3. Analyse durchführen
1. Chat-Verlauf in das Textfeld einfügen
2. Provider auswählen
3. "Analyse starten" klicken

### 4. Ergebnisse filtern
**Result-Filter:**
- `Full Set` - Alle 30 Hypothesen
- `TRUE` - Nur erfolgreiche Antworten
- `FALSE` - Nur fehlgeschlagene Antworten

**Kategorie-Filter:**
- `Alle Kategorien` - Alle 30 Hypothesen
- `Analysefähigkeit` - Hypothesen 1-5
- `Abstraktionsfähigkeit` - Hypothesen 6-10
- `Kontext- & Systemdenken` - Hypothesen 11-15
- `Reflexionsfähigkeit` - Hypothesen 16-20
- `Zielklarheit` - Hypothesen 21-25
- `Umgang mit Komplexität` - Hypothesen 26-30

**Kombination:** Beide Filter können gleichzeitig verwendet werden

### 5. Ergebnisse interpretieren
- **Confidence %:** Wie sicher war das Modell bei seiner Entscheidung
- **Score:** Gewichtete Punkte basierend auf Confidence
- **Evidenz:** Logprobs-Daten (JA/NEIN Wahrscheinlichkeiten)
- **Reasoning:** Begründung des Modells

## 🐳 Docker Deployment

**BYOK-Architektur:** Keine API-Keys im Build oder Container nötig!

### Lokaler Test mit Docker Compose

```bash
# Container bauen und starten
docker-compose up -d
```

Die App läuft dann auf [http://localhost:8095](http://localhost:8095)

### Manueller Docker Build

```bash
# Image bauen (keine API Keys nötig!)
docker build -t ki-analyse .

# Container starten
docker run -p 8080:80 ki-analyse
```

### Deployment mit Coolify

Detaillierte Anleitung für das Deployment mit Coolify findest du in [DEPLOYMENT.md](DEPLOYMENT.md).

**Wichtig:** Keine Build Arguments mehr nötig! Die App ist jetzt vollständig statisch und sicher.
Benutzer geben ihre API-Keys direkt in der UI ein.

## 📦 Technologie-Stack

### Frontend & Build
- **React 19.0.0** - UI-Framework mit modernen Hooks
- **TypeScript** - Typsichere Entwicklung
- **Vite 6.0.0** - Schneller Build-Tool & Dev-Server
- **@vitejs/plugin-react 4.3.0** - React-Plugin für Vite

### AI-Integration
- **@google/genai 1.34.0** - Google Gemini Pro API Client
- **OpenAI API** - GPT-4o mit Logprobs-Unterstützung

### Visualisierung
- **Recharts 3.6.0** - React-Charts für Radar-Diagramme

### Security & Storage
- **BYOK (Bring Your Own Key)** - API-Keys nur im Browser
- **LocalStorage** - Client-seitige Persistenz
- **Environment-Free** - Keine .env-Dateien nötig

### Production
- **nginx (Alpine Linux)** - Webserver für Production
- **Multi-stage Docker Build** - Optimiertes Container-Image
- **Static Site** - Vollständig statische App

### Entwicklungsumgebung
- **Node.js >=22.11.0** - JavaScript Runtime
- **ESLint** - Code-Qualität
- **TypeScript Strict Mode** - Maximale Typsicherheit

## 📊 Features

### 🔐 Sicherheit & Architektur
- **BYOK (Bring Your Own Key):** Maximale Sicherheit - Keys nur im Browser
- **LocalStorage-Speicherung:** API-Keys werden lokal gespeichert
- **Keine Server-Keys:** Vollständig statische App, keine .env-Dateien nötig
- **Production-Ready:** Kann überall sicher deployed werden

### 🤖 AI-Modelle & Analyse
- **Dual-Model Support:** Google Gemini Pro & OpenAI GPT-4o
- **Logprobs-basierte Analyse:** Objektive Bewertung mit GPT-4o (30 separate API-Calls)
- **30 kognitive Hypothesen** in 6 Kategorien
- **Binäre Ja/Nein-Fragen** mit mathematisch fundierten Confidence-Scores (0-100%)
- **Transparente Bewertung:** Logprobs zeigen Token-Wahrscheinlichkeiten für JA/NEIN

### 🎯 Scoring & Bewertung
- **Confidence-gewichtetes Scoring:** Nuancierte Bewertung statt binär
- **JA-Antworten:** `confidence / 100` Punkte (z.B. 85% → 0.85 Punkte)
- **NEIN-Antworten:** `(100 - confidence) / 100` Punkte (z.B. 85% → 0.15 Punkte)
- **Signal-Stabilitäts-Indikator:** Basierend auf durchschnittlicher Confidence
- **Mathematisch fundiert:** Echte Token-Wahrscheinlichkeiten statt Schätzungen

### ✏️ Benutzerdefinierte Hypothesen
- **Hypothesen-Editor:** Alle 30 Fragen direkt in der UI bearbeitbar
- **LocalStorage-Persistenz:** Änderungen bleiben im Browser erhalten
- **Kategorien-basiert:** 6 Kategorien mit je 5 Hypothesen
- **Reset-Funktion:** Zurücksetzen auf Standard-Hypothesen
- **Flexibel:** An spezifische Anwendungsfälle anpassbar

### 🔍 Filter & Navigation
- **Doppelte Filter-Ebene:** Result-Filter + Kategorie-Filter
- **Result-Filter:** Full Set / TRUE / FALSE
- **Kategorie-Filter:** Alle 6 Kategorien einzeln filterbar
- **Kombinierbar:** TRUE + "Analysefähigkeit" → Nur erfolgreiche Analyse-Hypothesen
- **Interaktiv:** Sofortige Anzeige gefilterter Ergebnisse

### 📈 Visualisierung
- **Radar-Charts:** Visuelle Darstellung der 6 Kategorien
- **Detailansichten:** Evidenz und Reasoning für jede Hypothese
- **Progress-Balken:** Confidence-Scores visuell dargestellt
- **Responsive Design:** Optimal auf allen Geräten

### Unterschied: Semantisch vs. Logprobs-basiert

**Semantische Bewertung (Gemini Pro):**
- 1 API-Call für alle 30 Hypothesen
- Modell interpretiert und bewertet subjektiv
- Schneller, aber weniger präzise

**Logprobs-basierte Bewertung (OpenAI GPT-4o):**
- 30 separate API-Calls (eine Ja/Nein-Frage pro Hypothese)
- Objektive Wahrscheinlichkeiten aus Token-Logprobs
- Mathematisch fundierte Confidence-Scores
- Transparente, nachvollziehbare Bewertung

Mehr Details: [LOGPROBS_EXPLAINED.md](LOGPROBS_EXPLAINED.md)

## 🔒 Sicherheit

**BYOK-Architektur:**
- API-Keys werden **nur** im Browser gespeichert (LocalStorage)
- **Keine** Server-seitige Speicherung
- **Keine** Übertragung an Backend-Server
- **Keine** .env-Dateien im Repository
- Vollständig statische App - kann überall gehostet werden

**Wichtig:** Ihre API-Keys verlassen niemals Ihren Browser!

## 📝 Changelog

### v3.1.0 (Latest) - December 2024
**Major Features:**
- ✅ **BYOK-Architektur:** Vollständige Umstellung auf Bring Your Own Key
- ✅ **Hypothesen-Editor:** Alle 30 Fragen direkt in der UI bearbeitbar
- ✅ **Confidence-gewichtetes Scoring:** Nuancierte Bewertung statt binär
- ✅ **Kategorie-Filter:** Doppelte Filter-Ebene (Result + Kategorie)
- ✅ **NE-Token-Erkennung:** Korrekte Logprobs-Analyse für deutsche Antworten
- ✅ **Security-Update:** Keine API-Keys mehr im Build oder Container

**Technical Improvements:**
- Enhanced Logprobs parsing with German token support
- Improved confidence calculation for FALSE responses
- LocalStorage-based configuration persistence
- Multi-stage Docker optimization
- TypeScript strict mode compliance

### v3.0.0 - Earlier Version
- Initial forensische Analyse mit 30 Hypothesen
- Dual-Model Support (Gemini Pro + GPT-4o)
- Logprobs-basierte Bewertung
- Radar-Chart Visualisierung

## 🔗 Links

- [Logprobs Explained](LOGPROBS_EXPLAINED.md) - Technische Details zur objektiven Bewertung
- [Deployment Guide](DEPLOYMENT.md) - Coolify & Docker Deployment
- [GitHub Repository](https://github.com/straussbastian/KI-Analyse)
- [AI Studio App](https://ai.studio/apps/drive/1vn7XZYOcQNHfPStKI-dNrcYeiqy2QlrG)

## 📄 Lizenz

MIT License - Siehe [LICENSE](LICENSE) für Details
