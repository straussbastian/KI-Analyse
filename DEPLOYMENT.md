# Deployment mit Coolify

Diese Anleitung beschreibt, wie du die KI-Analyse App mit Coolify deployen kannst.

## Voraussetzungen

- Coolify-Installation
- Gemini API Key von https://aistudio.google.com/app/apikey

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

Füge folgende Build-Argument in Coolify hinzu:

```
GEMINI_API_KEY=dein_gemini_api_key_hier
```

**Wichtig**: In Coolify musst du dies als **Build Argument** setzen, nicht als normale Environment Variable, da der API Key zur Build-Zeit benötigt wird.

### 4. Deploy starten

Klicke auf "Deploy" und warte, bis der Build-Prozess abgeschlossen ist.

## Lokaler Docker-Test

Um das Docker-Image lokal zu testen:

```bash
# Build mit API Key
docker build --build-arg GEMINI_API_KEY=dein_api_key -t ki-analyse .

# Container starten
docker run -p 8080:80 ki-analyse
```

Die App ist dann unter http://localhost:8080 erreichbar.

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
