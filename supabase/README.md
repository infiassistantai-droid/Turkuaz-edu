# Supabase setup

1. Create a Supabase project and enable email/password auth.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and the project's publishable/anon key. Never put a `service_role` secret in client-side variables.
3. Run `schema.sql` in the Supabase SQL editor. It creates the learner progress table and row-level security policies.
4. Restart Vite. With both env values present, Supabase Auth is used and XP, streak, completed lessons, target level, weekly XP, daily XP analytics, and daily quest progress sync to `user_progress`. The schema also records when daily analytics tracking began, so older activity is not fabricated. Without the values, the app explicitly stays in device-local fallback mode.

The leaderboard only shows accounts that have actually earned weekly XP; no sample learner data is inserted. Weekly XP is accumulated as a learner earns XP and rolls over on the next Monday (local calendar).

Daily notifications request browser permission and show at most one reminder when the app is opened each day. Browser notifications cannot reliably run while the browser is closed without a push-delivery server; this client-only reminder does not claim background push delivery.
