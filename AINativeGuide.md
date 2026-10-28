# AI-Native Dev Setup — Final Plan

Oct 19, 2026 · @Navneet kumar

Windows dev machine · Claude Code · first project: URL shortener (Node.js + TypeScript + Express + SQLite). Sources: AI-Native Dev Playbook (corrected) + Juraj Masar's "No-bullshit guide to Agentic Engineering".

## 0. Core idea

Agentic engineering = **CLAUDE.md design** (rules the agent always follows) + **agentic loop design** (objective conditions so the agent can check its own work). Your job: spec, set rules, review. The agent's job: write code and tests, verify against your criteria.

Run everything on your dev laptop and personal repos — not the offline company server.

## 1. Prerequisites (PowerShell, one-time)

```powershell
winget install Git.Git
winget install OpenJS.NodeJS.LTS
winget install GitHub.cli
winget install Microsoft.WindowsTerminal
gh auth login
```

- Git for Windows gives Claude Code a Bash tool (otherwise it falls back to PowerShell).
- A paid Claude plan is required; the free plan doesn't include Claude Code.

## 2. Install Claude Code

```powershell
irm https://claude.ai/install.ps1 | iex
claude --version
cd D:\code\url-shortener
claude
```

First run opens the browser to log in. (The playbook's `npm install -g` still works, but the native installer is the recommended route.)

## 3. Repo structure

```
url-shortener/
  CLAUDE.md              # rules + routing table (committed)
  CLAUDE.local.md        # personal tokens (gitignored)
  .claude/settings.json  # permissions (committed)
  .github/workflows/ci.yml
  docs/
    api_documentation.md
    internal_documentation.md
    design/              # one design doc per feature
  src/  routes/ services/ db/
  tests/  unit/ integration/
```

Add to `.gitignore`: `CLAUDE.local.md`, `.env`, `*.sqlite`.

## 4. CLAUDE.md

Run `/init` once for a draft, then replace it with this shape: one-line description, rules, quality criteria, routing table. No product knowledge here — that goes in `docs/`, because CLAUDE.md loads into every session.

```markdown
This is a Node.js + TypeScript + Express + SQLite REST API for a URL shortener.

## Rules
- Always use TDD: write a failing test first, then the code. Run only relevant tests while iterating; run the full suite before finishing.
- Write a 1-sentence description above every class and exported function.
- If code in two files depends on each other non-obviously, comment in BOTH files referencing the other.
- After implementing an endpoint, start the server (npm run dev) and verify it with real HTTP requests before saying it is done.
- Never write local memories. Record learnings in docs/ (see routing table) and commit them.
- Pin exact dependency versions; never add a version released less than a week ago.
- Do not modify existing migrations; add new ones.
- Do not change the short-code scheme without asking.
- Never push to git; I push.

## Quality criteria
- No request may ever return 500. Invalid input -> 4xx with a clear JSON error.
- Every endpoint responds in < 50 ms locally.
- npm test, npx tsc --noEmit and npx eslint src/ must all pass.

## Routing table
| When looking for | Look into |
|---|---|
| API contract | docs/api_documentation.md |
| Architecture, decisions, gotchas | docs/internal_documentation.md |
| Feature designs | docs/design/*.md |
| DB schema & queries | src/db/ |
| Test examples to imitate | tests/integration/shorten.test.ts |
```

Maintenance rules:

- Agent made a mistake → don't just correct it in chat. Say: *"Remember in CLAUDE.md: always/never X when Y."*
- Claude says "Exploring the codebase to understand X…" → add a routing-table row.
- Point the "examples to imitate" row at your best test file once you have one.
- Keep it short and explicit; good/bad examples beat long explanations.

## 5. Permissions — .claude/settings.json

```json
{
  "permissions": {
    "allow": ["Bash(npm test:*)", "Bash(npm run dev)", "Bash(npx tsc:*)", "Bash(npx eslint:*)", "Bash(curl:*)", "Bash(git status)", "Bash(git diff:*)"],
    "deny": ["Bash(git push:*)", "Read(./.env)"]
  }
}
```

## 6. CI — .github/workflows/ci.yml

```yaml
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint src/
      - run: npm test
```

After CI is green, run `/install-github-app` in Claude Code to add AI review on PRs.

## 7. MCP & tools (minimal)

- Skip the filesystem MCP — Claude Code already reads and edits files.
- GitHub: use the `gh` CLI first. Add the official GitHub MCP only if needed:

```powershell
claude mcp add --scope user --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer YOUR_GITHUB_PAT"
claude mcp list
```

- Config lives in `~/.claude.json` (user/local scope) or `.mcp.json` (project scope) — not `~/.claude/claude.json` as the playbook says.
- Every MCP costs context. Prefer CLIs or plain REST APIs when they work.
- SQLite: let Claude query the file via a script; no DB MCP needed yet.

## 8. The feature loop

1. **Design doc** — `Write a design doc for <feature> into docs/design/<feature>.md. Interview me about key choices first.` Read it word by word; give 2–3 rounds of feedback by prompt, not by editing the file.
2. **Plan** — Plan mode (Shift+Tab): `Read docs/design/<feature>.md and propose an implementation plan.`
3. **Implement** — `Implement docs/design/<feature>.md.` TDD + quality criteria drive self-checking.
4. **Test plan** — `List every behavior we must verify. Write one naive smoke test first, then group the rest into as few integration tests as possible.`
5. **Verify** — smoke test first, then the rest, until green.
6. **Self-review** — `Review the diff for edge cases and security issues.`
7. **Your review** — read the diff, especially the tests.
8. **Ship** — commit, push, open PR, CI gates the merge.
9. **Learn** — turn every agent mistake into a CLAUDE.md rule.

## 9. Guardrails (where not to follow the guides blindly)

- **Read the code.** "Skim signatures only" is advice for seniors with strong CI. You're learning testing — a wrong test still passes.
- **Write some tests yourself** and ask Claude to critique them. "0 tests written manually" defeats your learning goal.
- **Don't over-engineer loops.** Multi-agent setups can burn tokens and time on small tasks. Add complexity only when a simple prompt stops working.
- **Ignore the time claims** (10×, 8-hour apps). Measure your own.

## 10. Rollout order

| When | Do |
| --- | --- |
| Today | Steps 1–4: install, repo structure, CLAUDE.md |
| First feature | Step 8 loop end to end (e.g. link expiry) |
| After first feature works | Steps 5–6: permissions + CI |
| Only when needed | Step 7: MCP servers |
| Ongoing | Grow CLAUDE.md from real mistakes; document the process in the README for your portfolio |
