---
description: Draft a clear, well-structured pull-request title and description from the diff between the current branch and its base. Use when the user wants to open a PR, write a PR description, or summarize their branch's changes for review.
argument-hint: "[base-branch] (optional, e.g. main or develop)"
allowed-tools: Bash, Read
---

# Author a Pull Request

You are drafting a pull-request title and description for the current branch. Be accurate, concise, and grounded entirely in the actual diff — never invent changes, tests, or behavior that the code does not show.

`$ARGUMENTS` may contain an explicit base branch (e.g. `main`, `develop`, `release/2.0`). If it is empty, detect the base automatically.

## Step 1 — Gather repository context

Run these commands and read the output before writing anything. Do not stop on the first non-empty result; collect them all so you have full context.

1. Confirm you are in a git repo and capture the current branch:
   ```
   git rev-parse --is-inside-work-tree
   git rev-parse --abbrev-ref HEAD
   ```
2. Determine the base branch:
   - If `$ARGUMENTS` is non-empty, use it verbatim as the base.
   - Otherwise, try in order until one resolves:
     ```
     git symbolic-ref --quiet refs/remotes/origin/HEAD      # e.g. origin/main
     git rev-parse --verify --quiet origin/main
     git rev-parse --verify --quiet origin/master
     git rev-parse --verify --quiet main
     git rev-parse --verify --quiet master
     git rev-parse --verify --quiet develop
     ```
   - Strip a leading `refs/remotes/` / `origin/` only for display; keep the full ref for diffing.
3. Find the merge base so you compare only this branch's work, not unrelated commits already on base:
   ```
   git merge-base HEAD <base>
   ```
   Use the merge-base SHA (call it `<mb>`) for all diffs below.

## Step 2 — Inspect the actual changes

Run and read each of these:

```
git log --no-merges --pretty=format:'%h %s' <mb>..HEAD     # commits in this branch
git diff --stat <mb>..HEAD                                  # files + churn overview
git diff <mb>..HEAD                                         # the full diff
```

Also account for work that is not yet committed, since the user may be about to commit it:
```
git status --porcelain
git diff <mb>..HEAD --name-status
```

If the diff is very large, prioritize reading: changed function/class signatures, new or deleted files, config/migration/dependency files (`package.json`, lockfiles, `requirements.txt`, schema/migration dirs, CI files), and anything touching public APIs or security-sensitive code. Use `Read` on a few key changed files if the unified diff alone is ambiguous.

## Step 3 — Detect a PR template (optional)

Check whether the repo ships a PR template and prefer its structure if present:
```
git ls-files | grep -iE 'pull_request_template|PULL_REQUEST_TEMPLATE'
```
If one exists, read it and fill its sections with real content. Otherwise use the default structure below.

## Step 4 — Write the title

Produce ONE line, under ~70 characters, imperative mood, no trailing period.

- Mirror the repo's existing convention. Inspect recent history to decide:
  ```
  git log --oneline -20
  ```
  If commits use Conventional Commits (`feat:`, `fix:`, `chore:`…), match that style and pick the type from the dominant change. If they reference issue/ticket keys (e.g. `JIRA-123`, `#456`), include the key when it is evident from branch name or commit messages.
- The title should describe the net user- or developer-visible change, not the largest file.

Examples:
- `feat(auth): add refresh-token rotation`
- `fix: prevent race condition in cache eviction`
- `Refactor payment retry logic into PaymentRetryPolicy`

## Step 5 — Write the description

Use Markdown with this structure (or the repo template's sections):

```markdown
## Summary
<2–4 sentences: what changed and WHY. Lead with the motivation/problem, then the approach. No fluff.>

## Changes
- <Grouped, specific bullets of what changed. Group by area/module, not by file.>
- <Call out new dependencies, config/env changes, migrations, and breaking changes explicitly.>
- <Note anything intentionally deferred or out of scope.>

## Test plan
- [ ] <Concrete steps a reviewer can follow to verify, derived from the actual changes.>
- [ ] <Reference any automated tests added/updated, with how to run them, e.g. `npm test path/to/spec`.>
- [ ] <Edge cases and failure modes you considered.>

## Checklist
- [ ] Code builds and lint passes
- [ ] Tests added/updated and passing
- [ ] Docs / comments updated where needed
- [ ] No secrets, debug logs, or commented-out code left behind
- [ ] Breaking changes documented and migration noted (or N/A)
```

Rules for quality:
- Ground every bullet in the diff. If you cannot point to a hunk that justifies a claim, do not write it.
- If the diff adds tests, say which behaviors they cover. If it adds NO tests, say so plainly in the test plan and suggest the verification a reviewer should do manually — do not pretend tests exist.
- Flag risk explicitly: schema/data migrations, auth/permission changes, public API or wire-format changes, performance-sensitive paths, and anything that touches money, security, or user data. Put these near the top of `## Changes`.
- Keep it readable: prefer short bullets over paragraphs; link related issues if the branch name or commits reveal them.

## Step 6 — Present and offer to ship

Output the final title and description in a single fenced block the user can copy. Then offer next steps:

- If the `gh` CLI is available (`gh --version`) and the user wants to create the PR, propose the exact command and run it only if they confirm:
  ```
  gh pr create --base <base> --title "<title>" --body "<description>"
  ```
  Prefer writing the body to a temp file and passing `--body-file` when the description contains backticks or special characters.
- If `gh` is unavailable, just hand back the title and body for manual paste.

## Edge cases

- **Not a git repo:** stop and tell the user.
- **No commits / empty diff vs base:** report that the branch has no changes against `<base>` and ask whether they meant a different base or still have uncommitted work to commit first.
- **On the base branch itself:** warn that HEAD equals the base; ask which feature branch to compare.
- **Detached HEAD:** use the SHA as the branch label and proceed.
- **Huge diff (generated code, lockfiles, vendored deps):** summarize bulk/generated changes in one line (e.g. "regenerated lockfile", "vendored dependency bump") instead of enumerating every line.
- **Merge commits in range:** keep `--no-merges` for the commit list so the summary reflects authored work.
