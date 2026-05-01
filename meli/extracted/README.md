# meli/extracted/ — Índice de extracción

**Fecha**: 2026-04-30
**Modo**: FULL EXTRACTION
**Repositorio**: loopi-web (Angular 20 SPA + Firebase Hosting + API REST externa)
**Estrategia**: FULL (sin specs previas ni FuryMCP aplicable)

## Archivos generados

| Archivo | Fase | Descripción |
|---|---|---|
| `raw/README.md` | 0-1 | Metadatos de fuentes usadas |
| `raw/existing-specs/DETECTION_REPORT.md` | 0 | Frameworks detectados; ninguno encontrado |
| `raw/code-analysis/architecture/overview.md` | 1 | Stack, bootstrap, routing, guards, env |
| `raw/code-analysis/architecture/use-cases.md` | 1 | 17 UC derivados de rutas + componentes |
| `raw/code-analysis/architecture/patterns.md` | 1 | 15 patrones con evidencia file:line |
| `raw/code-analysis/api-specs/services.md` | 1 | 4 servicios, todos los métodos, ~30 endpoints |
| `raw/code-analysis/api-specs/components.md` | 1 | 16 componentes con propósito, signals, servicios |
| `raw/code-analysis/database/models.md` | 1 | Todos los modelos TypeScript con campos y relaciones |
| `raw/code-analysis/deployment/firebase.md` | 1 | Hosting + Service Worker + entornos |
| `DOCUMENTATION_GAPS.md` | 2 | Brechas de cobertura y backend sin OpenAPI |
| `DISCREPANCIES_REPORT.md` | 3 | 10 discrepancias (1 crítica, 7 medias, 2 info) |
| `functional-spec.md` | 4 | Especificación funcional completa en Español |
| `technical-spec.md` | 4 | Especificación técnica completa en Español |
| `PATTERNS.md` | 5 | 15 patrones reutilizables con ejemplos |

## Promovido a `meli/specs/` en Phase 7

- `functional-spec.md` → `meli/specs/functional-spec.md`
- `technical-spec.md` → `meli/specs/technical-spec.md`
- `PATTERNS.md` → `meli/PATTERNS.md`

## Hallazgos principales

- **App**: Gestión de inventarios de cafetería. Dos roles: empleado (flujo 7 pasos) y admin (backoffice CRUD).
- **Stack**: Angular 20 standalone, Signals, TypeScript 5.8, Tailwind 4, Angular CDK (solo DragDrop).
- **Backend**: API REST externa en Google App Engine (~30 endpoints). Firebase solo como CDN.
- **Deuda crítica**: Dos interfaces `Employee` incompatibles (D-01). Ver `DISCREPANCIES_REPORT.md`.
- **Sin tests**: Karma+Jasmine configurados pero sin `.spec.ts`.
- **Sin OpenAPI**: Contratos de backend inferidos solo desde el frontend.
