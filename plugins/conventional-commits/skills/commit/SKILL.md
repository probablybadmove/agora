---
description: Generate a Conventional Commits message from the staged git diff (type(scope): summary, body, footers), detect breaking changes, and offer to run the commit. Use whenever the user wants to commit staged changes or asks for a commit message.
argument-hint: "[optional hint, e.g. scope or extra context]"
allowed-tools: Bash, Read
---

# Conventional Commit from Staged Diff

Write a high-quality [Conventional Commits 1.0.0](https://www.conventionalcommits.org/) message from what is **staged**, then offer to run the commit. Optional user context: `$ARGUMENTS`.

## Step 1 — Inspect the staged state

Run these (read-only) commands and base everything on their output. Do not invent changes you cannot see.

```bash
git rev-parse --is-inside-work-tree         # confirm we're in a repo
git status --short                          # staged (left column) vs unstaged (right)
git diff --cached --stat                    # files + churn that are STAGED
git diff --cached                           # the actual staged hunks — read carefully
```

Handle these cases before writing anything:

- **Nothing staged** (`git diff --cached --quiet` exits 0): tell the user there are no staged changes. Show `git status --short`, then ask whether they want to `git add -A`, stage specific files, or stage interactively. Do **not** stage anything yourself without confirmation. Stop here until they decide.
- **Partially staged files** (a path shows in both columns of `git status --short`): mention which files have unstaged changes that will be left out, so the message describes only what is actually being committed.
- **Huge diff** (hundreds of changed files or generated/lockfiles dominating): summarize from `--stat` and the most meaningful files rather than every line.

## Step 2 — Classify the change (pick ONE type)

Choose the single type that best describes the **primary intent** of the staged diff:

| Type       | Use when                                                                 |
|------------|--------------------------------------------------------------------------|
| `feat`     | A new user-facing capability or feature                                  |
| `fix`      | A bug fix                                                                 |
| `docs`     | Documentation only (README, comments, docs/)                             |
| `style`    | Formatting/whitespace/semicolons; no logic change                        |
| `refactor` | Code change that neither fixes a bug nor adds a feature                   |
| `perf`     | A performance improvement                                                 |
| `test`     | Adding or correcting tests only                                          |
| `build`    | Build system or dependencies (npm, pip, cargo, Docker, Makefile)         |
| `ci`       | CI configuration (GitHub Actions, GitLab CI, etc.)                       |
| `chore`    | Routine maintenance that fits nothing above (e.g. .gitignore, configs)   |
| `revert`   | Reverting a previous commit                                              |

If the diff genuinely spans unrelated concerns (e.g. a feature **and** an unrelated bug fix), say so and recommend splitting into separate commits via `git restore --staged <path>`. Offer to write a message for the dominant change anyway.

## Step 3 — Determine the scope (optional but preferred)

The scope is a noun naming the affected area, in parentheses after the type — e.g. `feat(auth)`, `fix(parser)`. Derive it from the staged paths:

- Common top-level dir or package (`src/auth/...` → `auth`, `packages/api/...` → `api`).
- A single dominant module or component name.
- Respect any scope the user passed in `$ARGUMENTS`.
- Omit the scope entirely if changes are cross-cutting or no clean noun fits. Never invent a misleading scope.

Before settling on a scope, check the repo's existing convention so you match it:

```bash
git log --pretty=format:%s -n 30
```

Mirror whatever style is already in use (existing scopes, lowercase vs not, etc.).

## Step 4 — Detect BREAKING CHANGES

Flag a breaking change when the staged diff shows any of:

- Removed/renamed public functions, classes, exports, CLI flags, env vars, or routes.
- Changed function/method signatures, required parameters, or return shapes.
- Altered API request/response formats, DB schema/migrations that drop or rename columns.
- Changed default behavior or config keys that existing users depend on.
- A major version bump in a manifest, or removed public config options.

If breaking, signal it **both** ways per spec:
1. Append `!` after the type/scope: `feat(api)!: ...`
2. Add a footer: `BREAKING CHANGE: <what broke and the migration path>`.

If you are unsure whether something is breaking, ask the user rather than guessing.

## Step 5 — Compose the message

Format exactly:

```
<type>(<scope>)<!>: <summary>

<body>

<footers>
```

Rules:
- **Summary line**: imperative mood ("add", not "added"/"adds"), lowercase first letter, **no trailing period**, target ≤ 50 chars and hard-limit 72. It must describe *what changed and why at a glance*, not the filenames.
- **Body** (optional, omit for trivial changes): wrap at ~72 cols. Explain the motivation and contrast with previous behavior — the *why*, not a line-by-line *what*. Use `-` bullets when several distinct changes belong in one commit.
- **Footers** (optional):
  - `BREAKING CHANGE: ...` when applicable (see Step 4).
  - Issue refs the user provides or that appear in branch name / `$ARGUMENTS`, e.g. `Closes #123`, `Refs #45`.
  - `Co-authored-by: Name <email>` if relevant.
- Do **not** add advertising/tooling footers unless the user's repo convention shows them.

## Step 6 — Present and offer to commit

1. Show the proposed message in a fenced block so the user can read it cleanly.
2. Briefly note your reasoning: chosen type, scope, and whether you flagged a breaking change.
3. Ask: **"Commit with this message, edit it, or cancel?"**
4. On confirmation, run the commit using a heredoc to preserve newlines exactly:

```bash
git commit -F - <<'EOF'
<full message here>
EOF
```

Then show `git log -1 --stat` to confirm. If the commit fails (e.g. a pre-commit/commit-msg hook rejects it), show the hook output verbatim, explain the failure, and offer to adjust the message or fix the underlying issue. Never use `--no-verify` unless the user explicitly asks.

Never amend, force, or push unless the user explicitly requests it.
