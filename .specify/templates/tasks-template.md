---
description: "Task list template for loopi-web feature implementation"
---

# Tasks: [FEATURE NAME]

**Feature directory**: `specs/[###-feature-name]/`
**Prerequisites**: `plan.md` (required), `spec.md` (required)
**Constitution**: `.specify/memory/constitution.md`

---

## Path Conventions *(loopi-web — locked by constitution)*

> ⚠️ All new files must follow these paths exactly.

| Code Type | Target Path | Naming |
|---|---|---|
| Domain model / interfaces | `src/app/core/models/<domain>.model.ts` | `interface FooBar` |
| Model barrel export | `src/app/core/models/index.ts` | add named export |
| Business service | `src/app/core/services/<name>.service.ts` | `FooBarService` |
| Feature component | `src/app/features/<feature>/<screen>/<name>.component.ts` | `FooBarComponent` |
| Feature template | `src/app/features/<feature>/<screen>/<name>.component.html` | same dir as component |
| Route config | `src/app/features/<feature>/<feature>.routes.ts` | or `app.routes.ts` |
| Shared UI component | `src/app/features/shared/<name>.component.ts` | standalone |
| Unit spec | same directory as source file | `<name>.spec.ts` |

**Test command**: `npm test -- --watch=false --browsers=ChromeHeadless`
**Build command**: `npm run build`

---

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (independent files, no cross-dependency)
- **[USN]**: Maps to User Story N in spec.md

---

## Phase 1: Setup & Verification

- [ ] T001 Confirm constitution compliance check (all gates in plan.md pass)
- [ ] T002 Search `core/services/` and `features/shared/` for reusable code before creating anything
- [ ] T003 Confirm API endpoint contract and `environment.apiUrl` base URL

---

## Phase 2: Models & Service Layer *(blocking — must complete before components)*

> ⚠️ No component work can start until this phase is done.

### 🔴 TDD — Write failing service specs first

- [ ] T004 [P] [US1] Write failing Jasmine spec for [ServiceName] in `src/app/core/services/<name>.service.spec.ts`
- [ ] T005 Run `npm test` — confirm T004 specs fail
- [ ] T006 [P] [US1] Create/extend domain interfaces in `src/app/core/models/<domain>.model.ts`
- [ ] T007 Export new types from `src/app/core/models/index.ts`

### 🟢 Implement minimum service code

- [ ] T008 [US1] Implement `[ServiceName]` in `src/app/core/services/<name>.service.ts`
  - State: `signal<T>()` exposed via `.asReadonly()`
  - HTTP: `inject(HttpClient)` with `environment.apiUrl`
  - Errors: handled in service with `catchError`, not propagated raw to components
- [ ] T009 Run `npm test` — confirm T004 specs pass
- [ ] T010 [P] Register service in `app.config.ts` if not `providedIn: 'root'`

### 🔵 Refactor service

- [ ] T011 Refactor `[ServiceName]` — keep tests green
- [ ] T012 Run `npm test` — confirm all green

**Checkpoint**: Service layer ready — component phase can begin.

---

## Phase 3: User Story 1 — [Title] (Priority: P1) 🎯 MVP

**Goal**: [What this story delivers]
**Role(s)**: `admin` | `employee`
**Route**: `[/admin/... | /inventory/...]`

### 🔴 TDD — Write failing component specs first

- [ ] T013 [P] [US1] Write failing Jasmine spec for `[ComponentName]` in `src/app/features/<feature>/<screen>/<name>.component.spec.ts`
- [ ] T014 Run `npm test` — confirm T013 specs fail

### 🟢 Implement component

- [ ] T015 [US1] Create standalone component `src/app/features/<feature>/<screen>/<name>.component.ts`
  - `standalone: true`
  - DI via `inject()` — no constructor injection
  - View state via `computed()` from service signals
  - No business logic or HTTP calls in component
- [ ] T016 [US1] Create template `src/app/features/<feature>/<screen>/<name>.component.html`
  - Styling: Tailwind CSS v4 utility classes only
  - Use `@angular/cdk` for any overlay, focus-trap, or a11y need
- [ ] T017 [US1] Wire route in `[app.routes.ts | <feature>.routes.ts]` via `loadComponent`
- [ ] T018 Run `npm test` — confirm T013 specs pass

### 🔵 Refactor component

- [ ] T019 Refactor component — keep tests green
- [ ] T020 Run `npm test` — confirm all green

**Checkpoint**: User Story 1 fully functional and independently testable.
Manual smoke: `ng serve` → navigate to `[route]` as `[role]`.

---

## Phase 4: User Story 2 — [Title] (Priority: P2)

**Goal**: [What this story delivers]
**Role(s)**: `admin` | `employee`

### 🔴 Write failing specs

- [ ] T021 [P] [US2] Write failing spec for [US2 component or service method]
- [ ] T022 Run `npm test` — confirm fail

### 🟢 Implement

- [ ] T023 [US2] Implement [component/service method]
- [ ] T024 Run `npm test` — confirm pass

### 🔵 Refactor

- [ ] T025 Refactor — keep tests green

**Checkpoint**: User Stories 1 + 2 both independently functional.

---

[Add more Phase N blocks for additional user stories following the same pattern]

---

## Phase N: Integration & CI Gate

- [ ] TXXX Run full build: `npm run build` — must succeed with zero new TypeScript errors
- [ ] TXXX Run full test suite: `npm test -- --watch=false --browsers=ChromeHeadless` — all green
- [ ] TXXX Manual smoke test as `admin` role (if applicable)
- [ ] TXXX Manual smoke test as `employee` role (if applicable)
- [ ] TXXX Verify no regression in unrelated routes

---

## Dependencies & Execution Order

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Models & Service)**: Blocks all component work. Complete before Phase 3+.
- **Phase 3+ (User Stories)**: Start after Phase 2. Stories can proceed in priority order or in parallel if team allows.
- **Phase N (CI Gate)**: After all desired stories are complete.

### Within Each Story

1. Write failing spec → confirm failure
2. Implement minimum code → confirm tests pass
3. Refactor → confirm still passing
4. Manual smoke in browser

---

## Notes

- `[P]` tasks = different files, no shared dependency — safe to run in parallel.
- Each user story must be independently testable before moving to the next.
- Never import `HttpClient` directly in a component — always go through a service.
- Never use `NgModule` — all components are standalone.
- Never add a UI library without first checking `@angular/cdk`.
- Commit after each task or logical group using the GitFlow format from CLAUDE.md.
