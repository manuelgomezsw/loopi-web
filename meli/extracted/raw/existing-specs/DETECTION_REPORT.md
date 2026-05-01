# Detection Report

**Generated**: 2026-04-30
**Repository**: loopi-web
**Working directory**: `/Users/mangomez/Repos/Manu/loopi/loopi-web/.claude/worktrees/recursing-snyder-75fdb0`

## Extraction Scope

- **Mode**: FULL EXTRACTION
- **Focus Component**: Full Repository

## Detected Frameworks

| Framework | Confidence | Files Found |
|-----------|------------|-------------|
| Meli SDD Kit | 🔴 Not detected | `meli/specs/` empty (created by this run); no prior extraction |
| OpenSpec / Spec-Kit / Kiro / Tessl | 🔴 Not detected | — |
| OpenAPI / Swagger | 🔴 Not detected | No `openapi.yaml` / `swagger.json` |
| ADR / RFC | 🔴 Not detected | No `docs/adr/` or `docs/rfc/` |
| Plain Docs (README) | 🟡 Medium | `README.md` (Angular CLI boilerplate, no architectural content) |
| Claude Code | 🟡 Medium | `.claude/` worktree present; no `CLAUDE.md` at repo root |
| Cursor / Codex / SpecStory | 🔴 Not detected | — |
| Fury / FuryMCP context | 🔴 Not applicable | No `.fury` file. Project deploys to Firebase Hosting, not Fury. |

## Selected Strategy

- **Strategy**: FULL
- **Rationale**: No pre-existing specs or framework conventions detected; only an Angular CLI boilerplate `README.md`. Full extraction from code is required.

## Detected Specs Summary

| Spec Type | Location | Last Modified |
|-----------|----------|---------------|
| (none) | — | — |

## Architecture Note

Despite the Firebase project (`loopi-c048d`), the application uses Firebase **only as a static hosting target**. Persistence is performed against an external REST API at:

- **dev**: `http://localhost:8080/api`
- **prod**: `https://loopi-dot-quotes-api-100.ue.r.appspot.com/api`

No Firebase Auth, Firestore, Storage, Functions or Realtime DB are used.

## Extraction History

| Date | Mode | Focus | Summary |
|------|------|-------|---------|
| 2026-04-30 | FULL | - | Initial extraction (Angular 20 SPA, ~30 REST endpoints, 2 services, 16 components) |

## Recommendations

1. **Adopt Meli SDD Kit workflow** for upcoming features (`/meli.start` → `/meli.spec` → `/meli.plan` → `/meli.build` → `/meli.finish`).
2. **Unify `Employee` model** — two distinct definitions exist (`employee.model.ts` session view vs `admin.model.ts` CRUD view).
3. **Resolve `employeeGuard`** — currently returns `true` unconditionally (`auth.guard.ts:49`).
4. **Add tests** — Karma + Jasmine are configured but no `.spec.ts` files exist in `src/app/`.
5. **Add `dataGroups` to `ngsw-config.json`** if API caching becomes desirable.
