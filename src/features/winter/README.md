# Winter Update feature

The seasonal feature is isolated in `src/features/winter/` and stays off unless enabled in the build environment.

```dotenv
VITE_WINTER_UPDATE_ENABLED=true
```

This exposes a persistent Winter Mode toggle in the sidebar. To additionally default the visual mode on during the local December–February winter window, set:

```dotenv
VITE_WINTER_UPDATE_AUTO=true
```

When both values are false or absent, snow, winter accessories, and the seasonal streak panel stay hidden. The Winter Champion trophy remains as a locked seasonal placeholder in the Trophy Cabinet.

The campaign award is separate from the visual toggle: when the feature flag is enabled, actual lesson/test activity on 14 distinct dates during one winter season (December 1 through the end of February) unlocks the Qishki Chempion streak badge and trophy. Repeated activity on the same date counts once. Its season/date progress is stored locally and synced with `user_streaks.winter_study_days`; the resulting trophy uses the regular `user_achievements` sync and one-time trophy reward flow. No XP or study days are seeded.

Effects are CSS-only, pointer-transparent, and respect reduced-motion preferences. The scarf/hat overlay does not replace the Van Cat sprite. Winter controls and mascot text are localized in Uzbek, English, and Turkish.
