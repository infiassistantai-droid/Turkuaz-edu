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

Open the Supabase project's **SQL Editor**, paste the complete [`schema.sql`](./schema.sql), and run it. The script is repeatable and preserves the existing `user_progress` table and leaderboard integration while adding the cloud profile and gamification tables below. If the rest of the schema is already installed, run the focused [`profiles-xp.sql`](./profiles-xp.sql) migration instead. The focused [`20261110145438_league_gamification_tables.sql`](./20261110145438_league_gamification_tables.sql) migration creates only missing progress, streak, achievement, vocabulary, and league configuration tables and adds compatibility columns to the existing profile table; it preserves the existing own-profile RLS. League settings can be read by authenticated learners, while writes require the trusted `app_metadata.role = 'admin'` claim. For Admin dashboard aggregates, run [`admin-dashboard-stats.sql`](./admin-dashboard-stats.sql) after the profile schema (also included in the full schema), then set `app_metadata.role` to `admin` for the configured owner account in Supabase Auth and sign in again so the claim refreshes. The dashboard RPC returns only total profile count and average XP. To enable the Admin Users table and balance editor, run [`admin-user-balances.sql`](./admin-user-balances.sql) after the same profile schema (also included in the full schema). It adds non-negative `gold`/`gems` fields and admin-only list/update RPCs; ordinary profile RLS remains private. Both admin migrations require the trusted role claim described above and never expose a service-role key. To enable the all-time Top Players ranking from `profiles`, run [`top-profiles-leaderboard.sql`](./top-profiles-leaderboard.sql) after the profile schema (also included in the current full schema). It exposes only display name, avatar, user ID, and total XP to authenticated clients; the private `profiles` RLS policy is not weakened. To enable the centralized, task-limited XP award RPC, run [`xp-awards.sql`](./xp-awards.sql) in the SQL Editor (also included in the current full schema and focused profiles-XP script). To enable the in-app Notifications dropdown and Postgres Changes updates, run [`notifications.sql`](./notifications.sql) in the SQL Editor.

| Table | Per-user data |
| --- | --- |
| `profiles` | Auth-linked profile (`id`), compatibility `user_id`, full name, avatar URL, total XP, editable gold/gems balance, rating tier, current streak, calculated level, and stable rank ID (`rank_title`). |
| `user_streaks` | Current streak, last active date, unlocked streak-milestone values, and winter-season study-day progress. |
| `user_achievements` | Earned trophy ID, unlock date, and reward/historical metadata. |
| `user_vocabulary` | Saved Turkish word, Uzbek translation, and optional lesson ID. |
| `user_progress` | Existing app counters and learning analytics, including XP, streak, weekly XP, lesson completions, per-test module scores, and quest state. |
| `league_tiers` | Public-to-authenticated league thresholds and badges; only trusted admins can change tier settings. |
| `xp_awards` | Restricted server-side XP award ledger enforcing no more than two awards per user/task type per database day. |
| `notifications` | Per-user notification title/message/type, read state, and creation time; client reads and updates are restricted by RLS. |

Each table is keyed to `auth.users`; RLS is enabled and policies restrict each signed-in learner to their own rows. The existing leaderboard RPC continues to expose only its public ranking fields.

## 3. Authentication providers

Enable email/password under **Authentication → Providers**. For Google sign-in, enable Google and add the OAuth client ID and secret in the Supabase dashboard. Add the application origins to Supabase's allowed redirect URLs. In Google Cloud, authorize Supabase's callback URL (`https://<project-ref>.supabase.co/auth/v1/callback`).

## 4. What synchronizes

After sign-in, the app loads the legacy progress row and normalized profile, streak, achievement, and vocabulary rows before showing the learner interface. A localized loading skeleton is shown during that initial fetch. Changes to XP, streaks and unlocked streak badges, profile details, per-test listening scores, trophy unlocks, or saved vocabulary are upserted to Supabase. Vocabulary already on the device is merged into the signed-in learner's cloud list and is available to the vocabulary study view.

Cloud writes are debounced briefly during normal activity. If a request fails, the app remains usable and logs a non-blocking sync warning; it does not crash the UI. Apply the schema before expecting all new tables to sync.

Without configured credentials, the app remains in local-only mode. No XP, streak, completion, test result, or trophy is seeded by the Supabase integration.

## 5. Notes

- XP changes use the authenticated `award_profile_xp` RPC, which updates `profiles.total_xp` atomically and allows at most two awards per user/task type per database day. The legacy arbitrary-amount `add_profile_xp` RPC is revoked for browser roles. The profile's `rating_tier` is recalculated atomically: Bronze below 1,000 XP, Silver from 1,000 XP, and Gold from 2,500 XP. The app's learner level remains derived from XP (`500 XP` per level); `rank_title` stores the stable rank ID, not a localized label.
- Trophy achievements are append-only unlock records. Historical unlocks remain marked as historical and are not granted retroactive XP.
- XP is awarded for completed learning actions, not personal-plan checkboxes. Daily vocabulary quest progress is credited only after a qualified vocabulary deck is completed; its separate claim remains tied to actual activity.
- In-app notification rows are inserted only by trusted server-side code. The browser can select its own notifications, mark only `is_read`, and receives live inserts/updates while the app is connected. This is an in-app feed, not background push delivery while the browser is closed.
