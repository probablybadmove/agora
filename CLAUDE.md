# Agora — project guide

A universal (web + iOS + Android) **Claude Code plugin marketplace**, built with Expo Router +
React Native Web, hosted at gagansingh.tech (Vercel). It is BOTH a browsable website and a real,
installable Claude Code marketplace.

> Expo SDK 56. Read the versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing
> Expo/RN code. (see @AGENTS.md)

## The golden rule: one source of truth

`src/data/catalog.json` is the single source of truth for all plugins + categories. After editing
it, run:

```bash
npm run build:catalog
```

This regenerates, and they must never be hand-edited:
- `.claude-plugin/marketplace.json` — relative sources (git-based `/plugin marketplace add probablybadmove/agora`)
- `public/marketplace.json` — `git-subdir` sources (hosted-URL add via gagansingh.tech/marketplace.json)
- `supabase/seed.sql` — DB seed

`src/data/seed.ts` is a typed view over `catalog.json`; the website renders from it instantly.

## Layout

- `src/app/` — Expo Router screens. `+html.tsx` is the web `<head>` (static title/OG). Dynamic
  routes (`plugin/[slug]`, `category/[slug]`) use `generateStaticParams` so every plugin/category
  pre-renders to its own HTML.
- `src/components/` — themed UI. Styling = `StyleSheet` + tokens in `src/constants/theme.ts`
  (no NativeWind). Use `<ThemedText>` / `<ThemedView>` / `useTheme()`. Web-only style props
  (`position:'sticky'`, `transitionProperty`, `outlineStyle`) are cast `as object`.
- `plugins/` — the actual Claude Code plugins (each its own `.claude-plugin/plugin.json` + skill/agent).
- `src/lib/supabase.ts` — optional live catalog; site falls back to the bundle when env is unset.

## Conventions

- Per-route SEO via `<Seo>` (client-side title updates; static default lives in `+html.tsx`).
- Validate the marketplace after changing plugins: `claude plugin validate .`
- Build/preview the web app: `npm run build:web` then serve `dist/` (launch config: `.claude/launch.json`).
- Only the Supabase **publishable/anon** key may be `EXPO_PUBLIC_*`. Catalog tables are public
  read-only via RLS; never expose the service-role key.

## Deploy

- Web → Vercel (`vercel.json` is ready: build, `dist`, clean URLs, dynamic rewrites). Add the
  `gagansingh.tech` domain in Vercel + point DNS.
- Live catalog → Supabase: apply `supabase/migrations/0001_init.sql` + `supabase/seed.sql`, then set
  the two `EXPO_PUBLIC_*` vars.
- Native → EAS (`eas.json`). If you fork, update `marketplace.repo`/`repoUrl` in `catalog.json`.
