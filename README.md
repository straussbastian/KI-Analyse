<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KI-Analyse - Forensic Linguist Analyst

Forensische Analyse von Chat-Konversationen zur Bewertung kognitiver Fähigkeiten. Die Anwendung analysiert Chat-Verläufe anhand von 30 Hypothesen in 6 Kategorien:

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

# API Key in .env.local eintragen
echo "GEMINI_API_KEY=dein_gemini_api_key" > .env.local

# Development Server starten
npm run dev
```

Die App läuft dann auf [http://localhost:3000](http://localhost:3000)

**API Key erhalten:** [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🐳 Docker Deployment

### Lokaler Test mit Docker Compose

```bash
# API Key in .env.local setzen
echo "GEMINI_API_KEY=dein_api_key" > .env.local

# Container bauen und starten
docker-compose up -d
```

Die App läuft dann auf [http://localhost:8095](http://localhost:8095)

### Manueller Docker Build

```bash
# Image bauen
docker build --build-arg GEMINI_API_KEY=dein_api_key -t ki-analyse .

# Container starten
docker run -p 8080:80 ki-analyse
```

### Deployment mit Coolify

Detaillierte Anleitung für das Deployment mit Coolify findest du in [DEPLOYMENT.md](DEPLOYMENT.md).

**Wichtig:** Der `GEMINI_API_KEY` muss in Coolify als **Build Argument** gesetzt werden, nicht als normale Umgebungsvariable!

## 📦 Technologie-Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **AI:** Google Gemini API (@google/genai)
- **Charts:** Recharts
- **Production:** nginx (Alpine Linux)
- **Container:** Multi-stage Docker Build

## 📊 Features

- Analyse von Chat-Konversationen mit Gemini Flash oder Pro
- Bewertung von 30 kognitiven Hypothesen
- Visuelle Darstellung der Ergebnisse mit Radar-Charts
- Signal-Stabilitäts-Indikator
- Detaillierte Begründungen für jede Hypothese

## 🔗 Links

- [AI Studio App](https://ai.studio/apps/drive/1vn7XZYOcQNHfPStKI-dNrcYeiqy2QlrG)
- [Deployment Guide](DEPLOYMENT.md)
- [GitHub Repository](https://github.com/straussbastian/KI-Analyse)
