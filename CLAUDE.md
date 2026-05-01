# loopi-web — Instrucciones para Claude

## Stack y arquitectura

- **Lenguaje**: TypeScript, Angular 20
- **Estilos**: Tailwind CSS v4
- **PWA**: Angular Service Worker (`@angular/service-worker`)
- **Deploy**: Firebase Hosting
- **Estructura de app**: `src/app/core/` · `src/app/features/` · `src/app/shared/`
- **Entry point**: `src/app/app.ts`

---

## GitFlow — Regla obligatoria para toda nueva feature

Antes de escribir cualquier línea de código en una nueva feature, seguir estos pasos:

### 1. Crear rama desde `develop`
```bash
git checkout develop
git pull origin develop
git checkout -b feature/<nombre-descriptivo>
# Ejemplos: feature/admin-reports, feature/password-policy
```

### 2. Commits durante el desarrollo
- Commits atómicos al completar cada subtarea del plan
- Formato obligatorio: `[ADD]`, `[CHANGE]`, `[FIX]`, `[REMOVE]` + descripción en inglés
- Ejemplos:
  - `[ADD] feature/inventory: inventory list component with pagination`
  - `[CHANGE] core/auth: refresh token on 401 response`
  - `[FIX] shared/table: correct sort direction on second click`

### 3. Finalizar feature
```bash
git checkout develop
git merge --no-ff feature/<nombre>
# O bien: PR de feature → develop
```

### Reglas para Claude
- NUNCA commitear directamente en `master` o `develop`
- SIEMPRE crear rama `feature/` antes de implementar
- NUNCA mezclar múltiples features en una sola rama
- Un plan de Claude = una rama feature

---

## Convenciones de código

- **Componentes**: un componente por archivo, sufijo `.component.ts`
- **Servicios**: lógica de negocio y llamadas HTTP en `core/services/` — CERO lógica en componentes
- **Modelos**: interfaces/tipos en `core/models/` — nunca clases con lógica
- **Rutas lazy**: cada feature carga sus rutas con `loadComponent` o `loadChildren`
- **Manejo de errores HTTP**: centralizado en un interceptor en `core/interceptors/`
- **No introducir** librerías de UI externas sin evaluar lo disponible en `@angular/cdk` primero

---

## Actualizar technical-spec.md

Siempre que se agregue/cambie:
- Una nueva dependencia → actualizar sección de Stack Tecnológico
- Un nuevo interceptor o guard → documentarlo en la sección de arquitectura
- Una nueva variable de entorno (`environment.ts`) → actualizar sección de configuración
- Un nuevo flujo de pantallas → actualizar sección de UX/navegación
