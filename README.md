<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KI-Analyse - Forensic Linguist Analyst

Forensische Analyse von Chat-Konversationen zur Bewertung kognitiver Fähigkeiten mit **objektiver Logprobs-basierter Bewertung**. Die Anwendung analysiert Chat-Verläufe anhand von 30 Hypothesen in 6 Kategorien:

- **Analysefähigkeit** - Zerlegung komplexer Probleme
- **Abstraktionsfähigkeit** - Nutzung von Analogien und Modellen
- **Kontext- & Systemdenken** - Erkennung von Abhängigkeiten
- **Reflexionsfähigkeit** - Kritische Selbstbewertung
- **Zielklarheit** - Strukturierte Anfragen
- **Umgang mit Komplexität** - Technische Problemlösung

## 🚀 Lokale Entwicklung

**Voraussetzungen:** Node.js >= 22.11.0

### Installation

```bash
# Dependencies installieren
npm install

# API Keys in .env.local eintragen
cp .env.example .env.local
# Bearbeite .env.local und füge deine API Keys hinzu:
# VITE_OPENAI_API_KEY=sk-proj-...
# VITE_GEMINI_API_KEY=AIza...
# VITE_MISTRAL_API_KEY=...

# Development Server starten
npm run dev
```

Die App läuft dann auf [http://localhost:3000](http://localhost:3000)

**API Keys erhalten:**
- **OpenAI (GPT-4o):** [OpenAI Platform](https://platform.openai.com/api-keys) - Empfohlen für Logprobs-basierte Analyse
- **Gemini:** [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Mistral:** [Mistral Console](https://console.mistral.ai/)

## 🐳 Docker Deployment

### Lokaler Test mit Docker Compose

```bash
# .env Datei erstellen
cp .env.example .env
# API Keys in .env eintragen (ohne VITE_ Prefix)

# Container bauen und starten
docker-compose up -d
```

Die App läuft dann auf [http://localhost:8095](http://localhost:8095)

### Manueller Docker Build

```bash
# Image bauen mit allen API Keys
docker build \
  --build-arg OPENAI_API_KEY=sk-proj-... \
  --build-arg GEMINI_API_KEY=AIza... \
  --build-arg MISTRAL_API_KEY=... \
  --build-arg API_KEY=AIza... \
  -t ki-analyse .

# Container starten
docker run -p 8080:80 ki-analyse
```

### Deployment mit Coolify

Detaillierte Anleitung für das Deployment mit Coolify findest du in [DEPLOYMENT.md](DEPLOYMENT.md).

**Wichtig:** Die API Keys müssen in Coolify als **Build Arguments** gesetzt werden:
- `OPENAI_API_KEY` (für GPT-4o mit Logprobs)
- `GEMINI_API_KEY` (optional)
- `MISTRAL_API_KEY` (optional)
- `API_KEY` (Fallback, meist = GEMINI_API_KEY)

## 📦 Technologie-Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **AI Models:**
  - OpenAI GPT-4o (Logprobs-basiert, empfohlen)
  - Google Gemini API (@google/genai)
  - Mistral Large
- **Charts:** Recharts
- **Production:** nginx (Alpine Linux)
- **Container:** Multi-stage Docker Build

## 📊 Features

- **Multi-Model Support:** OpenAI GPT-4o, Gemini Flash/Pro, Mistral Large
- **Logprobs-basierte Analyse:** Objektive Bewertung mit GPT-4o (30 separate API-Calls)
- **30 kognitive Hypothesen** in 6 Kategorien
- **Binäre Ja/Nein-Fragen** mit mathematisch fundierten Confidence-Scores (0-100%)
- **Visuelle Darstellung** mit Radar-Charts und Detailansichten
- **Signal-Stabilitäts-Indikator** basierend auf durchschnittlicher Confidence
- **Transparente Bewertung:** Logprobs zeigen Token-Wahrscheinlichkeiten für JA/NEIN

### Unterschied: Semantisch vs. Logprobs-basiert

**Semantische Bewertung (Gemini/Mistral):**
- 1 API-Call für alle 30 Hypothesen
- Modell interpretiert und bewertet subjektiv
- Schneller, aber weniger präzise

**Logprobs-basierte Bewertung (OpenAI GPT-4o):**
- 30 separate API-Calls (eine Ja/Nein-Frage pro Hypothese)
- Objektive Wahrscheinlichkeiten aus Token-Logprobs
- Mathematisch fundierte Confidence-Scores
- Transparente, nachvollziehbare Bewertung

Mehr Details: [LOGPROBS_EXPLAINED.md](LOGPROBS_EXPLAINED.md)

## 🔗 Links

- [Logprobs Explained](LOGPROBS_EXPLAINED.md) - Technische Details zur objektiven Bewertung
- [Deployment Guide](DEPLOYMENT.md) - Coolify & Docker Deployment
- [GitHub Repository](https://github.com/straussbastian/KI-Analyse)
- [AI Studio App](https://ai.studio/apps/drive/1vn7XZYOcQNHfPStKI-dNrcYeiqy2QlrG)
