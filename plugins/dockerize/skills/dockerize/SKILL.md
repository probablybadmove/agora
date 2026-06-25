---
description: Generate a production-ready multi-stage Dockerfile and matching .dockerignore tailored to the detected stack (Node, Python, Go, Rust, Java, Ruby, etc.), using small base images and a non-root runtime user. Use when the user asks to dockerize, containerize, write a Dockerfile, or set up Docker for a project.
argument-hint: "[optional: path, language, or run command e.g. 'go' or './services/api']"
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Dockerize: production-ready multi-stage Dockerfile + .dockerignore

You generate a **secure, small, production-grade** Dockerfile and a matching
`.dockerignore` for the current project. Do not output a generic boilerplate file —
detect the real stack and tailor every line to it.

`$ARGUMENTS` may contain a hint: a target directory (e.g. `./services/api`), a
language override (e.g. `python`, `go`), or a run command. If it names a
subdirectory, treat that as the project root for detection and write the
`Dockerfile` there. If empty, use the current working directory.

## Step 1 — Detect the stack

Inspect the project root (or `$ARGUMENTS` path). Do NOT guess — read the actual
manifest files. Use Glob/Grep/Read:

- **Node / Bun / Deno**: `package.json`, `package-lock.json`, `pnpm-lock.yaml`,
  `yarn.lock`, `bun.lockb`, `deno.json`. Read `package.json` for: `engines.node`,
  the `scripts` (`build`, `start`), `main`, `type`, and whether it's a framework
  (Next.js, Vite, NestJS, Express). Detect the package manager from the lockfile.
- **Python**: `pyproject.toml`, `requirements.txt`, `poetry.lock`, `uv.lock`,
  `Pipfile`, `setup.py`. Detect uv / poetry / pip. Look for `gunicorn`,
  `uvicorn`, `fastapi`, `flask`, `django` to decide the start command.
- **Go**: `go.mod` (read the `go` version line and module path), `go.sum`,
  presence of `main.go` / `cmd/`.
- **Rust**: `Cargo.toml`, `Cargo.lock` — read the binary name from `[[bin]]` or
  `[package].name`.
- **Java / Kotlin**: `pom.xml` (Maven) or `build.gradle(.kts)` (Gradle); is it
  Spring Boot?
- **Ruby**: `Gemfile`, `Gemfile.lock`, Rails (`config/application.rb`).
- **PHP**: `composer.json`. **.NET**: `*.csproj`. **Elixir**: `mix.exs`.

Also detect: the **port** the app listens on (grep for `listen`, `PORT`,
`EXPOSE`, framework defaults), and whether there's a **build step** vs. a pure
interpreted runtime. If you cannot determine the start command or port with
confidence, ask the user one concise question rather than guessing.

State your findings in one short sentence (e.g. "Detected: Node 20, pnpm,
Next.js standalone, port 3000") before writing files.

## Step 2 — Write the Dockerfile

Always apply these **non-negotiable** rules:

1. **Multi-stage build.** A `builder`/`deps` stage that installs toolchains and
   compiles, and a minimal `runtime` stage that copies only the artifacts. The
   final image must not contain compilers, dev dependencies, or build caches.
2. **Small, pinned base images.** Pin a major version tag (and prefer digests if
   the user wants maximum reproducibility). Prefer in this order where viable:
   `distroless` or `scratch` (for static Go/Rust binaries) → `-slim` →
   `-alpine` (note the musl caveat for native Python/Node addons; use `-slim`
   over alpine when native modules are involved).
3. **Non-root runtime.** Create a dedicated user/group (uid:gid `10001:10001`)
   and `USER` it before `CMD`. For distroless use `nonroot`. Never run as root.
4. **Layer caching.** Copy only the dependency manifests + lockfiles first, run
   the install, THEN copy the source. This keeps `npm ci` / `go mod download`
   cached when only source changes.
5. **Reproducible installs.** `npm ci` (not `npm install`), `pnpm install
   --frozen-lockfile`, `pip install --no-cache-dir -r requirements.txt` /
   `uv sync --frozen`, `go mod download` before `go build`,
   `cargo build --release --locked`.
6. **Use BuildKit cache mounts** where supported, e.g.
   `RUN --mount=type=cache,target=/root/.cache ...`, and add a top comment
   `# syntax=docker/dockerfile:1`.
7. **Drop privileges & harden runtime**: set `WORKDIR /app`, sensible
   `ENV` (`NODE_ENV=production`, `PYTHONUNBUFFERED=1`,
   `PYTHONDONTWRITEBYTECODE=1`), `EXPOSE` the real port, and use the **exec
   form** of `CMD` (JSON array) so signals propagate. Add a `HEALTHCHECK` when a
   sensible endpoint/command exists.
8. **tini / signal handling** for Node when the process doesn't reap children
   (e.g. `--init` is documented in a comment, or `tini` is added).

### Per-stack templates (adapt, don't paste blindly)

- **Static Go binary** → builder on `golang:1.x` with
  `CGO_ENABLED=0 go build -ldflags="-s -w"`, runtime on
  `gcr.io/distroless/static-debian12:nonroot` or `scratch` (copy CA certs).
- **Node app** → `deps` stage with `npm ci`, a `build` stage running the build
  script, runtime on `node:20-slim` copying `node_modules` (prod only via
  `npm ci --omit=dev`) + build output; for Next.js use the `standalone` output.
- **Python app** → builder installs into a venv (`/opt/venv`) or uses
  `uv`/`pip --target`, runtime on `python:3.x-slim` copying the venv; run under
  `gunicorn`/`uvicorn` with a non-root user.
- **Rust** → `cargo build --release --locked` in builder, runtime on
  distroless/static or `debian:bookworm-slim`.
- **Java/Spring** → build the jar (Maven/Gradle) in builder, runtime on a JRE
  (`eclipse-temurin:21-jre`) or use jlink/distroless java; run the jar as
  non-root.

If a `Dockerfile` already exists, do not silently overwrite it. Show the user
your proposed version and ask whether to replace it, write `Dockerfile.new`, or
diff against the existing one.

## Step 3 — Write the .dockerignore

Create a `.dockerignore` next to the Dockerfile so build context stays tiny and
no secrets leak into the image. Always include the universal entries plus the
stack-specific ones:

- Universal: `.git`, `.gitignore`, `*.md` (keep if needed at runtime),
  `.env`, `.env.*`, `*.log`, `.DS_Store`, `Dockerfile*`, `.dockerignore`,
  `.github`, `.vscode`, `.idea`, `tmp/`, `coverage/`, test artifacts, CI config.
- Node: `node_modules`, `npm-debug.log`, `.next/cache`, `dist` (if rebuilt).
- Python: `__pycache__`, `*.pyc`, `.venv`, `venv`, `.pytest_cache`, `.mypy_cache`.
- Go: `vendor/` only if you rely on module download; otherwise keep.
- Rust: `target/`. Java: `target/`, `build/`, `.gradle`.

Never ignore the lockfile or the dependency manifest — they must be in context.

## Step 4 — Verify and explain

After writing the files:

1. If Docker is available (`docker --version` succeeds), offer to run
   `docker build -t <name>:test .` to validate. If BuildKit syntax is used,
   ensure `DOCKER_BUILDKIT=1` (default on modern Docker).
2. Print a short summary: detected stack, chosen base image(s), final user,
   exposed port, and the run command, e.g.
   `docker run -p 3000:3000 <name>:test`.
3. Mention the approximate expected image size class and one concrete next step
   (e.g. "scan with `docker scout cves` or `trivy image`").

Be concise. Produce real, runnable files — no placeholders, no `TODO`, no
commented-out "fill this in" lines. Every instruction in the Dockerfile must be
justified by something you actually detected in the project.
