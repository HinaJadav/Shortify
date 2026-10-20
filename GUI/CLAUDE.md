@AGENTS.md

# Shortify: project rules

Android-only offline snippet app (key → value), built with Expo SDK 57 + TypeScript to practise for React Native interviews.

Follow AGENTS.md. If it conflicts with the rules below, these rules win.

## How we work
- I make all architecture decisions: database schema, folder structure, state management, libraries, how Kotlin shares data with the RN app. Ask me first, let me propose, then review. Point out problems and trade-offs, but don't decide for me.
- One phase at a time. Don't build ahead.
- Explain every new file and why it exists, including Kotlin files and AndroidManifest changes.
- I write the core logic of each topic first. Then review and fix it.
- No new library unless I agree.
- Give one command at a time. Ask before deciding where or how to create a file.
- Keep answers short and simple.
- After each feature, suggest a commit message: `type(gui): summary`.
- Time limits: 30–40 min per checklist topic. Tell me if a feature passes 1 hour. Kotlin features: one session each; stop at 1 hour.

## Decisions so far
- Android only. Expo Go for Phases 0–3, development build from Phase 4.
- Package name: com.nahi.shortify
- ESLint (eslint-config-expo) + Prettier (single quotes, semicolons), as separate tools.
- Navigation is not decided yet (Phase 2). Do not assume Expo Router.

## Out of scope
iOS, web, cloud sync, login, tags/folders, {date} placeholders, biometric lock, typed "/cst" trigger, Sentry.

## Before saying a task is done
Run `npm run lint`, `npx tsc --noEmit` and `npm run format:check`.