

### 5. `founder-coach`

*   **Purpose and Target Audience:**
    *   **Purpose:** To act as an AI-powered mindset coach for startup founders. It helps them identify and overcome "low-level" thinking patterns, apply mental models, and track their progress through weekly challenges and reports. It uses the Socratic method, asking questions rather than giving direct advice.
    *   **Target Audience:** Startup founders who are looking to improve their decision-making and mindset.

*   **SKILL.md Structure Patterns:**
    *   **YAML Frontmatter:** Detailed frontmatter with `name`, `version`, and a multi-line `description` that clearly outlines the use cases.
    *   **Core Philosophy:** A section that explains the guiding principles of the skill (e.g., "Mindset over Tactics," "Socratic Method"). This is a great way to define the skill's personality and approach.
    *   **Core Workflow:** A clear, numbered list describing the main operational stages of the skill, from onboarding to weekly reports.
    *   **Mental Model Library:** A structured list of the mental models the coach uses, categorized for clarity.
    *   **Anti-Patterns:** A list of negative thinking patterns that the coach is designed to detect and address.
    *   **Founder Profile System:** A detailed description of the data storage mechanism, including file location, structure, and update rules.
    *   **Integration Details:** Explains how the skill can optionally integrate with another system ("PhoenixClaw"), and how it should behave if that system is not present.
    *   **Documentation Reference:** A comprehensive list of all the files in the `references` and `assets` directories, with a brief description of each. This is excellent for maintainability and understanding.
    *   **Guardrails:** A very important section that explicitly lists what the skill **must not** do. This is a crucial safety feature.
    *   **Example Interactions:** Concrete examples of how the coach should interact with the user in different scenarios.

*   **Tool Usage Patterns:**
    *   **`read` and `write`:** The skill heavily relies on reading and writing to the founder's profile file (`~/PhoenixClaw/Startup/founder-profile.md`) and generating weekly reports.
    *   **`exec`:** It might use `exec` to check for the existence of configuration files (`~/.founder-coach/config.yaml`, `~/.phoenixclaw/config.yaml`).
    *   **`message`:** A lot of interaction with the user, asking Socratic questions and providing feedback.

*   **File Organization:**
    *   **`SKILL.md`:** A very comprehensive and well-structured main documentation file.
    *   **`_meta.json`:** Contains the skill's metadata.
    *   **`assets` directory:** Contains templates for the founder profile, challenges, and weekly reports.
    *   **`references` directory:** Contains detailed documentation on the mental models, anti-patterns, and other aspects of the skill. This is a great way to keep the main `SKILL.md` from becoming too cluttered while still providing in-depth information.

*   **Metadata Completeness:**
    *   **`SKILL.md`:** The YAML frontmatter has `name`, `version`, and a detailed `description`.
    *   **`_meta.json`:** Contains `ownerId`, `publishedAt`, `slug`, and `version`. The metadata is complete.

*   **Safety/Guardrail Provisions:**
    *   **Explicit Guardrails:** The "Guardrails" section is a very strong safety feature. It clearly defines the boundaries of the skill's functionality, preventing it from giving inappropriate advice (e.g., financial or business advice).
    *   **Socratic Method:** The emphasis on asking questions rather than giving answers is a form of a guardrail, as it empowers the user to make their own decisions.
    *   **Append-only Updates:** The rule to only append to the founder profile and never overwrite existing content is a good data-safety measure.
    *   **Graceful Degradation:** The skill is designed to work even if the "PhoenixClaw" integration is not available.
