@AGENTS.md

This is Shortify: an Android-only, offline key → value snippet app built with Expo SDK 58 + TypeScript + Expo Router, to practise for React Native interviews. All commands run from `GUI/`.

Follow AGENTS.md. If it conflicts with this file, this file wins. Items marked ⚠️ in any doc are unconfirmed: ask me, don't treat them as facts.

## Rules
- I make all architecture decisions (schema, folders, state management, libraries, Kotlin ↔ RN data sharing). Ask first, let me propose, then review: point out problems and trade-offs, never decide for me.
- One phase at a time. Designing ahead is fine; building ahead is not.
- I write the core logic of each topic first; then you review and fix it.
- Explain every new file and why it exists, including Kotlin files and AndroidManifest changes.
- No new library unless I agree. Add packages with `npx expo install <pkg>`.
- One command at a time. Ask before deciding where or how to create a file. Never assume.
- Keep answers short and simple. Name the checklist section (§) and hook each subtask practises.
- Time limits: 30–40 min per checklist topic; tell me past 1 hour. Kotlin features: one session each; stop at 1 hour.
- After each feature, suggest a commit message: `type(gui): summary` (feat, fix, chore, refactor, docs, test).
- Record every decision in docs/internal_documentation.md and progress in docs/roadmap.md as it happens. Hand over CLAUDE.md, docs/ and knowledge.md at the end of each phase.
- When I say **"mark"**, add the explanation you just gave (and any image I share) to knowledge.md, keeping its wording.
- Never write local memories; record learnings in the files above.
- Don't run `npm audit fix --force`.

## Quality criteria
- `npm run lint`, `npm run typecheck` and `npm run format:check` all pass before a task is called done.
- The app opens in Expo Go on my phone without an error screen.

## Routing table
| When looking for | Look into |
|---|---|
| Environment, project facts, architecture, data model, decisions log, gotchas | docs/internal_documentation.md |
| Phases, subtasks, progress, open decisions, out of scope | docs/roadmap.md |
| Feature designs | docs/design/*.md |
| Learning notes | knowledge.md |
| Entry type | src/types/entry.ts |
| Routes / screen code | src/app/ (thin routes) → src/screens/ |
| Learning checklist (§1–§19) | Notion: "React Native Developer — Complete Topic Checklist" |
