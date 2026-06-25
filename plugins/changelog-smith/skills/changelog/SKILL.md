---
description: Generate or update a Keep a Changelog CHANGELOG.md from git commit history since the last release tag, grouping commits into Added/Changed/Deprecated/Removed/Fixed/Security and recommending the next semantic version. Use when the user asks to write, update, or cut a changelog or prepare release notes.
argument-hint: "[version|major|minor|patch] (optional; e.g. 1.4.0 or minor)"
allowed-tools: Bash, Read, Edit, Write
---

# Changelog Smith

Produce a clean, [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) entry from the commits made since the last release, and update (or create) `CHANGELOG.md` in the repository root.

`$ARGUMENTS` may contain an explicit version (`1.4.0`), a bump keyword (`major` / `minor` / `patch`), or be empty. Interpret it in **Step 4**.

## Step 1 — Confirm this is a git repo and find the baseline

Run these (do not guess — read the real output):

```bash
git rev-parse --is-inside-work-tree
git describe --tags --abbrev=0 2>/dev/null   # most recent tag, or empty
git tag --sort=-version:refname | head -n 5  # context on tagging scheme
```

- If `git describe` returns a tag (e.g. `v1.3.2`), that tag is the **baseline**. Collect commits with `<tag>..HEAD`.
- If there are **no tags**, the baseline is the root commit — collect the entire history (`git log`) and this will be the project's first release.
- Note whether tags are prefixed with `v` (e.g. `v1.3.2`) so you mirror that scheme in any tag suggestions. Changelog **headings** never include the `v` prefix per the spec.

## Step 2 — Gather the commits

```bash
git log <baseline>..HEAD --no-merges --pretty=format:'%h%x09%s%x09%an'
```

Also capture bodies when subjects are terse, since `BREAKING CHANGE:` and `Closes #123` footers usually live in the body:

```bash
git log <baseline>..HEAD --no-merges --pretty=format:'==%h==%n%s%n%b'
```

If there are zero commits since the last tag, tell the user there is nothing to release and stop.

## Step 3 — Classify each commit

Map every commit to exactly one Keep a Changelog section. Prefer Conventional Commit prefixes when present, otherwise infer from the wording:

| Section        | Conventional prefix / signal                                  |
| -------------- | ------------------------------------------------------------- |
| **Added**      | `feat:` — new features, endpoints, flags, capabilities        |
| **Changed**    | `refactor:`, `perf:`, `build:`, behavior/UX/dependency changes |
| **Deprecated** | anything marked deprecated / "will be removed"                 |
| **Removed**    | deletion of a feature, flag, endpoint, or public API           |
| **Fixed**      | `fix:` — bug fixes                                             |
| **Security**   | vulnerability fixes, `CVE`, auth/permission hardening          |

Classification rules:
- **Drop noise.** Omit commits that don't affect users: `chore:`, `ci:`, `test:`, `docs:` (unless user-facing docs), `style:`, version-bump commits, and merge commits. If unsure whether something is user-facing, lean toward including it under **Changed**.
- **Rewrite, don't paste.** Turn `fix: npe in parser when input empty` into `Fixed a crash when parsing empty input.` Use the imperative-to-past, user-facing voice. Strip the type prefix and scope from the final text.
- **Squash duplicates.** Collapse "fix typo in feature X" + "feat: X" into one Added entry.
- **Link issues/PRs** when a footer references them, e.g. append ` (#123)`.
- **Flag breaking changes.** Any commit with `!` after the type (`feat!:`) or a `BREAKING CHANGE:` footer is breaking — note it and mark it with **(breaking)** in the entry.

## Step 4 — Determine the version

Read the latest tag's number (strip any `v`). Then:

1. If `$ARGUMENTS` is an explicit semver string (`1.4.0`), use it verbatim.
2. If `$ARGUMENTS` is `major` / `minor` / `patch`, bump that component (resetting lower components to 0).
3. If `$ARGUMENTS` is empty, **recommend** a bump from the classified commits and state your reasoning:
   - any **breaking change** or **Removed** entry → **major**
   - any **Added** entry (and no breaking change) → **minor**
   - only **Fixed** / **Security** / **Changed** → **patch**
   - For pre-1.0.0 projects, soften this: breaking → minor, features/fixes → patch, and say so.
   - If there are no tags at all, propose `1.0.0` (or `0.1.0` if the user signals the project is unstable) and ask the user to confirm.

Confirm the chosen version with the user before writing if you had to infer it.

## Step 5 — Write the entry

Use today's date in ISO format (`YYYY-MM-DD`). Entry skeleton — **only include sections that have entries**, in this fixed order:

```markdown
## [<version>] - <YYYY-MM-DD>

### Added
- <user-facing description.> (#PR)

### Changed
- <user-facing description.>

### Fixed
- <user-facing description.>
```

## Step 6 — Update or create CHANGELOG.md

- **Read `CHANGELOG.md` first** if it exists. Insert the new entry directly **below** the `## [Unreleased]` section (creating an empty `## [Unreleased]` above it) and **above** the previous most-recent release. Never reorder or edit existing released entries.
- If there's an existing `## [Unreleased]` section with hand-written notes, **merge** them into your generated entry rather than discarding them, then leave `## [Unreleased]` empty.
- If `CHANGELOG.md` does **not** exist, create it with the standard header:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [<version>] - <YYYY-MM-DD>
...
```

- Maintain comparison link references at the bottom when the repo has a known remote. Derive the base URL from `git remote get-url origin` (normalize `git@github.com:owner/repo.git` → `https://github.com/owner/repo`). Add/refresh:

```markdown
[Unreleased]: https://github.com/owner/repo/compare/v<version>...HEAD
[<version>]: https://github.com/owner/repo/compare/v<previous>...v<version>
```

  For the very first release use `/releases/tag/v<version>` instead of a compare link. Skip link refs entirely if you cannot determine the remote.

## Step 7 — Report back

After editing, show the user:
1. The exact new entry you wrote.
2. The recommended version and your one-line reasoning.
3. The suggested tag command, matching their existing prefix scheme — e.g. `git tag -a v<version> -m "Release <version>"` — but **do not run it yourself**. Tagging and committing are the user's call.

## Edge cases

- **Detached HEAD or shallow clone**: warn that history may be incomplete (`git rev-parse --is-shallow-repository`); offer `git fetch --unshallow --tags`.
- **No conventional commits at all**: fall back to keyword inference and tell the user the classification is best-effort and worth a quick review.
- **Monorepo / scoped release**: if the user names a path or package, filter with `git log <baseline>..HEAD -- <path>` and scope the version line accordingly.
- **Reverts**: if a commit and its `revert:` both appear in range, omit both.
