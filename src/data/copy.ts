/** Site marketing + documentation copy (from the Agora content workflow). */

export const COPY = {
  tagline: 'Agora — the public square for Claude Code plugins.',
  heroHeadline: 'A marketplace for Claude Code plugins',
  heroSubhead:
    'A curated public square where Claude Code gathers the best slash commands and subagents — to trade ideas, ship code, and skip the busywork.',

  aboutMarkdown: `## What is Agora?

Agora is a marketplace of plugins for [Claude Code](https://docs.claude.com/en/docs/claude-code). Add it once, and a shelf of focused slash commands and subagents becomes available inside your editor — each one a small, sharp tool that does one job well: writing your commit message, drafting your PR, scaffolding your tests, hardening your Dockerfile, untangling a regex, tuning a slow query.

The name is borrowed from the **agora** of the ancient Greek city — the open square at the heart of the polis where citizens gathered to trade goods, argue philosophy, and conduct the daily business of the city. It was marketplace, forum, and commons all at once. That is the idea here: a common space where good tools are brought into the light, shared freely, and put to honest use.

We've kept the spirit and dropped the togas. Every plugin in Agora is built to be **idiomatic, project-aware, and quietly correct** — it reads your repo before it opens its mouth. No ceremony, no boilerplate generators that spray the same template over every stack.

Walk in, take what's useful, and get back to building. The square is open.`,

  addToClaudeMarkdown: `## Add Agora to Claude Code

Agora installs as a plugin marketplace inside Claude Code. Pick whichever source you prefer.

### 1. Add the marketplace

**From the Git repo** (recommended — keeps you on the latest plugins):

\`\`\`
/plugin marketplace add probablybadmove/agora
\`\`\`

**From the hosted manifest:**

\`\`\`
/plugin marketplace add https://agora.gagansingh.tech/marketplace.json
\`\`\`

Either command registers the marketplace under the name \`agora\`.

### 2. Install a plugin

Install any plugin by name, scoped to the marketplace with \`@agora\`:

\`\`\`
/plugin install conventional-commits@agora
\`\`\`

Then reload so Claude Code picks it up:

\`\`\`
/reload-plugins
\`\`\`

(Or just restart Claude Code — same effect.)

### 3. Use it

Invoke the plugin's slash command in any project:

\`\`\`
/conventional-commits:commit
\`\`\`

### Browse first (optional)

Start with the meta-plugin to see what's on offer:

\`\`\`
/plugin install agora-welcome@agora
/reload-plugins
/agora-welcome:agora
\`\`\``,

  publishGuideMarkdown: `## Publish your own plugin

Agora is an open square — bring your own stall. Adding a plugin is a single pull request.

### 1. Fork and clone

Fork the [\`probablybadmove/agora\`](https://github.com/probablybadmove/agora) repo and clone your fork locally.

### 2. Create your plugin directory

Add a folder under \`plugins/\` named for your plugin:

\`\`\`
plugins/
  your-plugin-name/
    .claude-plugin/
      plugin.json      # name, description, version, author
    skills/            # your slash commands (SKILL.md)
    agents/            # optional: subagents
\`\`\`

Keep it focused: one plugin, one clear job. Make it **project-aware** — detect the stack, framework, or dialect before acting, the way the rest of Agora's plugins do.

### 3. Register it in marketplace.json

Add an entry to the \`plugins\` array in the top-level \`.claude-plugin/marketplace.json\`, pointing at your directory with a relative \`source\` path:

\`\`\`json
{
  "name": "your-plugin-name",
  "source": "./plugins/your-plugin-name",
  "description": "One sharp sentence: what it does and when to reach for it.",
  "category": "Git"
}
\`\`\`

### 4. Test it locally

\`\`\`
/plugin marketplace add <your-username>/agora
/plugin install your-plugin-name@agora
/reload-plugins
\`\`\`

### 5. Open a pull request

Open a PR against \`probablybadmove/agora\` with your new \`plugins/<name>/\` directory and the \`marketplace.json\` entry. Once it's reviewed and merged, your plugin is live in the square for everyone.`,

  faq: [
    {
      q: 'What exactly is a Claude Code plugin?',
      a: 'A plugin bundles slash commands and/or subagents that extend Claude Code. Agora’s plugins are task-focused: you run something like /conventional-commits and the plugin reads your repo, does the work, and hands back a result. Each one is small and does a single job well.',
    },
    {
      q: 'Do I have to install all the plugins?',
      a: 'No. Adding the marketplace just makes the catalog available — nothing runs until you install it. Pick only the plugins you want with /plugin install <name>@agora. Install one, install ten, or install agora-welcome first to browse the shelf.',
    },
    {
      q: 'Should I add Agora via the Git repo or the hosted marketplace.json?',
      a: 'Either works. `/plugin marketplace add probablybadmove/agora` pulls from the repo and resolves plugins via relative paths, which is the simplest way to stay current. The hosted manifest at https://agora.gagansingh.tech/marketplace.json adds the same catalog with absolute git-subdir sources. Use whichever you prefer.',
    },
    {
      q: "I installed a plugin but the command isn't showing up. Why?",
      a: 'Plugins activate after a reload. Run /reload-plugins (or restart Claude Code) and the new slash command will appear. This is the single most common snag — a quick reload fixes it.',
    },
    {
      q: 'Are these plugins safe to run on my codebase?',
      a: 'Agora’s plugins are designed to read context and propose changes, not to act behind your back. Commit-, license-, and PR-style plugins show you the result and offer to proceed rather than committing or pushing silently. Every plugin’s source lives in the public repo, so you can read exactly what it does before installing.',
    },
    {
      q: 'How do I get my own plugin into Agora?',
      a: 'Open a pull request. Add a plugins/<your-plugin>/ directory and a matching entry in marketplace.json with a relative source path and a category, test it against your fork, and submit the PR. See the "Publish your own plugin" guide above.',
    },
  ],
} as const;
