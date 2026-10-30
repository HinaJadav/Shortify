# Internal documentation

## Environment

- Development happens in a GitHub Codespace (Linux, Node 24.21.0, npm 11.19.0).
- Repo: `HinaJadav/Shortify`, branch `master`. The app lives in the `GUI/` subfolder; run all commands from `GUI/`.
- The phone (Android 15+) runs the app through Expo Go during Phases 0–3.
- Start the dev server with `npx expo start --tunnel ngrok` (no Expo account needed). Add `--clear` after changing the entry point or config.
- Use `npx expo install <pkg>` to add packages (picks SDK-compatible versions).

## Project facts

- App name: Shortify · slug: `shortify` · npm name: `shortify`
- Android package: `com.nahi.shortify`
- Expo SDK: 58 (`"expo": "^58.0.0"` in package.json)
- Template: `blank-typescript`
- Entry point: `"main": "expo-router/entry"` → `src/app/_layout.tsx`
- Prettier: single quotes, semicolons (`.prettierrc`)
- ESLint: flat config `eslint.config.js` = `eslint-config-expo/flat` + `eslint-config-prettier/flat` (last), ignores `dist/*`

### Scripts

- `npm run lint`: ESLint (via `expo lint`)
- `npm run typecheck`: `tsc --noEmit`
- `npm run format:check`: Prettier check (`npm run format` fixes)

## Folder structure (grouped by type)

```
GUI/
  CLAUDE.md  AGENTS.md  knowledge.md
  docs/        internal_documentation.md, roadmap.md, design/
  src/
    app/         Expo Router routes only (thin, one-line files) + _layout.tsx
    screens/     real screen code (HomeScreen)
    components/  small reusable UI (EntryRow, EmptyState, SearchBar)
    hooks/       logic (useEntries)
    theme/       light and dark colors
    types/       data shapes (entry.ts)
```

Planned later: `src/db/` in Phase 3. Kotlin code goes in `android/` (decision D2 pending).

## Architecture

- **Routing:** `src/app/_layout.tsx` renders `<Stack />` and wraps every screen (ThemeProvider and SafeAreaProvider get added here). Route files only re-export a screen: `export { default } from '../screens/HomeScreen';`. Route params arrive as strings; convert `id` to a number.
- **Entries:** screens never hold the entries list themselves; they call the `useEntries` hook (state + add/delete/search/pin). In Phase 3 the hook's internals switch to SQLite without changing screens.
- **Theme:** a `ThemeProvider` Context, read with `useContext`. Modes: System (default; follows the phone live via `useColorScheme`), Light, Dark. The switch lives on the Settings screen (Phase 2).
- **Safe areas:** `react-native-safe-area-context`.

## Data model

`src/types/entry.ts`:

```ts
export interface Entry {
  id: number; // stays the same when the key is renamed
  key: string; // must be unique, case-insensitive; trimmed
  value: string; // can be multi-line
  isPinned: boolean;
  useCount: number; // +1 on copy (Phase 4) or keyboard insert (Phase 5); used for "most used" order
  createdAt: number; // timestamp, always Date.now()
  updatedAt: number; // timestamp
}
```

Smart order: pinned first, then most used (`isPinned DESC, useCount DESC`).

## Decisions log

| #    | Decision                     | Choice                                                                                                                                               | Why                                                                                                                                          |
| ---- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1  | Dev environment              | GitHub Codespace                                                                                                                                     | Owner's choice                                                                                                                               |
| 0.2  | Expo or RN CLI               | Expo (switch to CLI only if needed)                                                                                                                  | Owner's choice                                                                                                                               |
| 0.3  | Runtime                      | Expo Go for Phases 0–3, development build from Phase 4                                                                                               | Fast start; native code needs a dev build                                                                                                    |
| 0.4  | Template                     | `blank-typescript`                                                                                                                                   | Minimal; doesn't pre-decide navigation or libraries                                                                                          |
| 0.5  | Project location             | `Shortify/GUI` (not the separate content-storer repo)                                                                                                | Owner's choice                                                                                                                               |
| 0.6  | Lint/format                  | ESLint + Prettier as separate tools (+ eslint-config-prettier)                                                                                       | Clear split; good to explain in interviews                                                                                                   |
| 0.7  | Sentry                       | Skipped                                                                                                                                              | App is offline; Sentry needs internet                                                                                                        |
| 0.8  | AGENTS.md                    | Kept and followed; CLAUDE.md overrides it on conflicts                                                                                               | Owner's choice                                                                                                                               |
| 0.9  | Expo SDK                     | Upgraded 57 → 58                                                                                                                                     | Expo Go on the phone only supports SDK 58                                                                                                    |
| 0.10 | CLAUDE.md format             | Rules + quality criteria + routing table only; project knowledge in docs/                                                                            | Follows the AI-Native Dev Setup plan: CLAUDE.md loads into every session, so keep it short                                                   |
| 1.0  | Folder structure             | Grouped by type (see above)                                                                                                                          | Simple start; can change later                                                                                                               |
| 1.1  | Entry id                     | `id: number`                                                                                                                                         | Key can be renamed; id stays stable                                                                                                          |
| 1.2  | Entry type style             | `interface`, exported                                                                                                                                | Owner's choice                                                                                                                               |
| 1.3  | Date fields                  | `number` timestamps (`Date.now()`), changed from ISO string                                                                                          | Owner's choice; SQLite stores INTEGER directly; Kotlin reads it as Long; convert to ISO only for JSON export                                 |
| 1.4  | Add in Phase 1               | Inline form on Home                                                                                                                                  | Proper Add screen comes in Phase 2                                                                                                           |
| 1.5  | Entries list component       | `FlatList` (not ScrollView + map)                                                                                                                    | Virtualized: only renders visible rows, so 500+ entries stay fast; built-in empty state, header, separators                                  |
| 1.6  | Styling approach             | `StyleSheet` (built in); no NativeWind                                                                                                               | No extra library; it's what interviews test; dark mode handled by own ThemeProvider (A2)                                                     |
| 1.7  | Key uniqueness               | Case-insensitive (`Email` = `email`); key is trimmed before saving and comparing                                                                     | Avoids near-duplicate keys; Phase 3 schema (C1) must enforce the same rule (e.g. `UNIQUE COLLATE NOCASE`)                                    |
| A1   | Where the entries list lives | `useEntries` custom hook; screens only call it                                                                                                       | Separates UI from logic; SQLite can replace the hook's internals in Phase 3; can be backed by Context later (B4/C6) without changing callers |
| A2   | Theme approach               | `ThemeProvider` Context; System (default, live) / Light / Dark; switch on Settings (Phase 2)                                                         | Flexibility for the user; practises useContext (§2)                                                                                          |
| A3   | Safe areas                   | `react-native-safe-area-context` (arrives with Expo Router, which requires it)                                                                       | Measures each phone's bars exactly (Android 15+ draws edge to edge); on §5 checklist; included in Expo Go                                    |
| B1   | Navigation library           | Expo Router, installed at the start of Phase 1 (owner's choice)                                                                                      | File-based routes; deep links built in; built on React Navigation                                                                            |
| B1a  | Route files vs screens       | Thin routes in `src/app/`; screen code in `src/screens/`. `_layout.tsx` replaces App.tsx; `main` = `expo-router/entry`; App.tsx and index.ts removed | Keeps folder structure (1.0); screens stay easy to test                                                                                      |

## Packages beyond the template

| Package                                                                                                                            | Why                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `eslint`, `eslint-config-expo`                                                                                                     | Linting (0.6)                                               |
| `prettier`, `eslint-config-prettier`                                                                                               | Formatting (0.6)                                            |
| `expo-router`                                                                                                                      | Navigation (B1)                                             |
| `expo-linking`, `expo-constants`, `react-native-screens`, `react-native-safe-area-context`, `@expo/metro-runtime`, `@expo/log-box` | Required by Expo Router 58 (non-optional peer dependencies) |

## Gotchas

- **React Native DevTools** can't open in a Codespace (no screen; "libatk-1.0.so.0" error). Ignore it and debug with `console.log` (output appears in the terminal).
- **Expo Go only supports one SDK** per app version. If the phone says "Project is incompatible with this version of Expo Go", the Play Store updated Expo Go: upgrade the project SDK or install the matching Expo Go from expo.dev/go.
- **SDK 58 tunnels** need an Expo login for `--tunnel`; use `--tunnel ngrok` instead.
- **`npx expo lint`** doesn't install ESLint by itself on SDK 57+; install `eslint eslint-config-expo` first.
- **Don't run `npm audit fix --force`**: it can break Expo's pinned versions.
- **npm 11 "install-scripts" warnings** (e.g. `unrs-resolver`): safe to ignore for now.
- **Dark mode** needs app.json `userInterfaceStyle: "automatic"` (currently `light`); change it in subtask 1.8.
- **Theme choice** resets on restart until storage exists (Phase 3).
- **`src/app/_layout.tsx` is required.** Without it there is no Stack and no header, so content goes under the status bar (safe area `edges` assumed a header). It was missed in the first restructure and added in 1.4a.
- **Expo Router may warn about a missing `scheme`** in app.json: harmless until D4 (Phase 4).
