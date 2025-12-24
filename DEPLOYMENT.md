# Deployment mit Coolify

Diese Anleitung beschreibt, wie du die KI-Analyse App mit Coolify deployen kannst.

## Voraussetzungen

- Coolify-Installation
- API Keys:
  - **OpenAI API Key** (für GPT-4o mit Logprobs): https://platform.openai.com/api-keys
  - **Gemini API Key** (optional): https://aistudio.google.com/app/apikey
  - **Mistral API Key** (optional): https://console.mistral.ai/

## Deployment-Schritte

### 1. Neues Projekt in Coolify erstellen

1. Gehe zu deiner Coolify-Instanz
2. Erstelle ein neues Projekt
3. Wähle "Git Repository" als Quelle
4. Verbinde dein GitHub Repository: `git@github.com:straussbastian/KI-Analyse.git`

### 2. Build-Konfiguration

Coolify erkennt automatisch das Dockerfile. Stelle sicher, dass folgende Einstellungen gesetzt sind:

- **Build Method**: Dockerfile
- **Port**: 80
- **Dockerfile Path**: `./Dockerfile` (Standard)

### 3. Umgebungsvariablen setzen

Füge folgende Build-Argumente in Coolify hinzu:

```
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIza...
MISTRAL_API_KEY=...
API_KEY=AIza...
```

**Wichtig**: 
- In Coolify musst du diese als **Build Arguments** setzen, nicht als normale Environment Variables
- Die API Keys werden zur Build-Zeit benötigt und in das finale Image eingebaut
- Das Dockerfile konvertiert diese automatisch zu `VITE_` prefixed Variablen für Vite

### 4. Deploy starten

Klicke auf "Deploy" und warte, bis der Build-Prozess abgeschlossen ist.

## Lokaler Docker-Test

Um das Docker-Image lokal zu testen:

```bash
# Build mit API Keys
docker build \
  --build-arg OPENAI_API_KEY=sk-proj-... \
  --build-arg GEMINI_API_KEY=AIza... \
  --build-arg MISTRAL_API_KEY=... \
  --build-arg API_KEY=AIza... \
  -t ki-analyse .

# Container starten
docker run -p 8080:80 ki-analyse
```

Die App ist dann unter http://localhost:8080 erreichbar.

**Oder mit docker-compose:**

```bash
# .env Datei erstellen
cp .env.example .env
# API Keys in .env eintragen

# Build und Start
docker-compose up -d
```

Die App ist dann unter http://localhost:8095 erreichbar.

## Troubleshooting

### Build schlägt fehl
- Stelle sicher, dass der GEMINI_API_KEY als Build-Argument gesetzt ist
- Prüfe die Build-Logs in Coolify

### App lädt nicht
- Überprüfe, ob Port 80 korrekt gemappt ist
- Prüfe die nginx-Logs im Container

### API-Fehler
- Verifiziere, dass der Gemini API Key gültig ist
- Stelle sicher, dass der Key zur Build-Zeit verfügbar war

## Technische Details

- **Node Version**: 22-alpine
- **Web Server**: nginx:alpine
- **Build Tool**: Vite
- **Framework**: React 19 + TypeScript
