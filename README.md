# Türkçe Marathon — Milliy Sertifikat

A mobile-first, client-only Turkish language learning dashboard for the Uzbekistan Milliy Sertifikat exam (B1, B2 and C1), built with React, Vite, Tailwind CSS and Lucide React.

## Run locally

```bash
npm install
npm run dev
```

Build a static production bundle with `npm run build`; deploy the generated `dist/` folder to any static host. No backend is required.

## Dashboard and learning modules

- Profile onboarding and editable CEFR target.
- Dashboard with real local XP, activity streak, target progress and skill results (no fabricated leaderboard).
- Persistent daily plan and skill practice for reading, listening, writing, speaking and vocabulary.
- Timed mock exam with saved results.
- Responsive sidebar, dark mode and the optional **Premium View** theme.

Premium View uses a glossy Turkish-red gradient, dark laminated-glass panels, gold highlights and ruby-red hover glows. Toggle it from the sparkle button in the top header; the preference is saved locally.

## Data and privacy

Profile, XP, streak, progress, module scores, vocabulary mastery, exam results, theme settings and daily checklist progress are stored in the browser's `localStorage`. Nothing is sent to a server. Use **Maʼlumotlarni tozalash** in the profile menu to clear local app data.
