# loopi-web Project Constitution

**Version**: 1.0.0 | **Created**: 2026-05-01 | **Source**: Brownfield Bootstrap

---

## Core Principles

### I. Service-Layer Supremacy

All business logic and HTTP calls live exclusively in `src/app/core/services/`. Components are pure presentation layers: they read signals/observables from services and dispatch user actions — zero business logic inline.

**Source**: Observed across `AuthService`, `InventoryService`, `AdminService` — all HTTP calls, state signals, and business computations are there. Components only call service methods.
**Verification**: Code review must reject any `HttpClient.get/post` or business computation inside a component class.

### II. Standalone Components (No NgModules)

Every component is standalone (`standalone: true`). Features use `loadComponent` or `loadChildren` for lazy loading. No `NgModule` declarations are allowed.

**Source**: `app.ts`, `app.routes.ts`, and all feature components use standalone + `loadComponent`.
**Verification**: No `@NgModule` import in any new file; check `standalone: true` on every `@Component`.

### III. Signal-Based State Management

Component and service state is managed with Angular `signal()` and `computed()`. Services expose read-only signals via `.asReadonly()`. No BehaviorSubject or manual subscription chains for local state.

**Source**: `AuthService` (`signal<Employee | null>`, `computed(() => …)`), `InventoryService` (multiple signals). DI via `inject()`, not constructor parameters.
**Verification**: No `new BehaviorSubject` for local state; all mutable state declared as `signal()`; services expose `readonly` signals to consumers.

### IV. Functional Guards & Interceptors

Guards are `CanActivateFn` functions, interceptors are `HttpInterceptorFn` functions. No class-based `CanActivate` or `HttpInterceptor`.

**Source**: `auth.guard.ts` (three functional guards), `auth.interceptor.ts`.
**Verification**: New guards/interceptors must use function form, not class form.

### V. Test Discipline (TDD Enforced)

All new features must have accompanying Karma/Jasmine tests (`.spec.ts`). TDD Red-Green-Refactor is the expected cycle.

**Source**: CI pipeline runs `ng test --watch=false --browsers=ChromeHeadless` on every PR.
**Verification**: Coverage for new business logic ≥ 80%. CI will fail the build if tests fail.

1. 🔴 Write failing spec first
2. 🟢 Implement minimum code to make it pass
3. 🔵 Refactor — keep tests green

### VI. Interfaces-Only Models

Domain models are TypeScript `interface` or `type` definitions. No classes with methods in `core/models/`. Business behaviour belongs in services.

**Source**: `inventory.model.ts`, `employee.model.ts`, `admin.model.ts` — all pure interfaces/types.
**Verification**: No `class` keyword inside `core/models/`.

### VII. No Code Duplication

Before creating a new component, service, or utility, search for existing implementations in `core/services/`, `core/models/`, and `features/shared/`. Only create new code when nothing reusable exists.

**Verification**: Check `features/shared/` for UI primitives; check `core/services/` for existing HTTP wrappers before adding new ones.

### VIII. Centralised Error Handling

HTTP errors are handled by `authInterceptor` (global 401 → logout + redirect). Feature-level errors are surfaced via service signals or caught with `catchError` in the service. Components display error messages from signals — they do not catch HTTP errors directly.

**Source**: `auth.interceptor.ts`, pattern observed in `InventoryService`.
**Verification**: No `.subscribe({ error: … })` handlers that perform routing or token clearing in components.

---

## Tech Stack Anchoring

SDD specs and plans **must** reflect this exact stack — it is non-negotiable for a brownfield project.

| Category | Technology | Version | Non-replaceable |
|---|---|---|---|
| Language | TypeScript | ~5.8.2 | ✓ |
| Framework | Angular | ^20.1.0 | ✓ |
| Styles | Tailwind CSS v4 + SCSS | ^4.1.18 | ✓ |
| UI primitives | @angular/cdk | ^20.2.14 | ✓ (no external UI libs) |
| PWA | @angular/service-worker | ^20.1.0 | ✓ |
| State | Angular Signals | built-in | ✓ |
| HTTP | Angular HttpClient | built-in | ✓ |
| Testing | Karma + Jasmine | ~6.4 / ~5.8 | ✓ |
| Build | Angular CLI / @angular/build | ^20.1.5 | ✓ |
| Deploy | Firebase Hosting | — | ✓ |
| CI/CD | GitHub Actions | — | ✓ |
| Package mgr | npm | — | ✓ |

---

## Application Architecture

### Structure

Single-module Angular app (no multi-module, no monorepo).

```
src/app/
├── core/
│   ├── guards/          # Functional CanActivateFn guards
│   ├── interceptors/    # Functional HttpInterceptorFn interceptors
│   ├── models/          # Interfaces & types only (no class logic)
│   └── services/        # All business logic + HTTP calls
├── features/
│   ├── admin/           # Admin-role screens (lazy-loaded)
│   │   ├── categories/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── inventories/
│   │   ├── items/
│   │   ├── suppliers/
│   │   └── layout/
│   ├── auth/
│   │   └── login/
│   ├── inventory/       # Employee-role inventory workflow (lazy-loaded)
│   │   ├── home/
│   │   ├── schedule-select/
│   │   ├── item-entry/
│   │   ├── discrepancy-review/
│   │   ├── sales-entry/
│   │   ├── summary/
│   │   └── confirmation/
│   └── shared/          # Cross-feature shared components
└── environments/
```

### Roles

| Role | Entry Route | Guard |
|---|---|---|
| `admin` | `/admin` | `authGuard` + `adminGuard` |
| `employee` | `/inventory` | `authGuard` |

### Routing Pattern

- Root `app.routes.ts` owns top-level routes.
- Admin sub-routes in `features/admin/admin.routes.ts` loaded via `loadChildren`.
- All other feature components loaded via `loadComponent`.
- Role-based redirect on `/` via `RoleRedirectComponent`.

---

## Directory Contract

New code **must** be placed following these conventions:

| Code Type | Standard Location | Naming Convention |
|---|---|---|
| Feature component | `src/app/features/<feature>/<screen>/<name>.component.ts` | `kebab-case.component.ts` / `PascalCaseComponent` |
| Feature template | same directory as component | `<name>.component.html` |
| Feature route config | `src/app/features/<feature>/<feature>.routes.ts` | `<feature>.routes.ts` |
| Business service | `src/app/core/services/<name>.service.ts` | `kebab-case.service.ts` / `PascalCaseService` |
| Domain model | `src/app/core/models/<domain>.model.ts` | interfaces/types, no classes |
| Guard | `src/app/core/guards/<name>.guard.ts` | functional `CanActivateFn` |
| Interceptor | `src/app/core/interceptors/<name>.interceptor.ts` | functional `HttpInterceptorFn` |
| Shared UI component | `src/app/features/shared/<name>.component.ts` | standalone |
| Unit test | same directory as source file | `<name>.spec.ts` |
| Environment config | `src/environments/environment[.development].ts` | `environment` const export |

---

## Coding Conventions

| Convention | Rule |
|---|---|
| Indentation | 2 spaces |
| Quotes | Single quotes in TypeScript |
| File endings | LF, `insert_final_newline` = true |
| HTML formatter | Prettier with `"parser": "angular"` |
| DI pattern | `inject()` function — no constructor injection |
| Component template | `templateUrl` for non-trivial templates; inline `template` for tiny components (< 5 lines) |
| Signals exposure | Services expose `.asReadonly()` signals; components derive state with `computed()` |
| Imports order | Angular core → Angular modules → App core → App features |
| Strict TypeScript | `strict: true`, `noImplicitOverride`, `noImplicitReturns`, `strictTemplates` |

---

## Governance

### Constitution Priority

1. This constitution is the highest-authority guidance for the SDD workflow in this project.
2. All specs must conform to these principles and tech stack constraints.
3. All implementation plans must use the anchored tech stack — no new UI libraries without evaluating `@angular/cdk` first.
4. All tasks must comply with the Directory Contract.

### Amendment Procedure

- Document the reason for any change.
- Update all templates that reference the changed section.
- Bump the version number following semver.
