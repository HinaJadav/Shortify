# Roadmap

Checklist = owner's Notion "React Native Developer — Complete Topic Checklist" (§1–§19).
Each subtask is about 30–40 minutes. Architecture decisions are made before or at the start of their phase.

## Phases and progress
- **Phase 0, Setup (§3, §15)**: ✅ done. Expo + TS, ESLint/Prettier, CLAUDE.md, scripts, running in Expo Go. Moved later: development build (Phase 4), Logcat (Phase 4), error boundaries (Phase 8).
- **Phase 1, Local app, no storage (§2, §3, §5, §6)**: ⏳ in progress (Expo Router setup ⚠️ not confirmed done). Subtasks:
  - 1.0 Install Expo Router and restructure (`src/app/_layout.tsx`, thin `index.tsx` → `src/screens/HomeScreen.tsx`)
  - 1.1 Home screen with hardcoded entries in a FlatList (§3, §6)
  - 1.2 `EntryRow` component with StyleSheet (§2 props, §5)
  - 1.3 Create the `useEntries` hook (entries in `useState`) + Delete (§2 custom hooks, immutable updates)
  - 1.4 Inline Add form: key + value (§2, §11 controlled TextInput)
  - 1.5 Search filter (§2 derived state, `useMemo`)
  - 1.6 Empty state (§6 `ListEmptyComponent`)
  - 1.7 Pin toggle + smart order (§2)
  - 1.8 Dark mode + shared theme (§5 `useColorScheme`, §2 `useContext`)
  - 1.9 Safe areas + KeyboardAvoidingView (§5)
- **Phase 2, Navigation and forms (§7, §11):** Add/Edit screen, Settings, typed params, validation (required, unique key), `useRef` focus.
- **Phase 3, State and storage (§8, §10):** SQLite schema, WAL, data layer, state management, load with `useEffect`, persist after restart.
- **Phase 4, App native features (§12, §7, §18):** development build, tap to copy + toast, share target and select-text → Save sheet, deep link to Add, Logcat.
- **Phase 5, Snippet keyboard (§12, §4):** Kotlin IME reading the same SQLite file; search, tap to insert, switch back, update use count.
- **Phase 6, Widget, tile, backup (§12, §10):** pinned-items widget, Quick Settings tile, JSON export/import.
- **Phase 7, Polish (§13, §14):** swipe to delete, animations, memoized rows, smooth list with 500+ entries.
- **Phase 8, Ship (§15, §16, §17):** error boundary, tests, release APK.

## Open architecture decisions
- Phase 1: all decided (A1–A3, plus B1/B1a brought forward).
- Phase 2: B2 screens and params · B3 form validation (manual or React Hook Form + Zod) · B4 how screens share entries
- Phase 3: C1 DB schema · C2 SQLite library · C3 DB file location · C4 migrations · C5 data layer API · C6 state management
- Phase 4: D1 dev build method (EAS or local) · D2 generated `android/` (config plugins) or committed `android/` · D3 toast · D4 deep link scheme · D5 how shared text reaches JS
- Phase 5: E1 how Kotlin reads the same DB safely · E2 keyboard UI (Views or Compose) · E3 how the app notices keyboard changes
- Phase 6: F1 widget tech · F2 JSON export format · F3 import conflicts (skip/overwrite/ask)
- Phase 7: G1 animation/gesture libraries · G2 FlatList or FlashList
- Phase 8: H1 test stack · H2 release signing

## Hooks practice map (§2)
useState ✅ practised · useEffect (basics practised; real use in Phase 3 loading) · useRef (Phase 2 focus) · useContext (1.8 theme) · useReducer (Phase 3, if chosen) · useMemo/useCallback (1.5 search, Phase 7) · custom hooks (1.3 useEntries)

## Out of scope
iOS, web, cloud sync, login, tags/folders, {date} placeholders, biometric lock, typed "/cst" trigger (needs a full custom keyboard), Sentry.
