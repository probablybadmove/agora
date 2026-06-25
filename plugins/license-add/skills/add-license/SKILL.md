---
description: Add an SPDX-correct LICENSE file to the project, filling in the year and author, and update package metadata (package.json, pyproject.toml, Cargo.toml, etc.) to match. Use when the user wants to license a repo, add a LICENSE, or change/standardize the project's license.
argument-hint: "[license id, e.g. MIT | Apache-2.0 | GPL-3.0 | BSD-3-Clause]"
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# Add a LICENSE file

You are adding a legally correct, SPDX-identified open-source license to the current project, then keeping the project's package metadata consistent with it.

The user's requested license (if any) is: **$ARGUMENTS**

Work through the steps below in order. Do not skip the discovery step — it prevents you from clobbering an existing license or guessing the wrong author.

## 1. Discover the current state

Run these checks before writing anything:

- Look for an existing license file at the repo root: `LICENSE`, `LICENSE.md`, `LICENSE.txt`, `COPYING`, or `LICENCE` (British spelling). Use Glob for `LICENSE*`, `LICENCE*`, `COPYING*`.
- If one already exists, **stop and report** what it is. Ask the user whether they want to replace it before overwriting. Never silently overwrite an existing license.
- Identify the project type and metadata files that may declare a license:
  - Node: `package.json` (`license` field)
  - Python: `pyproject.toml`, `setup.cfg`, `setup.py` (`license` / `classifiers`)
  - Rust: `Cargo.toml` (`license`)
  - Go: usually no metadata field — LICENSE file only
  - Ruby: `*.gemspec` (`spec.license`)
  - PHP: `composer.json` (`license`)
  - .NET: `*.csproj` (`PackageLicenseExpression`)
  - Elixir: `mix.exs` (`licenses:`)
  - Dart/Flutter: `pubspec.yaml`

## 2. Determine the license

Resolve the license to a single SPDX identifier (one of `MIT`, `Apache-2.0`, `GPL-3.0`, `BSD-3-Clause`):

1. If `$ARGUMENTS` names a license, use it. Normalize loose names: "mit" → `MIT`, "apache"/"apache 2" → `Apache-2.0`, "gpl"/"gplv3"/"gpl3" → `GPL-3.0`, "bsd"/"bsd3"/"bsd-3" → `BSD-3-Clause`.
2. Otherwise, infer from existing metadata — if `package.json`/`Cargo.toml`/etc. already has a `license` field, reuse that value and just generate the matching file.
3. If still unknown, briefly ask the user, defaulting to **MIT** as the most common permissive choice. Give a one-line tradeoff so they can decide:
   - **MIT** — short, permissive, no patent grant. Most popular default.
   - **Apache-2.0** — permissive with an explicit patent grant and NOTICE handling. Good for projects with patent concerns.
   - **BSD-3-Clause** — permissive, includes a non-endorsement clause.
   - **GPL-3.0** — strong copyleft; derivatives must also be GPL. Choose deliberately, not by accident.

Do not invent a fifth license — if the user asks for something outside this set (e.g. MPL, LGPL, Unlicense), tell them this skill covers the four above and ask them to confirm one of them or provide the exact text.

## 3. Determine year and author

- **Year**: current calendar year. If an existing copyright line is being preserved, keep a range like `2021-<currentYear>`.
- **Author / copyright holder**, resolved in this priority order:
  1. An author/name in project metadata (`package.json` `author`, `pyproject.toml` `authors`, `Cargo.toml` `authors`, gemspec `authors`).
  2. `git config user.name` (run `git config user.name` and `git config user.email`).
  3. Ask the user.
- For Apache-2.0 and BSD-3-Clause the holder name appears inside the license body too — make sure it is filled in everywhere, with **no leftover placeholders** like `[year]`, `[fullname]`, `<name of author>`, or `[yyyy]`.

## 4. Write the LICENSE file

Create `LICENSE` (no extension — this is what GitHub, npm, and most tooling detect) at the repo root with the **full, verbatim** license text for the chosen SPDX id, substituting year and holder. Use the canonical text:

- **MIT** — the standard MIT template with `Copyright (c) <year> <holder>`.
- **Apache-2.0** — the full Apache License 2.0 text (the complete ~200-line license, ending with the appendix). Put the project copyright in the appendix boilerplate. Also recommend adding a short SPDX header (`// SPDX-License-Identifier: Apache-2.0`) to source files and, if the project distributes binaries, a `NOTICE` file.
- **GPL-3.0** — the full GNU GPL v3 text, followed by the "How to Apply" copyright/notice block filled in with the project name and holder.
- **BSD-3-Clause** — the 3-clause template with `Copyright (c) <year> <holder>` and the holder substituted into clause 3.

Reproduce the official text exactly — these are well-known fixed strings. Do not paraphrase, summarize, or trim clauses; a modified license text is legally meaningless. If you are not fully certain of the verbatim Apache-2.0 or GPL-3.0 body, fetch it from the SPDX/official source rather than reconstructing it from memory.

## 5. Update package metadata

For every metadata file found in step 1, set the license to the matching SPDX expression and keep formatting/indentation intact:

- `package.json`: set `"license": "<SPDX>"`. Remove any deprecated `"licenses": [...]` array. Preserve key ordering and trailing newline.
- `pyproject.toml`: set `license = "<SPDX>"` (PEP 639 string form) or keep the existing table form if the project uses `[project] license = { file = "LICENSE" }`. Update SPDX classifiers if present.
- `Cargo.toml`: set `license = "<SPDX>"` under `[package]`.
- `composer.json`: set `"license": "<SPDX>"`.
- `*.gemspec`: set `spec.license = "<SPDX>"`.
- `*.csproj`: set `<PackageLicenseExpression>` (and drop a deprecated `<PackageLicenseUrl>` if present).

If a metadata file already declared a *different* license than the one being applied, flag the mismatch to the user and update it to match the new LICENSE file so the project is internally consistent.

## 6. Verify and report

- Re-read the written `LICENSE` and confirm there are no remaining bracketed placeholders (`grep -nE '\[(year|yyyy|fullname|name)|<name|<year' LICENSE` should return nothing).
- Confirm metadata files are still valid: for `package.json`/`composer.json` validate JSON (e.g. `node -e "require('./package.json')"` or `python3 -m json.tool package.json`); for TOML files do a quick parse if a tool is available.
- Summarize for the user: the SPDX id chosen, the copyright line written, the LICENSE path, and every metadata file you updated.

## Edge cases

- **Monorepo / multiple packages**: ask whether the license applies to the whole repo (one root LICENSE) or per-package. Default to a single root LICENSE unless sub-packages already declare their own.
- **No git, no metadata, no answer**: do not fabricate an author. Ask once; if the user declines, use a sensible placeholder only with their explicit consent.
- **Proprietary / "all rights reserved"**: this is outside the four SPDX options — tell the user and let them confirm before proceeding.
- **Existing SPDX headers in source files**: if files already carry `SPDX-License-Identifier:` comments for a different license, point this out rather than mass-editing them without confirmation.
