# Türkçe Marathon — Milliy Sertifikat

A mobile-first Turkish language learning dashboard for the Uzbekistan Milliy Sertifikat exam (B1, B2 and C1), built with React, Vite, Tailwind CSS and Lucide React. The app can run in local-first mode and optionally connects to Supabase for authenticated cloud progress.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Build the static frontend bundle with `npm run build`. Netlify deployments also include the protected `netlify/functions/evaluate-writing` endpoint used by the real Yazma AI grader.

## Real AI writing evaluation

Yazma sends the submitted Turkish text, task prompt, key points, and word-count range to Gemini through a server-side endpoint. The API key is never put in the browser bundle. The model returns a structured score, detailed Uzbek feedback, and a list of grammar/vocabulary corrections. AI feedback is an estimate for practice, not an official TÖMER/BMBA certificate result.

For local development, add your key to the ignored `.env.local` file:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Restart `npm run dev` after changing environment variables. The Vite development middleware reads the secret on the server side. **Do not use `VITE_GEMINI_API_KEY` or commit a real key.** No SDK installation is needed; the server uses Node's built-in `fetch`.

For Netlify production, add `GEMINI_API_KEY` and `GEMINI_MODEL` in the site's environment-variable settings. Also configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the frontend and server function: production essay grading requires an authenticated Supabase session. The function validates that session before calling Gemini. XP is awarded from the returned score through the app's existing completion flow and is synced to Supabase when cloud configuration is enabled; local-first mode keeps the XP locally.

## Dashboard and learning modules

- Profile onboarding and editable CEFR target.
- Dashboard with learner XP, activity streak, target progress and skill results.
- Persistent daily plan and skill practice for reading, listening, writing, speaking and vocabulary.
- Twenty-stage BMBA writing practice with word-count checks, input-quality heuristics, and real AI feedback.
- Timed mock exam with saved results.
- Responsive sidebar, dark mode and the optional **Premium View** theme.

Premium View uses a glossy Turkish-red gradient, dark laminated-glass panels, gold highlights and ruby-red hover glows. Toggle it from the sparkle button in the top header; the preference is saved locally.

## Data and privacy

Profile and local practice progress are stored in the browser's `localStorage`. When a learner submits a Yazma response, that essay and its task context are sent to the configured Gemini service through the server endpoint for evaluation. The provider key remains server-side. If Supabase is configured, authenticated XP/progress synchronization follows the app's existing Supabase policies; otherwise XP and progress remain local. Use **Maʼlumotlarni tozalash** in the profile menu to clear local app data.
