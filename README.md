# Türkçe Marathon — Milliy Sertifikat

Mobile-first, client-only Turkish language practice for the Uzbekistan Milliy Sertifikat exam (B1, B2 and C1). The app is built with React 18, Vite, Tailwind CSS and Lucide React; it requires no API or backend.

## Run locally

```bash
npm install
npm run dev
```

Create a production bundle with `npm run build`, then serve `dist/` from any static hosting provider. The Vite preview can be started with `npm run preview`.

## Included modules

- First-run learner profile (name, surname and target level), editable from the profile menu.
- Dashboard, daily study plan, XP and streak tracking.
- Reading passages with font controls, vocabulary hints and answer feedback.
- Listening script/audio simulation, writing prompts and rubrics, and timed speaking practice.
- Turkish vocabulary flashcards with mastery and saved-word tracking.
- Timed mock exam with saved results and score explanation.
- Responsive slide-over mobile navigation, dark mode and local service-worker asset caching.

## Data and privacy

All learner information stays in this browser. Profile, XP, streak, progress, module scores, vocabulary mastery, mock exam results, settings and daily checklist progress are saved in `localStorage`. Nothing is sent to a server. Use **Maʼlumotlarni tozalash** in the profile menu to remove the app's saved data from this browser.
