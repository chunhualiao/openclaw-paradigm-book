# Research Notes: Chapter 9 Revision — Cost Optimization Patterns

**Date:** 2026-02-28  
**Researcher:** Revision Orchestrator (claude-sonnet-4-6)

---

## 1. Current LLM API Pricing (February 2026)

Sources: devtk.ai Feb 2026, IntuitionLabs, SiliconData, api-docs.deepseek.com

### Tier 1 (Flagship / Premium Reasoning)

| Model | Provider | Input $/1M | Output $/1M | Context |
|-------|----------|------------|-------------|---------|
| Claude Opus 4.6 | Anthropic | $5.00 | $25.00 | 200K |
| Claude Sonnet 4.6 | Anthropic | $3.00 | $15.00 | 200K |
| GPT-5 | OpenAI | $1.25 | $10.00 | 400K |
| Gemini 3.1 Pro | Google | $1.25 | $10.00 | 1M |
| Gemini 2.5 Pro | Google | $1.25 | $10.00 | 1M |
| o3 | OpenAI | $2.00 | $8.00 | 200K |

### Tier 2 (Balanced / Best Value)

| Model | Provider | Input $/1M | Output $/1M | Context |
|-------|----------|------------|-------------|---------|
| Claude Haiku 4.5 | Anthropic | $1.00 | $5.00 | 200K |
| GPT-4.1 | OpenAI | $2.00 | $8.00 | 1M |
| DeepSeek R1 | DeepSeek | $0.55 | $2.19 | 128K |
| Mistral Large 3 | Mistral | $2.00 | $6.00 | 128K |

### Tier 3 (Budget / High-Throughput)

| Model | Provider | Input $/1M | Output $/1M | Context |
|-------|----------|------------|-------------|---------|
| Gemini 2.5 Flash | Google | $0.15 | $0.60 | 1M |
| DeepSeek V3.2 | DeepSeek | $0.27 | $1.10 | 128K |
| Mistral Small 3.1 | Mistral | $0.20 | $0.60 | 131K |

---

## 2. Anthropic Prompt Caching

- Cache write: 25% premium (Sonnet 4.6: $3.75/1M for writing to cache)
- Cache read: 90% DISCOUNT (Sonnet 4.6: $0.30/1M for reading from cache)
- Cache TTL: 5 minutes (extendable)
- Minimum cacheable block: 1,024 tokens
- Works on: system prompts, tool definitions, long reference docs

**Example savings:**
- 10,000 requests × 2,000-token system prompt
- Without caching: $60.00
- With caching (1 write + 9,999 reads at $0.30/1M): ~$6.01
- Savings: ~90%

---

## 3. DeepSeek Prompt Caching

- V3.2 cache hit: ~$0.07/1M (vs $0.27 miss = 74% discount)
- R1 cache hit: ~$0.14/1M (vs $0.55 miss)
- Automatic — no explicit cache control needed

---

## 4. OpenRouter as Cost Arbitrage

- 290+ models via single API endpoint
- Dynamic routing to cheapest/fastest provider
- Supports: OpenAI, Anthropic, Google, DeepSeek, Mistral, Meta, xAI
- Useful pattern: `openrouter/auto` picks cheapest capable model automatically

---

## 5. 2026 Key Trends

1. Context caching now #1 cost lever (all major providers offer it)
2. DeepSeek disruption: western providers dropped prices 40-60% since early 2025
3. Small model renaissance: Gemini 2.5 Flash handles 80% of tasks needing GPT-4 class previously
4. Vision costs: screenshots ~1,500 tokens vs aria snapshots ~100 tokens (15x cheaper)
5. Local model maturity: Llama 3.3 70B via llama.cpp costs ~$0.002/1M tokens in electricity

---

## 6. OpenClaw Config Examples (for Chapter)

```bash
# .env for cost-optimized OpenClaw
PRIMARY_MODEL=anthropic/claude-sonnet-4-6
BALANCED_MODEL=anthropic/claude-haiku-4-5
CHEAP_MODEL=deepseek/deepseek-chat
MAX_DAILY_SPEND_USD=5.00
ENABLE_PROMPT_CACHING=true
```

```yaml
# openclaw-routing.yaml
routing:
  rules:
    - pattern: "summarize|classify|extract|format"
      model: deepseek/deepseek-chat
    - pattern: "code|architect|design|complex"
      model: anthropic/claude-sonnet-4-6
    - default: anthropic/claude-haiku-4-5
  budget:
    per_task_usd: 0.50
    per_day_usd: 5.00
    overflow_action: downgrade_model
```

