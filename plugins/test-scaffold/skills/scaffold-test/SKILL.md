---
description: Scaffold an idiomatic test file for a given source file, auto-detecting the project's test framework (jest, vitest, pytest, or go test) and generating stubs that cover the public API and edge cases. Use when the user asks to "scaffold tests", "create a test file", "stub out tests", or "write tests for <file>".
argument-hint: "[path/to/source/file]"
allowed-tools: Read, Glob, Grep, Bash, Write, Edit
---

# Scaffold Test File

Generate a high-quality, idiomatic test file for the source file at `$ARGUMENTS`. The goal is a runnable, well-structured test scaffold that a developer can immediately fill in — not a vague placeholder.

If `$ARGUMENTS` is empty, ask the user which source file to scaffold tests for, then stop and wait.

## Step 1 — Read and understand the source file

1. Read the file at `$ARGUMENTS`. If it does not exist, report the error and stop.
2. Identify the **public API** — the things consumers import and call:
   - JS/TS: named `export`, `export default`, `export const fn = ...`, exported classes. Ignore non-exported helpers.
   - Python: top-level `def`/`class` not prefixed with `_`; respect `__all__` if present.
   - Go: identifiers starting with an uppercase letter (exported) in the package.
3. For each public symbol, note: its parameters and types, return type, whether it is async/returns a Promise, whether it throws/raises, and any obvious branches (early returns, guard clauses, error paths).

## Step 2 — Detect the test framework

Detect, do not assume. Check in this order and pick the first match:

1. **Go** — the source file ends in `.go`, or a `go.mod` exists at the project root. Use `go test` with the standard `testing` package (table-driven tests).
2. **JS / TS** — read the nearest `package.json` (search upward from the source file):
   - `vitest` in `dependencies`/`devDependencies`, or a `vitest.config.*` / `vite.config.*` file present -> **vitest**.
   - `jest` in deps, a `jest` key in `package.json`, or a `jest.config.*` file -> **jest**.
   - Neither but it's clearly JS/TS -> default to **vitest** for ESM/`"type": "module"` projects, otherwise **jest**. State the assumption.
   - Note TypeScript vs JavaScript from the file extension (`.ts`/`.tsx` vs `.js`/`.jsx`).
3. **Python** — a `pyproject.toml`, `setup.cfg`, `pytest.ini`, `tox.ini`, or `requirements*.txt` mentioning pytest -> **pytest**. Default Python testing to **pytest** even if not pinned, and say so.

Run lightweight checks with Bash/Grep/Glob (e.g. `grep -l vitest package.json`, `ls go.mod`) rather than guessing.

## Step 3 — Compute the test file path

Follow the framework's idiomatic convention and mirror the existing test layout if the project already has tests (check first with Glob):

- **vitest / jest**: `foo.ts` -> `foo.test.ts` next to the source, unless the project uses a `__tests__/` directory or a `test/`/`tests/` folder — match the prevailing pattern. Preserve the `.ts`/`.js`/`.tsx` extension.
- **pytest**: `module.py` -> `test_module.py`, placed beside the source or under a top-level `tests/` directory if one exists. Mirror the package path under `tests/` when that is the established pattern.
- **go test**: `foo.go` -> `foo_test.go` in the same directory and same package (or `package foo_test` for black-box tests if the project favors that).

If a test file already exists at the target path, do **not** overwrite it. Read it and offer to append missing cases instead.

## Step 4 — Generate idiomatic test stubs

Create the test file with correct imports and one test block per public symbol. For each symbol include:

- A **happy-path** case with a realistic input and a concrete `expect`/`assert` (use a clearly-marked placeholder value only where the correct value genuinely cannot be inferred).
- **Edge cases** relevant to the signature, such as:
  - Empty/zero inputs: `""`, `[]`, `{}`, `0`, `None`/`null`/`nil`.
  - Boundary values (min/max, off-by-one around length checks).
  - Invalid input / type errors where the function validates arguments.
  - Error paths: assert that it throws/raises/returns an error. Use `expect(() => fn()).toThrow()` (jest/vitest), `with pytest.raises(...)` (pytest), or check the returned `err` (go).
  - Async behavior: `await` the call and test both resolve and reject paths for Promises/coroutines.
- A short `// TODO: assert ...` only when the expected value is truly unknowable from the source — never as the sole content of a test.

Framework-specific shape:

- **vitest**: `import { describe, it, expect } from 'vitest'` and import the symbols under test. Use `describe`/`it`. Add `beforeEach` only if setup is clearly needed.
- **jest**: same structure without the vitest import (globals are available). Use `describe`/`test`.
- **pytest**: plain `def test_<symbol>_<case>():` functions, group with classes only if the source is class-based. Use `pytest.raises`, `pytest.mark.parametrize` for table-style cases, and fixtures where natural.
- **go test**: `func TestXxx(t *testing.T)` with a **table-driven** structure (`tests := []struct{ name string; ... }{...}` then `t.Run(tt.name, ...)`). Use `t.Errorf`/`t.Fatalf`; reach for `testify` only if it's already a project dependency.

Use the real imported names and the real relative import path from the test file back to the source. Match the project's quote style, semicolons, and indentation if discernible.

## Step 5 — Write the file and report

1. Write the test file to the path from Step 3 with the Write tool.
2. Tell the user, concisely:
   - The detected framework and why.
   - The path of the file created.
   - The exact command to run it (e.g. `npx vitest run path/to/foo.test.ts`, `npx jest path`, `pytest path/test_foo.py`, `go test ./...`).
   - Which symbols got coverage and which edge cases are stubbed but need the expected value filled in.

Keep the generated tests minimal but real: every test should compile/parse and run, even if some assertions are intentionally marked for the developer to complete.
