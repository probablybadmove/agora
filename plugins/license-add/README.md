# license-add

Add an **SPDX-correct `LICENSE` file** to any project — with the right year, the right author, and matching package metadata — in one step.

## What it does

Invoke the skill and it will:

1. **Check for an existing license** first, so it never silently overwrites your `LICENSE`, `COPYING`, or `LICENCE` file.
2. **Resolve the license** to a clean SPDX identifier — `MIT`, `Apache-2.0`, `GPL-3.0`, or `BSD-3-Clause` — from your argument, your existing metadata, or a quick prompt (defaulting to MIT).
3. **Fill in the copyright line** using your project metadata or `git config user.name`, with the current year — no leftover `[year]` / `[fullname]` placeholders.
4. **Write the full, verbatim license text** to a root `LICENSE` file (the filename GitHub, npm, and most tooling detect).
5. **Update package metadata** to match — `package.json`, `pyproject.toml`, `Cargo.toml`, `composer.json`, `*.gemspec`, `*.csproj`, and more — so your project is internally consistent.

It also handles real-world edge cases: monorepos, mismatched metadata vs. license file, existing SPDX headers, and proprietary "all rights reserved" requests.

## How to invoke

```
/license-add:add-license [license]
```

The license argument is optional. If you omit it, the skill infers it from your project's metadata or asks you, defaulting to MIT.

## Examples

Add an MIT license, inferring the author from git/metadata:

```
/license-add:add-license MIT
```

Apply Apache-2.0 and sync `package.json`:

```
/license-add:add-license Apache-2.0
```

Let it figure out the right license for you:

```
/license-add:add-license
```

## Supported licenses

| SPDX id        | Type                | Notes                                        |
| -------------- | ------------------- | -------------------------------------------- |
| `MIT`          | Permissive          | Short, no patent grant. Most common default. |
| `Apache-2.0`   | Permissive          | Explicit patent grant; NOTICE handling.      |
| `BSD-3-Clause` | Permissive          | Includes a non-endorsement clause.           |
| `GPL-3.0`      | Strong copyleft     | Derivatives must also be GPL.                |

## License

MIT © [Gagan Singh](https://gagansingh.tech)
