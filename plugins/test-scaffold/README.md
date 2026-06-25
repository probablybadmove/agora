# test-scaffold

Scaffold an idiomatic test file for any source file. The plugin reads your source, detects the project's test framework, and generates runnable test stubs that cover the public API and the edge cases that actually matter.

## What it does

- **Reads the source file** and extracts its public API (exported functions, classes, and methods) while ignoring private helpers.
- **Auto-detects the test framework** from your project — `vitest`, `jest`, `pytest`, or `go test` — by inspecting `package.json`, config files, `go.mod`, `pyproject.toml`, and friends. No guessing.
- **Picks the idiomatic test path** (`foo.test.ts`, `test_foo.py`, `foo_test.go`, `__tests__/`, `tests/`, …) and mirrors whatever layout your project already uses.
- **Generates real, runnable stubs** — happy paths plus edge cases (empty/zero inputs, boundaries, invalid arguments, error/throw paths, async resolve/reject) — with correct imports and concrete assertions. No bare `TODO` placeholders standing in for whole tests.
- **Never clobbers** an existing test file; it offers to append missing cases instead.

## Invocation

```
/test-scaffold:scaffold-test [path/to/source/file]
```

If you omit the path, it will ask which file to scaffold.

## Example

In a Vitest + TypeScript project:

```
/test-scaffold:scaffold-test src/lib/slugify.ts
```

Given `src/lib/slugify.ts`:

```ts
export function slugify(input: string, maxLength = 60): string { /* ... */ }
```

the skill detects Vitest (from `vitest` in `devDependencies`), then writes `src/lib/slugify.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('lowercases and hyphenates a basic string', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('returns an empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });

  it('strips non-alphanumeric characters', () => {
    expect(slugify('a@b#c')).toBe('a-b-c'); // TODO: confirm expected separator handling
  });

  it('truncates to maxLength', () => {
    const out = slugify('a'.repeat(100), 10);
    expect(out.length).toBeLessThanOrEqual(10);
  });
});
```

Then it tells you how to run it:

```
npx vitest run src/lib/slugify.test.ts
```

The same command on a `.go` file produces a table-driven `Test...` function; on a `.py` file, `pytest` functions with `pytest.raises` for error paths.

## Requirements

The skill uses `Read`, `Glob`, `Grep`, `Bash`, `Write`, and `Edit`. It runs only read-only detection commands and writes the new test file.

## License

MIT © [Gagan Singh](https://gagansingh.tech)
