# changelog-smith

Turn your git history into a polished [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) entry — automatically grouped, deduplicated, and versioned with semver.

`changelog-smith` reads every commit since your last release tag, classifies each one into the right section (**Added / Changed / Deprecated / Removed / Fixed / Security**), rewrites terse commit subjects into clear user-facing notes, recommends the next semantic version, and writes the result into `CHANGELOG.md` — creating the file if it doesn't exist and preserving existing released entries if it does.

## What it does

- Finds the baseline with `git describe --tags` (or the full history if there are no tags yet).
- Collects and classifies commits, honoring Conventional Commit prefixes (`feat:`, `fix:`, `feat!:`, `BREAKING CHANGE:`) and falling back to keyword inference otherwise.
- Filters out noise (`chore:`, `ci:`, `test:`, merge commits, version bumps) and squashes duplicates and revert pairs.
- Recommends the next version: **major** for breaking changes/removals, **minor** for new features, **patch** for fixes only (with pre-1.0.0 softening).
- Inserts the new entry under `## [Unreleased]`, above the previous release, and refreshes the comparison links at the bottom of the file.
- Suggests the matching `git tag` command but never commits or tags for you.

## Invocation

```
/changelog-smith:changelog [version|major|minor|patch]
```

The argument is optional:

- `/changelog-smith:changelog` — analyze commits and **recommend** the version bump.
- `/changelog-smith:changelog minor` — force a minor bump.
- `/changelog-smith:changelog 2.1.0` — use an exact version.

## Example

You've merged a new export feature and a couple of bug fixes since `v1.2.0`:

```
/changelog-smith:changelog
```

changelog-smith inspects `v1.2.0..HEAD`, recommends **1.3.0** (a feature was added, nothing broke), and prepends to `CHANGELOG.md`:

```markdown
## [1.3.0] - 2026-06-25

### Added
- CSV export for reports via the `--format csv` flag. (#142)

### Fixed
- Pagination no longer skips the last page of results. (#139)
- Timezone offsets are now applied consistently in the dashboard. (#145)
```

Then it hands you the release command to run when you're ready:

```bash
git tag -a v1.3.0 -m "Release 1.3.0"
```

## Requirements

- A git repository with commit history (tags optional but recommended).
- Works best with [Conventional Commits](https://www.conventionalcommits.org/), but degrades gracefully to keyword-based classification.

## License

MIT © [Gagan Singh](https://gagansingh.tech)
