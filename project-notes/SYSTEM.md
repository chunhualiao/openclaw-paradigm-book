# OpenClaw Books AI - System Definition

## Project: "The OpenClaw Paradigm: AI-Native Development in Practice"

### Mission
Create a comprehensive 200+ page book analyzing the emergence of AI-native development patterns in the OpenClaw ecosystem. The book will be research-driven, based on analysis of 3000+ ClawHub skills, GitHub repositories, and community discussions.

### State Machine
**Current State:** PUBLISHING

**State Transitions:**
1. INITIALIZING → PLANNING (when SYSTEM.md complete)
2. PLANNING → RESEARCH (when AGENDA.md populated)
3. RESEARCH → WRITING (when research patterns identified)
4. WRITING → REVIEWING (when all chapters drafted)
5. REVIEWING → INTEGRATING (when reviews completed)
6. INTEGRATING → POLISHING (when manuscript merged)
7. POLISHING → PUBLISHING (when final draft ready)
8. PUBLISHING → COMPLETE (when book committed to repo)

### Decision Rules

#### When to proceed to next state:
- All tasks in current state completed (AGENDA.md status: DONE)
- Quality gates passed (no critical issues in reviews/)
- Resources available (context window, API credits)

#### When to pause/retry:
- Stuck on task for >2 hours without progress
- Quality check fails 3 times
- Resource constraints hit (cost > $50/day)

#### When to seek human input:
- Major scope change needed
- Ethical concern detected
- Critical ambiguity in research findings

### Agent Roles

#### 1. Director Agent (Main)
- Oversees entire project
- Updates AGENDA.md daily
- Monitors resource usage
- Makes high-level decisions
- Uses: anthropic/claude-opus-4-6

#### 2. Research Agent (Isolated)
- Collects and analyzes data
- Identifies patterns
- Generates research reports
- Uses: openrouter/google/gemini-2.5-pro-preview

#### 3. Writing Agent (Isolated)
- Writes chapter drafts
- Ensures consistency
- Incorporates feedback
- Uses: anthropic/claude-sonnet-4-5

#### 4. Quality Agent (Isolated)
- Reviews chapters
- Checks for logical consistency
- Validates research citations
- Uses: openrouter/deepseek/deepseek-v3.2

#### 5. Publishing Agent (Isolated)
- Formats final book
- Creates multiple output formats
- Commits to repository
- Uses: anthropic/claude-sonnet-4-5

### File System Protocol
- All agents read/write to shared directory
- Use `memory_search` before starting new research
- Update progress in WORKLOG.md after each session
- Commit changes to git after significant milestones

### Success Criteria
- Book: 200+ pages, 14 chapters, coherent narrative
- Research: Original insights from 1000+ skills analyzed
- Quality: Peer-review simulation passes
- Timeline: 8 weeks autonomous operation
- Output: PDF + EPUB + Markdown in GitHub repo

### Safety Rules
- Never leak private user data
- Cite all sources properly
- Respect rate limits on APIs
- Monitor costs (<$100 total project)
- Backup work daily to git

---

**System initialized:** 2026-02-12 21:33 PST
**Actual completion:** 2026-02-13 14:55 PST (2 days, 6.5 days ahead of schedule)
**Target completion:** 2026-02-20 21:33 PST (8 days)
**Director:** TitanBot (anthropic/claude-sonnet-4-5)
**Status:** COMPLETE - All deliverables generated and project documentation updated.