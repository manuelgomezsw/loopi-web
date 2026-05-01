# PROJECT.md

**Project**: loopi-web
**Type**: Frontend Web Application
**Framework**: Angular 20 + Tailwind CSS 4 + Firebase Hosting
**Created**: 2026-04-30

## Language

```yaml
language:
  specs: es      # Spanish (Español) — for functional + technical specs
  code: en       # Code, identifiers, technical terms in English
```

All specifications under `meli/specs/` and `meli/wip/` MUST be written in **Spanish (Español)**.
Technical terms (API, REST, CRUD, component, service, etc.) stay in English.

## Conventions

- **Stack**: Angular 20 (standalone components), TypeScript 5.8, RxJS 7.8, Tailwind 4
- **Build**: `ng build` (output to `dist/`)
- **Dev**: `ng serve` (http://localhost:4200)
- **Tests**: Karma + Jasmine (`ng test`)
- **Hosting**: Firebase Hosting (see `firebase.json`, `.firebaserc`)
- **PWA**: Service Worker enabled (`ngsw-config.json`)

## Domain

Inventory management web application ("loopi"): inventory dashboards,
discrepancy review (mermas), measurement units administration,
and purchases-only flagged inventory.
