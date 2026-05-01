# Raw Extraction Sources

**Date**: 2026-04-30
**Mode**: FULL EXTRACTION
**Source app**: loopi-web (Angular 20 + Firebase Hosting + external REST API)

## Sources Used

| Source | Status | Location |
|--------|--------|----------|
| **Code analysis** | ✅ Complete | `code-analysis/` |
| **Existing specs** | ⚠️ None detected | `existing-specs/DETECTION_REPORT.md` |
| **FuryMCP** | ❌ Not applicable | App is not registered in Fury (no `.fury` file) |
| **MeliSystemMCP** | ❌ Not applicable | Not a Mercado Libre internal app |

## Code Analysis Outputs

- `code-analysis/architecture/overview.md` — Stack, bootstrap, routing, PWA, Firebase hosting, env vars
- `code-analysis/architecture/use-cases.md` — 17 use cases derived from routes/components
- `code-analysis/architecture/patterns.md` — 15 detected patterns with file:line evidence
- `code-analysis/api-specs/services.md` — All 4 services with every method (~30 endpoints)
- `code-analysis/api-specs/components.md` — All 16 feature components
- `code-analysis/database/models.md` — All TypeScript models, fields, enums (frontend-only)
- `code-analysis/deployment/firebase.md` — Hosting + service worker configuration

## Notes

- All persistence is done against an external REST API; Firebase is used only as a hosting target.
- No `.spec.ts` test files were found.
- Service worker has no `dataGroups` (no API caching).
