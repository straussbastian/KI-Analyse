<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KI-Analyse - Forensic Linguist Analyst

Forensische Analyse von Chat-Konversationen zur Bewertung kognitiver Fähigkeiten.

View your app in AI Studio: https://ai.studio/apps/drive/1vn7XZYOcQNHfPStKI-dNrcYeiqy2QlrG

## Run Locally

**Prerequisites:**  Node.js >= 22.11.0

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Set your API key in .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Build and run
docker-compose up -d
```

App runs on http://localhost:8080

### Manual Docker Build

```bash
docker build --build-arg GEMINI_API_KEY=your_key -t ki-analyse .
docker run -p 8080:80 ki-analyse
```

### Deploy with Coolify

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Coolify deployment instructions.
