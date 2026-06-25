# dockerize

Generate a **production-ready, multi-stage Dockerfile** and a matching
**`.dockerignore`** tailored to your project's actual stack — using small base
images and a non-root runtime user.

This plugin doesn't hand you a generic boilerplate. It reads your real manifest
files (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, …),
figures out your package manager, build step, listen port, and start command,
then writes a Dockerfile that is small, cached well, and safe to ship.

## What it does

- **Detects your stack** — Node/Bun/Deno, Python, Go, Rust, Java/Kotlin, Ruby,
  PHP, .NET, Elixir — from the files in your repo.
- **Writes a multi-stage Dockerfile** that keeps compilers and dev dependencies
  out of the final image.
- **Uses small, pinned base images** — distroless/scratch for static binaries,
  `-slim` otherwise, with the musl/alpine caveats handled.
- **Runs as non-root** (dedicated `10001:10001` user or distroless `nonroot`).
- **Optimizes layer caching** — manifests + lockfile copied first, source after,
  with BuildKit cache mounts.
- **Reproducible installs** — `npm ci`, `--frozen-lockfile`, `--locked`,
  `--no-cache-dir`.
- **Generates a `.dockerignore`** so the build context stays tiny and no
  `.env`/secrets leak into the image.
- **Offers to build it** with `docker build` to verify it actually works.

## Invoke

```
/dockerize:dockerize
```

Optionally pass a hint — a subdirectory, a language override, or a run command:

```
/dockerize:dockerize ./services/api
/dockerize:dockerize go
```

## Example

In a Next.js repo:

```
/dockerize:dockerize
```

The skill detects `Node 20, pnpm, Next.js (standalone output), port 3000`, then
writes a `Dockerfile` with a `deps` → `build` → `runtime` pipeline on
`node:20-slim`, copying only the standalone output and production
`node_modules`, running as a non-root user on port 3000 — plus a `.dockerignore`
excluding `node_modules`, `.next/cache`, `.git`, and `.env*`. Finally it offers:

```
docker build -t myapp:test .
docker run -p 3000:3000 myapp:test
```

## License

MIT © [Gagan Singh](https://gagansingh.tech)
