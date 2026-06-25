# conventional-commits

Generate a clean [Conventional Commits](https://www.conventionalcommits.org/) message straight from your **staged** git diff — then commit it in one go.

## What it does

When invoked, the skill:

1. Reads your staged changes (`git status`, `git diff --cached`) — and tells you if nothing is staged or if files are only partially staged.
2. Classifies the change into the right type (`feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`).
3. Infers a sensible `scope` from the changed paths, matching your repo's existing commit style.
4. **Detects breaking changes** (removed exports, changed signatures, schema drops, changed defaults) and marks them with both `!` and a `BREAKING CHANGE:` footer.
5. Writes a spec-compliant message: imperative summary (≤ 72 chars), an explanatory body, and footers (issue refs, breaking changes).
6. Shows you the message and **offers to run the commit** for you — never pushing, amending, or bypassing hooks without your say-so.

## Invocation

```
/conventional-commits:commit
```

Pass optional context — a scope hint, an issue number, or extra detail:

```
/conventional-commits:commit auth, closes #214
```

## Example

After staging a new login feature plus a renamed public export:

```bash
git add src/auth/login.ts src/auth/index.ts
```

```
/conventional-commits:commit
```

Produces a message like:

```
feat(auth)!: add passwordless email login

Introduce a magic-link login flow alongside password auth. Tokens
are single-use and expire after 10 minutes.

- add sendMagicLink() and verifyMagicLink()
- rename the exported `authenticate` to `authenticateWithPassword`

BREAKING CHANGE: the `authenticate` export was renamed to
`authenticateWithPassword`. Update imports accordingly.

Closes #214
```

…then asks whether to commit, edit, or cancel. On confirmation it runs `git commit` and shows the result.

## Notes

- Only **staged** changes are considered, so review what you `git add` first.
- If the diff mixes unrelated concerns, the skill suggests splitting it into separate commits.
- Pre-commit and commit-msg hooks are respected; failures are surfaced verbatim.

## License

MIT © [Gagan Singh](https://gagansingh.tech)
