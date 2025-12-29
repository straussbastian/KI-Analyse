# KI-Analyse - Forensic Linguist Analyst (BYOK) v3.2.0

Forensische Analyse von Chat-Konversationen zur Bewertung kognitiver Fähigkeiten mit **objektiver Logprobs-basierter Bewertung**, **Analyse-Historie** und **PDF-Export**.

🔐 **BYOK (Bring Your Own Key):** Ihre API-Keys werden nur lokal im Browser gespeichert und niemals an Server übertragen.

## 🆕 **v3.2.0 Highlights**

- 📚 **Analyse-Historie:** Alle Analysen automatisch speichern und vergleichen
- 📄 **PDF-Export:** Professionelle Berichte mit Charts exportieren  
- ⏱️ **Echter Progress:** Real-time Fortschritt bei OpenAI Logprobs-Analyse
- 📊 **Statistik-Dashboard:** Übersicht aller Analysen mit Metriken
- 🔄 **Vergleichsfunktion:** Alte Analysen mit einem Klick laden

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
    "recharts": "^3.6.0",         // Chart-Bibliothek
    "jspdf": "^2.5.2",            // PDF-Generierung
    "html2canvas": "^1.4.1"       // Chart-zu-Bild Konvertierung
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
- **jsPDF 2.5.2** - PDF-Berichtsgenerierung
- **html2canvas 1.4.1** - Chart-zu-Bild Konvertierung
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

### 6. Analyse-Historie nutzen
**Automatisches Speichern:**
- Jede Analyse wird automatisch nach Abschluss gespeichert
- Max. 50 Analysen werden aufbewahrt (älteste werden entfernt)

**Manuelles Speichern:**
- **"Speichern" Button:** Manuelle Speicherung der aktuellen Analyse
- **Statusanzeige:** "Gespeichert" zeigt, dass Analyse in Historie ist
- **Feedback:** Visuelle Bestätigung nach erfolgreichem Speichern

**Historie-Panel öffnen:**
- Klick auf "Historie (X)" Button unten rechts
- Zeigt alle gespeicherten Analysen

**Funktionen:**
- **Analyse laden:** Klick auf Eintrag lädt die Analyse wieder
- **Statistik anzeigen:** "Statistik" Tab zeigt Übersicht
- **Analysen löschen:** Einzelne oder alle Analysen entfernen
- **Vergleich:** Alte Analysen mit aktuellen vergleichen

**Gespeicherte Daten:**
- Chat-Verlauf (erste 1000 Zeichen)
- Alle 30 Ergebnisse mit Scores
- Provider und Methode
- Signal-Stabilität
- Timestamp

### 7. PDF-Export erstellen
**Export durchführen:**
1. Analyse abschließen
2. "PDF Export" Button klicken (neben Report-Header)
3. PDF wird automatisch heruntergeladen

**PDF-Inhalt:**
- Zusammenfassung mit Scores
- Radar-Chart als Grafik
- Kategorie-Scores mit Progress-Bars
- Detaillierte TRUE/FALSE Ergebnisse
- Metadaten (Provider, Methode, Datum)

### 8. Echtzeit-Progress (OpenAI)
**Bei Logprobs-Analyse:**
- Zeigt "Analysiere Hypothese X/30 (ID: Y)"
- Prozentsatz basiert auf echtem Fortschritt
- Jeder der 30 API-Calls wird getrackt
- Bei Gemini: Simulierter Progress (1 API-Call)

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

### 📚 Analyse-Historie
- **Automatische Speicherung:** Jede Analyse wird in LocalStorage gespeichert
- **Historie-Panel:** Übersicht aller gespeicherten Analysen mit Mini-Scores
- **Vergleichsfunktion:** Alte Analysen mit einem Klick laden und vergleichen
- **Statistik-Dashboard:** Gesamt-Analysen, Ø Stabilität, Provider-Nutzung
- **Smart Management:** Max. 50 Analysen, älteste werden automatisch entfernt
- **Kategorie-Vorschau:** Alle 6 Kategorien als Mini-Progress-Bars

### 📄 PDF-Export
- **Professionelle Berichte:** PDF-Export mit Dark Theme Design
- **Chart-Integration:** Radar-Diagramme als Grafik eingebettet
- **Multi-Page Layout:** Automatische Seitenumbrüche bei langen Analysen
- **Detaillierte Ergebnisse:** TRUE/FALSE getrennt mit Evidenz
- **Score-Übersicht:** Kategorie-Scores mit Progress-Bars
- **Metadaten:** Provider, Methode, Stabilität, Timestamp

### ⏱️ Echtzeit-Progress
- **Real-time Updates:** Echter Fortschritt bei OpenAI Logprobs-Analyse
- **Hypothesen-Tracking:** Zeigt "Analysiere Hypothese X/30 (ID: Y)"
- **Prozentuale Anzeige:** Genauer Progress statt Simulation
- **30 API-Calls:** Jede Hypothese einzeln getrackt
- **Performance-Optimierung:** Callback-System für schnelle Updates

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

### v3.2.0 (Latest) - December 2025
**Major Features:**
- ✅ **Analyse-Historie:** Alle Analysen automatisch in LocalStorage speichern
- ✅ **PDF-Export:** Professionelle PDF-Berichte mit eingebetteten Grafiken
- ✅ **Echter Progress:** Real-time Fortschrittsanzeige bei OpenAI Logprobs-Analyse
- ✅ **Historie-Panel:** Übersicht, Vergleich und Statistik vergangener Analysen
- ✅ **Chart-Integration:** Radar-Diagramme direkt in PDF exportieren
- ✅ **Performance-Optimierung:** Echte Progress-Updates statt Simulation

**Technical Improvements:**
- LocalStorage-based analysis history with max 50 entries
- HTML2Canvas integration for chart-to-PDF conversion
- Progress callback system for real-time API feedback
- Enhanced PDF layout with multi-page support
- jspdf integration for professional report generation
- History statistics and analytics dashboard

### v3.1.0 - Earlier Version
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

## 📄 Lizenz

MIT License - Siehe [LICENSE](LICENSE) für Details
