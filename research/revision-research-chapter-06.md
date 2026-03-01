# Research: Chapter 6 — File Coordination and Memory Patterns

## Date: 2026-02-28
## Sources: AGENTS.md (workspace), OpenClaw documentation

---

## OpenClaw Memory Architecture (from AGENTS.md)

### Session Model
- "You wake up fresh each session. These files are your continuity."
- Each LLM turn has no inherent memory — files are the ONLY persistence mechanism
- This is the foundational design principle: **files = memory, no files = amnesia**

### Three-Tier Memory System

**Tier 1: Long-Term Memory (MEMORY.md)**
- Curated, distilled memory — the "essence" not raw logs
- ONLY loaded in main sessions (direct human-AI chat)
- NEVER loaded in group chats, Discord, or shared contexts (security)
- Contains personal context that must not leak to strangers
- Agent can read, edit, and update freely in main sessions
- Contains significant events, thoughts, decisions, opinions, lessons

**Tier 2: Daily Notes (memory/YYYY-MM-DD.md)**
- Raw operational logs of what happened each day
- Created fresh each day; recent ones provide short-term context
- Loaded at session start along with MEMORY.md

**Tier 3: Working Memory / Behavioral Config**
- AGENTS.md — behavior instructions loaded every session
- TOOLS.md — environment-specific notes (camera names, SSH hosts, voices)
- HEARTBEAT.md — checklist for periodic proactive tasks
- SOUL.md — persona and tone (loaded every session)
- USER.md — information about the human operator

### Heartbeat-Driven Memory Maintenance
- Periodic review of daily memory/YYYY-MM-DD.md files
- Distillation of key insights into MEMORY.md
- "Like a human reviewing their journal and updating their mental model"
- Daily files = raw notes; MEMORY.md = curated wisdom
- Triggered via heartbeat polls (every few hours)
- Removes outdated info from MEMORY.md

### Memory Security Design
- MEMORY.md never loads in shared contexts (Discord, group chats)
- Reason: contains personal context that shouldn't leak to strangers
- This is an explicit security boundary, not just convention
- Daily notes may be more shareable (less personal by default)

### The "Write It Down" Principle
- Mental notes don't survive session restarts. Files do.
- "remember this" → update memory/YYYY-MM-DD.md
- Lessons learned → update AGENTS.md, TOOLS.md, or skill files
- Mistakes → document so future-you doesn't repeat

### Heartbeat State Tracking
```json
{
  "lastChecks": {
    "email": 1703275200,
    "calendar": 1703260800,
    "weather": null
  }
}
```
Stored in memory/heartbeat-state.json

---

## Vector Memory Research

### Tools Available
- **ChromaDB**: Open-source embedding database, local or cloud, good for prototyping
- **FAISS**: Meta's high-performance similarity search library, C++ with Python bindings
- **Qdrant**: Production-ready vector database with filtering and cloud hosting
- **Pinecone**: Managed vector database, serverless pricing

### Embedding Models
- **OpenAI text-embedding-3-small**: 1536 dims, $0.02/1M tokens, fast
- **OpenAI text-embedding-3-large**: 3072 dims, higher accuracy
- **sentence-transformers/all-MiniLM-L6-v2**: Local, 384 dims, fast, free
- **nomic-embed-text**: Local/API, 768 dims, good performance

### Typical Pipeline
1. Chunk memory files into segments (300-800 tokens with overlap)
2. Generate embeddings via model API or local model
3. Store vectors + metadata in vector DB
4. At query time: embed query → similarity search → retrieve top-k chunks

### OpenClaw Context
- memory_search tool performs semantic search across memory files
- memory_get retrieves specific memory entries
- Future direction: large memory stores will require vector indexing
- Current approach: recency-based + full-file loading for small deployments

---

## Key Sources
- AGENTS.md (workspace root) — authoritative spec for memory behavior
- SOUL.md — persona continuity model
- OpenClaw skill files — practical implementation examples
