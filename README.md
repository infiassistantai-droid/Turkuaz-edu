# Türkçe Marathon — Milliy Sertifikat

A mobile-first Turkish language learning dashboard for the Uzbekistan Milliy Sertifikat exam (B1, B2 and C1), built with React, Vite, Tailwind CSS and Lucide React. The app can run in local-first mode and optionally connects to Supabase for authenticated cloud progress.

## Run locally

```bash
npm ci
npm run dev
```

Create an ignored `.env.local` file to enable optional integrations. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` there for cloud accounts and progress.

Build with `npm run build` and publish `dist`. Cloudflare Pages and Netlify both expose the protected Writing endpoint at `/api/evaluate-writing`. For Cloudflare Pages, deploy with Git integration or Wrangler so the root `functions/` directory is deployed alongside `dist`.

## Real AI writing evaluation

Yazma sends the submitted Turkish text, task prompt, key points, and word-count range to Gemini through a server-side endpoint. The API key is never put in the browser bundle. The model returns a structured score, detailed Uzbek feedback, and a list of grammar/vocabulary corrections. AI feedback is an estimate for practice, not an official TÖMER/BMBA certificate result.

For local development, add your key to the ignored `.env.local` file:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Restart Vite after changing environment variables. The development and preview middleware reads the secret on the server side. Keep provider keys out of all browser variables and add only the public Supabase URL and publishable/anon key to the frontend configuration. Listening plays the bundled recordings, with browser speech available as a fallback.

For production, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` at build time. Set the same values as `SUPABASE_URL` and `SUPABASE_ANON_KEY` for the function, plus the server-only `GEMINI_API_KEY` and optional `GEMINI_MODEL`. Writing evaluation requires an authenticated learner session before contacting Gemini.

Before releasing Beta, apply the [learning-state and clans migration](supabase/20261122120000_learning_state_and_clans.sql) after the base schema, then verify email and Google sign-in, cross-device progress, clan rankings, and the deployed Writing endpoint using a test learner. The migration also enables transactional learner-progress reset.

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
