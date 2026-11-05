# Supabase setup and migration guide

Turkuaz Edu supports local-only operation when Supabase is not configured, and authenticated cloud sync when the public URL and publishable/anon key are configured. The browser client uses only the publishable/anon key; **never put a `service_role` key in Vite variables or client code**.

## 1. Configure environment variables

Copy `.env.example` to `.env.local`, then set:

```dotenv
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-or-legacy-anon-key>
```

The client accepts a project URL or a REST URL ending in `/rest/v1/` and normalizes it to the project root. Restart Vite after editing `.env.local`. If either value is missing or invalid, authentication and cloud sync gracefully remain disabled and the app uses its local state.

The publishable/anon key is intended for browser use only when Row Level Security is enabled. Do not add service-role credentials here.

## 2. Apply the database schema

Open the Supabase project's **SQL Editor**, paste the complete [`schema.sql`](./schema.sql), and run it. The script is repeatable and preserves the existing `user_progress` table and leaderboard integration while adding the cloud profile and gamification tables below.

| Table | Per-user data |
| --- | --- |
| `profiles` | Full name, avatar URL, current streak, total XP, calculated level and stable rank ID (`rank_title`). |
| `user_streaks` | Current streak, last active date, unlocked streak-milestone values, and winter-season study-day progress. |
| `user_achievements` | Earned trophy ID, unlock date, and reward/historical metadata. |
| `user_vocabulary` | Saved Turkish word, Uzbek translation, and optional lesson ID. |
| `user_progress` | Existing app counters and learning analytics, including XP, streak, weekly XP, lesson completions, per-test module scores, and quest state. |

Each table is keyed to `auth.users`; RLS is enabled and policies restrict each signed-in learner to their own rows. The existing leaderboard RPC continues to expose only its public ranking fields.

## 3. Authentication providers

Enable email/password under **Authentication → Providers**. For Google sign-in, enable Google and add the OAuth client ID and secret in the Supabase dashboard. Add the application origins to Supabase's allowed redirect URLs. In Google Cloud, authorize Supabase's callback URL (`https://<project-ref>.supabase.co/auth/v1/callback`).

## 4. What synchronizes

After sign-in, the app loads the legacy progress row and normalized profile, streak, achievement, and vocabulary rows before showing the learner interface. A localized loading skeleton is shown during that initial fetch. Changes to XP, streaks and unlocked streak badges, profile details, per-test listening scores, trophy unlocks, or saved vocabulary are upserted to Supabase. Vocabulary already on the device is merged into the signed-in learner's cloud list and is available to the vocabulary study view.

Cloud writes are debounced briefly during normal activity. If a request fails, the app remains usable and logs a non-blocking sync warning; it does not crash the UI. Apply the schema before expecting all new tables to sync.

Without configured credentials, the app remains in local-only mode. No XP, streak, completion, test result, or trophy is seeded by the Supabase integration.

## 5. Notes

- The app's XP and rank level are derived from the learner's actual XP (`500 XP` per level); `rank_title` stores the stable rank ID, not a localized label.
- Trophy achievements are append-only unlock records. Historical unlocks remain marked as historical and are not granted retroactive XP.
- Daily Quests remain local progress indicators; claiming them does not create cloud XP rewards.
- Browser notification reminders are local and do not provide background push delivery while the browser is closed.
