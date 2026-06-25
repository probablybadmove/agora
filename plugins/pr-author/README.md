# pr-author

Draft a clear, review-ready pull-request title and description straight from your branch's diff — no more staring at an empty PR box.

`pr-author` inspects the diff between your current branch and its base, then writes a PR with a real **summary**, a grouped **changes** list, a concrete **test plan**, and a **checklist**. It grounds everything in the actual diff (no invented tests or features), matches your repo's commit conventions, respects an existing `PULL_REQUEST_TEMPLATE`, and can open the PR for you via `gh`.

## What it does

- Detects the base branch automatically (`origin/HEAD`, `main`, `master`, `develop`) or uses one you pass in.
- Diffs against the **merge base** so you see only this branch's work, not unrelated commits already on base.
- Reads commits, file stats, and the full diff — including uncommitted changes — to summarize accurately.
- Writes an imperative, convention-matching title and a structured Markdown description.
- Flags risk explicitly: migrations, auth changes, public API / breaking changes, and security-sensitive code.
- Offers to create the PR with `gh pr create` when the GitHub CLI is available.

## Usage

Invoke the skill from Claude Code:

```
/pr-author:pr
```

Optionally pass an explicit base branch:

```
/pr-author:pr develop
```

## Example

On a branch `feat/refresh-token-rotation`:

```
/pr-author:pr main
```

Produces something like:

```markdown
feat(auth): add refresh-token rotation

## Summary
Long-lived refresh tokens were never rotated, so a leaked token stayed
valid until expiry. This rotates the refresh token on every use and
revokes the prior one, shrinking the window of a compromised token.

## Changes
- Rotate + revoke refresh tokens in `AuthService.refresh()`
- Add `revoked_at` column and migration `0042_token_revocation`
- Return a new refresh token in the `/auth/refresh` response

## Test plan
- [ ] `npm test auth/refresh.spec.ts` — covers rotation + reuse rejection
- [ ] Manually: log in, refresh twice, confirm the first refresh token is rejected

## Checklist
- [ ] Code builds and lint passes
- [ ] Tests added/updated and passing
- [ ] Docs / comments updated where needed
- [ ] No secrets, debug logs, or commented-out code left behind
- [ ] Breaking changes documented and migration noted (or N/A)
```

## Requirements

- A git repository with a base branch to compare against.
- Optional: the [GitHub CLI](https://cli.github.com/) (`gh`) to create the PR directly.

## License

MIT © [Gagan Singh](https://gagansingh.tech)
