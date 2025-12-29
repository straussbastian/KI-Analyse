# Deployment mit Coolify - v3.2.0

Diese Anleitung beschreibt, wie du die KI-Analyse App mit Coolify deployen kannst.

## 🔐 BYOK-Architektur (v3.2.0+)

**Wichtig:** Ab Version 3.2.0 nutzt die App eine **BYOK (Bring Your Own Key)** Architektur:

- ✅ **Keine API-Keys im Build oder Container nötig**
- ✅ **Vollständig statische App**
- ✅ **User geben ihre Keys direkt in der UI ein**
- ✅ **Keys werden nur im Browser (LocalStorage) gespeichert**
- ✅ **Maximale Sicherheit und Flexibilität**

## Voraussetzungen

- Coolify-Installation
- **Keine API Keys mehr nötig für Deployment!**
- User benötigen eigene API Keys:
  - **OpenAI API Key** (für GPT-4o mit Logprobs): https://platform.openai.com/api-keys
  - **Gemini API Key** (optional): https://aistudio.google.com/app/apikey

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

### 3. Umgebungsvariablen

**🎉 Keine Umgebungsvariablen mehr nötig!**

Dank der BYOK-Architektur:
- ✅ Keine Build-Arguments erforderlich
- ✅ Keine API-Keys im Container
- ✅ Vollständig statische App
- ✅ User konfigurieren Keys in der UI

### 4. Deploy starten

Klicke auf "Deploy" und warte, bis der Build-Prozess abgeschlossen ist.

## Lokaler Docker-Test

Um das Docker-Image lokal zu testen:

```bash
# Build (keine API Keys nötig!)
docker build -t ki-analyse .

# Container starten
docker run -p 8080:80 ki-analyse
```

Die App ist dann unter http://localhost:8080 erreichbar.

**Oder mit docker-compose:**

```bash
# Build und Start (keine .env nötig!)
docker-compose up -d
```

Die App ist dann unter http://localhost:8095 erreichbar.

**Nach dem Start:**
1. Öffne die App im Browser
2. Gib deine API-Keys in der UI ein
3. Keys werden nur lokal im Browser gespeichert

## Troubleshooting

### Build schlägt fehl
- Prüfe die Build-Logs in Coolify
- Stelle sicher, dass Node.js >=22.11.0 verfügbar ist
- Überprüfe, ob alle Dependencies korrekt installiert wurden

### App lädt nicht
- Überprüfe, ob Port 80 korrekt gemappt ist
- Prüfe die nginx-Logs im Container
- Teste mit `docker logs <container-id>`

### API-Fehler in der App
- Verifiziere, dass die API Keys in der UI korrekt eingegeben wurden
- Prüfe, ob die Keys gültig sind (teste auf den jeweiligen Plattformen)
- Öffne Browser-Console für detaillierte Fehlermeldungen
- Keys werden nur im Browser gespeichert (LocalStorage)

## Technische Details

- **Node Version**: 22-alpine
- **Web Server**: nginx:alpine
- **Build Tool**: Vite 6.0.0
- **Framework**: React 19 + TypeScript
- **Architektur**: BYOK (Bring Your Own Key)
- **Storage**: LocalStorage (Browser-seitig)
- **Security**: Keine Server-seitigen API-Keys

## Neue Features v3.2.0

### 📚 Analyse-Historie
- Alle Analysen werden automatisch im Browser gespeichert
- Max. 50 Analysen in LocalStorage
- Historie-Panel mit Statistiken
- Vergleichsfunktion für alte Analysen

### 📄 PDF-Export
- Professionelle PDF-Berichte mit eingebetteten Charts
- Radar-Diagramme als Grafik exportiert
- Multi-Page Layout mit automatischen Umbrüchen
- Dependencies: jspdf, html2canvas

### ⏱️ Echtzeit-Progress
- Echter Fortschritt bei OpenAI Logprobs-Analyse
- "Analysiere Hypothese X/30" Anzeige
- Callback-System für Real-time Updates

## Migration von v3.1.0 zu v3.2.0

**Keine Breaking Changes!**

1. Neues Image bauen (keine Build-Args mehr nötig)
2. Container neu starten
3. User geben ihre API-Keys in der UI ein
4. Alte Keys aus Build-Konfiguration entfernen

**Vorteile:**
- ✅ Sicherer (keine Keys im Container)
- ✅ Flexibler (User können Keys wechseln)
- ✅ Einfacher (kein Key-Management im Deployment)
- ✅ Multi-User fähig (jeder User seine eigenen Keys)
