# Research: Chapter 2 Revision — OpenClaw Current Architecture (2026)

**Date:** 2026-02-28  
**Sources:** DeepWiki (deepwiki.com/openclaw/openclaw, commit 8090cb4c), github.com/openclaw/openclaw, docs.openclaw.ai  
**Version Researched:** v2026.2.27 (latest stable as of indexing date: 28 February 2026)

---

## 1. Repository / Monorepo Structure (DeepWiki)

OpenClaw is a **pnpm workspace monorepo** (`pnpm-workspace.yaml`):

| Path | Purpose |
|------|---------|
| `.` (root) | Core Gateway, CLI, agent runtime, channel integrations — the `openclaw` npm package |
| `ui/` | Browser-based Control UI (`openclaw-control-ui`, built with Vite + LitElement) |
| `extensions/*` | Channel/feature plugins: telegram, discord, slack, signal, whatsapp, matrix, feishu, msteams, irc, line, zalo, mattermost, nextcloud-talk, etc. |
| `apps/ios/` | iOS native node app (`ai.openclaw.ios`, Swift) |
| `apps/macos/` | macOS native node app (`ai.openclaw.mac`, Swift) |
| `apps/android/` | Android native node app (`ai.openclaw.android`, Kotlin/Compose) |
| `packages/*` | Internal packages (e.g., `clawdbot`, `moltbot`) |

**Entry point:** `src/index.ts` → `buildProgram()` from `src/cli/program.ts`  
**Runtime requirement:** Node >= 22

---

## 2. Gateway Architecture (DeepWiki — authoritative)

The Gateway (`GatewayServer`, `message-handler.ts`) is the **central control plane**. It runs as a single always-on process that exposes **one multiplexed port** (default `18789`):

- **WebSocket RPC** — all control traffic (CLI, Control UI, channel plugins, native node apps)
- **HTTP APIs** — `POST /tools/invoke` (external tool calls), OpenAI-compatible API surface
- **Served assets** — the Control UI SPA

### Gateway Responsibilities

| Responsibility | Description |
|---|---|
| Session management | Creates, stores, resets, and deletes conversation sessions |
| Configuration | Loads and hot-reloads `openclaw.json` via Zod schema |
| Channel coordination | Monitors inbound channel events, dispatches to agent |
| Agent execution | Runs embedded Pi agent runtime (`@mariozechner/pi-coding-agent`) |
| Cron scheduling | Runs scheduled jobs (`CronJob` records) |
| Auth enforcement | Validates tokens, passwords, device identity, Tailscale headers |
| Memory indexing | Delegates to `MemorySearchManager` (SQLite or LanceDB backend) |

### WebSocket RPC Protocol

Three frame types defined in `protocol.schema.json`:
- `RequestFrame` (client → server): invoke a named RPC method
- `ResponseFrame` (server → client): return value for a request
- `EventFrame` (server → client): push event (agent output, session changes, etc.)

RPC namespace groups:

| Namespace | Key Methods |
|---|---|
| `agent.*` | `agent.run`, `agent.identity`, `agent.wait` |
| `chat.*` | `chat.history`, `chat.send`, `chat.abort`, `chat.inject` |
| `sessions.*` | `sessions.list`, `sessions.patch`, `sessions.reset`, `sessions.delete` |
| `cron.*` | `cron.add`, `cron.update`, `cron.remove`, `cron.run` |
| `config.*` | `config.get`, `config.apply`, `config.patch` |
| `nodes.*` | `nodes.status`, `nodes.invoke` |
| `mesh.*` | Multi-gateway routing |

### Port and Bind Resolution Order
```
--port CLI flag → OPENCLAW_GATEWAY_PORT env → gateway.port config → 18789
```
Default bind mode: `loopback` (127.0.0.1 only for security).

### Hot Reload Modes
| Mode | Behavior |
|---|---|
| `off` | No config reload |
| `hot` | Apply only hot-safe changes |
| `restart` | Restart on reload-required changes |
| `hybrid` (default) | Hot-apply when safe, restart when required |

---

## 3. Configuration Format (DeepWiki)

Config file: `~/.openclaw/openclaw.json` (JSON5 format, Zod-validated, supports hot-reload and `$include` directives, SecretRef):

```json
{
  "agent": {
    "model": "anthropic/claude-opus-4-6"
  },
  "channels": {
    "telegram": { "botToken": "..." },
    "discord": { "token": "..." }
  },
  "gateway": {
    "port": 18789,
    "bind": "loopback",
    "auth": { "mode": "token" }
  }
}
```

---

## 4. Agent System (DeepWiki)

Built on `@mariozechner/pi-coding-agent` (`runReplyAgent` / `runEmbeddedPiAgent`).

Each agent has:
- **Workspace directory** (default `~/.openclaw/workspace`) containing `AGENTS.md`, `SOUL.md`, `MEMORY.md`, and other injected prompt files
- **Session store** — conversations persisted in `sessions.json` + transcript `.jsonl` files
- **Model configuration** — primary model + fallback chain from one or more AI providers
- **Tool set** — exec, browser, memory search, subagent spawning, filesystem operations, etc.

Per-agent skills live in `<workspace>/skills`. Shared skills in `~/.openclaw/skills`.

---

## 5. Channels — Full List (DeepWiki, 17 channels)

| Channel | Extension Package | Notes |
|---|---|---|
| Telegram | `extensions/telegram` | grammY SDK |
| Discord | `extensions/discord` | discord.js + slash commands |
| WhatsApp | `extensions/whatsapp` | Baileys (QR pairing) |
| Slack | `extensions/slack` | Bolt SDK (socket + HTTP) |
| Signal | `extensions/signal` | signal-cli |
| iMessage (BlueBubbles) | built-in | Recommended iMessage path |
| iMessage (legacy) | `extensions/imessage` | macOS only, via `imsg` |
| Matrix | `extensions/matrix` | matrix-bot-sdk |
| Feishu/Lark | `extensions/feishu` | Lark Node SDK |
| Microsoft Teams | `extensions/msteams` | Bot Framework |
| Google Chat | `extensions/googlechat` | Chat API webhook |
| IRC | `extensions/irc` | — |
| Mattermost | `extensions/mattermost` | — |
| Zalo | `extensions/zalo` | — |
| LINE | `extensions/line` | — |
| Nextcloud Talk | `extensions/nextcloud-talk` | — |
| WebChat | built-in | Served by Gateway |

Each channel runs a **monitor** that: receives inbound messages → normalizes to common format → delivers to Gateway agent runtime → sends reply back through channel.

---

## 6. AI Model Providers (DeepWiki)

| Provider | Auth Method |
|---|---|
| Anthropic (Claude) | API key or OAuth token |
| OpenAI / OpenRouter | API key or OAuth token |
| Ollama | Local endpoint (auto-discovery) |
| Google Gemini / Gemini CLI | API key or OAuth |
| MiniMax | API key |
| AWS Bedrock | AWS credentials |
| Custom OpenAI-compatible | Base URL + API key |

Model failover: primary model + fallback chain configured per agent.

---

## 7. Native Nodes (DeepWiki)

Native apps connect to Gateway as clients with `node` role over WebSocket. They expose device-local capabilities invocable via `nodes.invoke` RPC:
- Camera, screen recording, location, notifications
- Voice Wake + Talk Mode (ElevenLabs TTS)
- Canvas rendering (A2UI)

| App | Bundle ID | Language |
|---|---|---|
| iOS | `ai.openclaw.ios` | Swift |
| macOS | `ai.openclaw.mac` | Swift |
| Android | `ai.openclaw.android` | Kotlin/Compose |

Pairing: device keypair authentication flow.

---

## 8. Skills System (docs.openclaw.ai)

**AgentSkills-compatible** spec (agentskills.io).

**Three skill locations with precedence:**
```
<workspace>/skills  (highest — per-agent)
~/.openclaw/skills  (shared — all agents)
bundled skills      (shipped with npm package, lowest)
```

Extra dirs: `skills.load.extraDirs` in `~/.openclaw/openclaw.json`

**SKILL.md required frontmatter:**
```markdown
---
name: weather-check
description: Get current weather for any location
metadata: {"openclaw": {"requires": {"env": ["OPENWEATHER_API_KEY"]}, "primaryEnv": "OPENWEATHER_API_KEY", "emoji": "🌤"}}
user-invocable: true
---
```

**Gating metadata fields** (load-time filters):
- `requires.bins`: Required system binaries (e.g., `["uv", "ffmpeg"]`)
- `requires.env`: Required environment variables
- `requires.config`: Required gateway config keys
- `always: true`: Skip all gates, always load

**ClawHub**: Public skills registry at https://clawhub.com
```bash
clawhub install <skill-slug>     # install to workspace
clawhub update --all             # update all installed skills
clawhub publish ./skills/myskill # publish to registry
```

---

## 9. Security Model (DeepWiki)

Designed for **personal, single-operator** use. Key defaults:
- Gateway binds to `127.0.0.1` (loopback) by default
- Auth required for all WebSocket connections (shared token or password)
- Inbound DMs from unknown senders: `dmPolicy: "pairing"` (pairing code challenge)
- Non-main sessions can be sandboxed in Docker (`agents.defaults.sandbox.mode: "non-main"`)

Security commands:
```bash
openclaw doctor                  # surface risky/misconfigured settings
openclaw security audit          # full security audit report
```

---

## 10. Installation — Current Reality (2026)

```bash
# Recommended (npm global install)
npm install -g openclaw@latest
# or: pnpm add -g openclaw@latest

# Wizard-driven setup (installs Gateway daemon: launchd/systemd)
openclaw onboard --install-daemon
```

**Release channels:**
```bash
openclaw update --channel stable|beta|dev
```

**From source (for contributors):**
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm ui:build && pnpm build
pnpm openclaw onboard --install-daemon
# Dev loop:
pnpm gateway:watch
```

---

## 11. Chapter 2 Inaccuracies to Correct

1. Installation: change from source-clone to `npm install -g` + `openclaw onboard`
2. Channels: expand from 4 to full 17-channel table
3. Config file: correct from `config.yaml` to `~/.openclaw/openclaw.json` (JSON5)
4. Gateway: add port 18789, auth, RPC protocol details, hot-reload
5. Skills: add three-location precedence, SKILL.md frontmatter example, ClawHub
6. Add native nodes section (iOS/macOS/Android)
7. Add AI provider table (7 providers)
8. Add Memory: SQLite/LanceDB backend
9. Add Control UI: LitElement SPA details

**What the chapter got right:**
- Gateway-mediated multi-agent concept
- Agent types (main, sub-agent, cron)
- Core tools list
- Philosophy (pragmatic, human-centric)
- Deployment model concepts
- Comparison with other frameworks (directionally)
