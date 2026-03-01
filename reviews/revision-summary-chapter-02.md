# Revision Summary: Chapter 2 — The OpenClaw Ecosystem

**Date:** 2026-02-28  
**Revision Orchestrator:** Chapter Revision Subagent  
**Research Source:** DeepWiki (deepwiki.com/openclaw/openclaw, commit 8090cb4c, v2026.2.27) + docs.openclaw.ai

---

## Word Count

| Version | Word Count |
|---------|-----------|
| Original (`chapter-02.md`) | 3,510 |
| Revised (`chapter-02.md`) | 5,792 |
| **Net increase** | **+2,282 words (+65%)** |

---

## Sections Added

### New Content (not in original)

1. **Monorepo structure table** (§2.2 intro) — Maps repo layout (`ui/`, `extensions/*`, `apps/*`) to purposes, with code-level source attribution from DeepWiki. Readers now understand the codebase geography before reading about components.

2. **WebSocket RPC Protocol detail** (§2.2.1) — Three frame types (`RequestFrame`/`ResponseFrame`/`EventFrame`), seven RPC namespace groups (`agent.*`, `chat.*`, `sessions.*`, `cron.*`, `config.*`, `nodes.*`, `mesh.*`), and port resolution chain. This is the actual protocol; the original chapter said only "WebSocket-based."

3. **Gateway hot reload modes table** (§2.2.1) — Four modes (`off`, `hot`, `restart`, `hybrid`), with `hybrid` as the default and explanation of why it matters operationally.

4. **Gateway responsibilities table** (§2.2.1) — Maps each Gateway responsibility to its implementation entity (e.g., Memory indexing → `MemorySearchManager` with SQLite/LanceDB backend).

5. **Agent model fallback chain** (§2.2.2) — Explains how the primary model + fallback chain works for AI provider failover. Includes the seven supported providers (Anthropic, OpenAI/OpenRouter, Ollama, Google Gemini, MiniMax, AWS Bedrock, custom OpenAI-compatible).

6. **Skill gating metadata table** (§2.2.3) — Four gating fields (`requires.bins`, `requires.env`, `requires.config`, `always: true`) with explanation of load-time filtering behavior.

7. **ClawHub workflow with code** (§2.2.3) — `clawhub install`, `clawhub update --all`, `clawhub publish`, `clawhub sync` commands with context.

8. **Full SKILL.md example** (§2.2.3) — Complete, realistic `weather-check` skill SKILL.md showing frontmatter, gating metadata, workflow, examples, and guardrails sections. The original chapter had zero code examples.

9. **Full 17-channel table** (§2.2.5) — All channels with extension packages and implementation notes. Original chapter listed only Discord, Telegram, CLI, Web UI.

10. **DM security policy with config example** (§2.2.5) — `dmPolicy: "pairing"` / `"open"` with `openclaw.json` snippet.

11. **SSH tunnel remote access example** (§2.3.1) — Concrete command for remote Gateway access.

12. **Operator command reference** (§2.3.1) — `openclaw gateway status`, `openclaw logs --follow`, `openclaw doctor`, `openclaw secrets reload`.

13. **Multi-gateway mesh discussion** (§2.3.3) — `mesh.*` RPC namespace for multi-gateway routing in hybrid deployments.

14. **ClawHub skill metadata fields** (§2.4.3) — Dependencies, gating requirements, compatibility, community ratings.

15. **Corrected installation procedure** (§2.5.2) — `npm install -g openclaw@latest` + `openclaw onboard --install-daemon` (wizard-driven). Original chapter described a source-clone workflow that is no longer the recommended path.

16. **Node >= 22 requirement** (§2.5.1) — Missing from original.

17. **`openclaw.json` config file example** (§2.5.3) — JSON5 format, SecretRef syntax (`${ENV_VAR}`), model fallback chain, `$include` directive, channel config, gateway config.

18. **First-run troubleshooting table** (§2.5.4) — Four common issues with symptoms, likely causes, and fixes.

19. **Health-check SKILL.md example** (§2.6.3) — Full realistic SKILL.md for the canonical skill used in Chapter 3, creating a concrete bridge between chapters.

20. **Expanded comparative analysis table** (§2.7.2) — Six-dimension comparison (target, state model, channels, skills, human-in-the-loop, deployment) vs. AutoGPT-style platforms.

---

## Sections Removed

None. All original sections were preserved. Several were expanded significantly.

---

## Sections Rewritten

| Section | Change | Reason |
|---------|--------|--------|
| §2.2.1 Gateway | Major expansion | Added RPC protocol, hot-reload, port resolution, internal components table |
| §2.2.3 Skills | Major expansion | Added three-location precedence, gating metadata, ClawHub, full SKILL.md example |
| §2.2.5 Channels | Rewritten | Old version listed 4 channels; new version has 17-channel table with extension packages |
| §2.5.2 Installation | Rewritten | Source-clone workflow replaced with `npm install -g` + `openclaw onboard` |
| §2.5.3 Configuration | Expanded | Old version: prose only. New version: annotated `openclaw.json` with SecretRef, `$include`, fallbacks |
| §2.5.4 First-Time Usage | Expanded | Added dialogue example, `clawhub install` workflow, troubleshooting table |
| §2.6.3 Skill Blueprint | Expanded | Old version: prose description of `ai-proposal-generator`. New version: full SKILL.md for `health-check` (the skill featured in Chapter 3), creating continuity |

---

## Key Improvements

1. **Technical accuracy:** All architecture descriptions now reflect v2026.2.27 (commit 8090cb4c), verified against DeepWiki's code-level indexing of the actual repository.

2. **Code examples:** Chapter went from zero code snippets to 9 code blocks covering: gateway commands, `openclaw.json` config, SKILL.md format, channel config, SSH tunnel, clawhub commands, tool policy config, RPC namespaces, and first-run usage examples.

3. **Channel completeness:** 4 channels → 17 channels. The table includes extension package names, giving readers a concrete path to the source code.

4. **Installation accuracy:** The onboarding wizard (`openclaw onboard --install-daemon`) is now correctly presented as the first-run experience, not source compilation.

5. **Chapter 3 bridge:** The `health-check` SKILL.md example in §2.6.3 directly previews the skill that Chapter 3 analyzes in depth, creating a natural narrative bridge that was absent in the original.

---

## What Was Preserved

- All section headings from the outline (no structural changes)
- All diagram references (`../diagrams/chapter-02/diagram-0N-*.svg`)
- Core philosophical content (§2.1 — philosophy, design principles, governance)
- Pattern framing (all eight patterns from Chapter 1 referenced in context)
- Deployment model concepts (§2.3 — local, cloud, hybrid)
- Community sections (§2.4 — GitHub, Discord, ClawHub)
- Comparative analysis framework (§2.7 — vs. chatbots, vs. other frameworks)
- Chapter 1 → Chapter 2 → Chapter 3 narrative arc
- Consistent terminology with Chapter 1 (all eight pattern names used correctly)

---

## Output Files

| File | Purpose |
|------|---------|
| `chapters/chapter-02.md` | **Revised chapter — 5,792 words** |
| `reviews/revision-review-chapter-02.md` | Pre-revision review with scores and gap analysis |
| `research/revision-research-chapter-02.md` | Research findings from DeepWiki + docs.openclaw.ai |
| `reviews/revision-summary-chapter-02.md` | This file |
