@AGENTS.md

# Shortify: project context and rules

Android-only, offline key → value snippet app, built with Expo + TypeScript to practise for React Native developer interviews (owner: 2 years of experience, moving from .NET).

Follow AGENTS.md. If it conflicts with anything in this file, this file wins.

Items marked ⚠️ are not confirmed yet. Do not treat them as facts; ask the owner.

## How we work
- I (the owner) make all architecture decisions: database schema, folder structure, state management, libraries, how Kotlin shares data with the RN app. Ask me first, let me propose, then review. Point out problems and trade-offs, but don't decide for me.
- One phase at a time. Don't build ahead. Designing ahead is allowed; building is not.
- Explain every new file and why it exists, including Kotlin files and AndroidManifest changes. The goal is understanding, not just working code.
- I write the core logic of each topic first. Then review and fix it.
- No new library unless I agree there's a reason.
- Give one command at a time. Ask before deciding where or how to create a file. Never assume; ask.
- Keep answers short and simple.
- After each feature, suggest a commit message: `type(gui): summary` (types: feat, fix, chore, refactor, docs, test).
- Keep this CLAUDE.md updated with every decision, and hand it over at the end of each phase.
- Time limits: 30–40 min of app work per checklist topic. Tell me if a feature passes 1 hour so we can cut or skip it. Kotlin features (keyboard, widget, tile): one session each; stop at 1 hour.
- Point out which checklist section (§) and which React hook each subtask practises.

## Environment
- Development happens in a GitHub Codespace (Linux, Node 24.21.0, npm 11.19.0).
- Repo: `HinaJadav/Shortify`, branch `master`. The app lives in the `GUI/` subfolder; run all commands from `GUI/`.
- The phone (Android 15+) runs the app through Expo Go during Phases 0–3.
- Start the dev server with `npx expo start --tunnel ngrok` (no Expo account needed). ⚠️ Not confirmed working on SDK 58 yet.
- React Native DevTools can't open in a Codespace (no screen; "libatk" error). Ignore that error and debug with `console.log` (output appears in the terminal).
- Use `npx expo install <pkg>` to add packages (picks SDK-compatible versions).
- Don't run `npm audit fix --force`; it can break Expo's pinned versions.

## Project facts
- App name: Shortify · slug: `shortify` · npm name: `shortify`
- Android package: `com.nahi.shortify` ⚠️ (the change from com.nahi.contentstorer was requested; owner hasn't confirmed the saved app.json)
- Expo SDK: 58 ⚠️ (upgrade from 57 was run; version not confirmed)
- Template: `blank-typescript`. Entry point: `index.ts` → `App.tsx`.
- Prettier: single quotes, semicolons (`.prettierrc`).
- ESLint: flat config `eslint.config.js` = `eslint-config-expo/flat` + `eslint-config-prettier/flat` (last), ignores `dist/*`.

## Scripts (run before saying a task is done)
- `npm run lint`: ESLint (via `expo lint`)
- `npm run typecheck`: `tsc --noEmit`
- `npm run format:check`: Prettier check (`npm run format` fixes)

## Folder structure (grouped by type)
```
GUI/src/
  types/       data shapes (entry.ts)
  screens/     full screens (HomeScreen)
  components/  small reusable UI (EntryRow, EmptyState, SearchBar)
  hooks/       logic (useEntries)
  theme/       light and dark colors
```
Planned later: `src/db/` in Phase 3. Kotlin code goes in `android/` (decision D2 pending).

## Data model
`src/types/entry.ts`:
```ts
export interface Entry {
  id: number;          // stays the same when the key is renamed
  key: string;         // must be unique
  value: string;       // can be multi-line
  isPinned: boolean;
  useCount: number;    // +1 on copy (Phase 4) or keyboard insert (Phase 5); used for "most used" order
  createdAt: string;   // ISO string, always new Date().toISOString()
  updatedAt: string;   // ISO string
}
```
Smart order: pinned first, then most used (`isPinned DESC, useCount DESC`).

## Decisions log
| # | Decision | Choice | Why |
|---|---|---|---|
| 0.1 | Dev environment | GitHub Codespace | Owner's choice |
| 0.2 | Expo or RN CLI | Expo (switch to CLI only if needed) | Owner's choice |
| 0.3 | Runtime | Expo Go for Phases 0–3, development build from Phase 4 | Fast start; native code needs a dev build |
| 0.4 | Template | `blank-typescript` | Minimal; doesn't pre-decide navigation or libraries |
| 0.5 | Project location | `Shortify/GUI` (not the separate content-storer repo) | Owner's choice |
| 0.6 | Lint/format | ESLint + Prettier as separate tools (+ eslint-config-prettier) | Clear split; good to explain in interviews |
| 0.7 | Sentry | Skipped | App is offline; Sentry needs internet |
| 0.8 | AGENTS.md | Kept and followed; this file overrides it on conflicts | Owner's choice |
| 0.9 | Expo SDK | Upgraded 57 → 58 | Expo Go on the phone only supports SDK 58 |
| 1.0 | Folder structure | Grouped by type (see above) | Simple start; can change later |
| 1.1 | Entry id | `id: number` | Key can be renamed; id stays stable |
| 1.2 | Entry type style | `interface`, exported | Owner's choice |
| 1.3 | Date fields | ISO `string` | Readable; matches JSON export (Phase 6) |
| 1.4 | Add in Phase 1 | Inline form on Home | Proper Add screen comes in Phase 2 |

## Open architecture decisions
Decide the expensive-to-change ones early; the rest when their phase starts.
- Phase 1: A1 where list state lives (screen or `useEntries` hook) · A2 theme approach (Context or simple hook) · A3 safe-area library (yes/no)
- Phase 2: B1 navigation library (don't assume Expo Router) · B2 screens and params · B3 form validation (manual or React Hook Form + Zod) · B4 how screens share entries
- Phase 3: C1 DB schema · C2 SQLite library · C3 DB file location · C4 migrations · C5 data layer API · C6 state management
- Phase 4: D1 dev build method (EAS or local) · D2 generated `android/` (config plugins) or committed `android/` · D3 toast · D4 deep link scheme · D5 how shared text reaches JS
- Phase 5: E1 how Kotlin reads the same DB safely · E2 keyboard UI (Views or Compose) · E3 how the app notices keyboard changes
- Phase 6: F1 widget tech · F2 JSON export format · F3 import conflicts (skip/overwrite/ask)
- Phase 7: G1 animation/gesture libraries · G2 FlatList or FlashList
- Phase 8: H1 test stack · H2 release signing
- Waiting on owner: decide all now, or only the expensive ones (C1, C3, E1, D2, B1) now?

## Phases and progress
Checklist = owner's Notion "React Native Developer — Complete Topic Checklist" (§1–§19).

- **Phase 0, Setup (§3, §15)**: ✅ done. Expo + TS, ESLint/Prettier, CLAUDE.md, scripts, running in Expo Go. Moved later: development build (Phase 4), Logcat (Phase 4), error boundaries (Phase 8).
- **Phase 1, Local app, no storage (§2, §3, §5, §6)**: ⏳ not started. Subtasks:
  1.1 Home screen with hardcoded entries in a FlatList (§3, §6)
  1.2 `EntryRow` component with StyleSheet (§2 props, §5)
  1.3 Entries in `useState` + Delete (§2, immutable updates)
  1.4 Inline Add form: key + value (§2, §11 controlled TextInput)
  1.5 Search filter (§2 derived state, `useMemo`)
  1.6 Empty state (§6 `ListEmptyComponent`)
  1.7 Pin toggle + smart order (§2)
  1.8 Move logic into `useEntries` custom hook (§2)
  1.9 Dark mode + shared theme (§5 `useColorScheme`, §2 `useContext`)
  1.10 Safe areas + KeyboardAvoidingView (§5)
- Phase 2, Navigation and forms (§7, §11): Home → Add/Edit, Settings, typed params, validation (required, unique key), `useRef` focus.
- Phase 3, State and storage (§8, §10): SQLite schema, WAL, data layer, state management, load with `useEffect`, persist after restart.
- Phase 4, App native features (§12, §7, §18): development build, tap to copy + toast, share target and select-text → Save sheet, deep link to Add, Logcat.
- Phase 5, Snippet keyboard (§12, §4): Kotlin IME reading the same SQLite file; search, tap to insert, switch back, update use count.
- Phase 6, Widget, tile, backup (§12, §10): pinned-items widget, Quick Settings tile, JSON export/import.
- Phase 7, Polish (§13, §14): swipe to delete, animations, memoized rows, smooth list with 500+ entries.
- Phase 8, Ship (§15, §16, §17): error boundary, tests, release APK.

## Hooks practice map (§2)
useState ✅ practised · useEffect (practised basics; real use in Phase 3 loading) · useRef (Phase 2 focus) · useContext (1.9 theme) · useReducer (Phase 3, if chosen) · useMemo/useCallback (1.5 search, Phase 7) · custom hooks (1.8 useEntries)

## Out of scope
iOS, web, cloud sync, login, tags/folders, {date} placeholders, biometric lock, typed "/cst" trigger (needs a full custom keyboard), Sentry.
