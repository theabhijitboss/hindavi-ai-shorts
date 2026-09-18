# Hindavi Swaraj AI Shorts — Ready-to-Host MVP

## What it does
Topic → AI title → complete voiceover script → scene plan → visual/image prompts.

## Hosting
This is a Next.js app. Recommended: a Node.js-capable VPS/hosting environment.

1. Extract the ZIP.
2. Run `npm install`
3. Create `.env.local` from `.env.example`
4. Put your OpenAI API key in `OPENAI_API_KEY`
5. Run `npm run build`
6. Run `npm start`
7. Point your domain/reverse proxy to the running Next.js app.

## Important
The AI API requires your own API key and usage is billed by the API provider. The ZIP intentionally does not contain any secret key.

## Current MVP
- Marathi/Hindi/English
- 30/60/90 sec
- Cinematic/Motivational/Facts/Emotional/Educational
- JSON scene planning
- Copy script
- Responsive dashboard

## Phase 2
AI voice, AI images/video, captions and FFmpeg MP4 rendering can be added once the hosting environment and API providers are selected.
