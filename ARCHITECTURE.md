# 🏗️ **Arquitectura de Componentes - Loopi Web**

## 📋 **Índice**

- [Vista General](#-vista-general)
- [Diagrama de Arquitectura](#%EF%B8%8F-diagrama-de-arquitectura-de-componentes)
- [Capas de la Aplicación](#-capas-de-la-aplicación)
- [Estructura de Routing](#-estructura-de-routing)
- [Estado NgRx](#-estado-ngrx)
- [Servicios Core](#%EF%B8%8F-servicios-core)
- [Componentes Compartidos](#-componentes-compartidos)
- [Flujo de Datos](#-flujo-de-datos)
- [Módulos por Funcionalidad](#-módulos-por-funcionalidad)
- [Relaciones Clave](#-relaciones-clave)

## 🌐 **Vista General**

Loopi Web es una aplicación Angular 20 con arquitectura NgRx para gestión de
turnos y empleados en franquicias. Utiliza:

- **Framework:** Angular 20 con Standalone Components
- **Estado:** NgRx Store con Effects y Entity Adapters
- **UI:** Angular Material
- **Autenticación:** JWT con encriptación AES
- **Routing:** Lazy Loading con Guards
- **Arquitectura:** Feature-based con Core/Shared modules

---

## 🏗️ **Diagrama de Arquitectura de Componentes**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🌐 LOOPI WEB APPLICATION                           │
│                           Angular 20 + NgRx + Material                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                🛡️ SECURITY LAYER                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🔐 Guards              │  🚦 Interceptors       │  🛠️ Handlers                │
│  ├─ AuthGuard           │  ├─ AuthInterceptor    │  ├─ GlobalErrorHandler      │
│  └─ WorkContextGuard    │  └─ DebugInterceptor   │  └─ Token Validation        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                               🏠 ROUTING STRUCTURE                              │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    AppComponent
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
               🔐 /auth              🏠 / (protected)     📊 lazy routes
                    │                    │                    │
        ┌───────────┼───────────┐       │              ┌─────┴─────┐
        │           │           │       │              │           │
   LoginForm   SelectContext    │   MainLayout     /admin     /employees
      │             │           │       │            │           │
      ├─ Login      ├─ Context  │       ├─ Header    ├─ Stores  ├─ List
      ├─ Form       └─ Selector │       ├─ Sidebar   ├─ Forms   ├─ Form
      └─ Auth                   │       ├─ Footer    └─ List    └─ CRUD
                                │       └─ Router
                                │           │
                                │       ┌───┴────┐
                                │       │        │
                                │   /home     /shifts
                                │      │         │
                                │  Dashboard  ┌──┴────────┐
                                │             │           │
                                │        /planning   /absences
                                │             │           │
                                │        ┌────┴────┐ ┌───┴───┐
                                │        │         │ │       │
                                │   ShiftTable  Form │  List │
                                │   ShiftForm      │ │  Form │
                                │   Planning       │ └───────┘
                                │   HoursCalc      │
                                │   MonthNav       │
                                │                  │
                                │             /config
                                │                  │
                                │             ┌────┴────┐
                                │             │         │
                                │          List      Form
                                └─────────────────────────────────

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🧠 NgRx STATE MANAGEMENT                           │
└─────────────────────────────────────────────────────────────────────────────────┘

                                   🏪 GLOBAL STORE
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
              🔐 AuthState         👥 EmployeeState     🎨 UIState
                    │                    │                    │
        ┌───────────┼───────────┐       │              ┌─────┴─────┐
        │           │           │       │              │           │
   ├─ Actions   ├─ Reducer  ├─ Effects  │         ├─ Actions  ├─ Theme
   ├─ login     ├─ State    ├─ HTTP     │         ├─ CRUD     ├─ Sidebar
   ├─ logout    ├─ Token    ├─ Navigate │         ├─ Filter   ├─ Notifications
   ├─ context   └─ User     └─ Storage  │         ├─ Sort     └─ Loading
   └─ refresh              │            │         └─ Pagination
                          │            │              │
                     ┌────┴────┐      │         ┌────┴────┐
                     │         │      │         │         │
                 Selectors  Services  │    Selectors  Effects
                     │         │      │         │         │
                ├─ isAuth  ├─ Auth    │    ├─ getAll  ├─ HTTP
                ├─ hasCtx  ├─ Token   │    ├─ byId    ├─ CRUD
                ├─ user    ├─ Context │    ├─ filtered└─ Mock
                └─ perms   └─ Storage │    └─ sorted
                                     │
                                EntityAdapter
                                     │
                               ┌─────┴─────┐
                               │           │
                          ├─ Entities  ├─ IDs
                          ├─ Loading   ├─ Error
                          └─ Selected  └─ Meta

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ⚙️ CORE SERVICES LAYER                            │
└─────────────────────────────────────────────────────────────────────────────────┘

      🔐 Auth Services          📊 Business Services        🛠️ Utility Services
           │                           │                           │
    ┌──────┼──────┐              ┌─────┼─────┐              ┌─────┼─────┐
    │      │      │              │     │     │              │     │     │
AuthService │ TokenStorage  Employee │ Shift │         Notification │ Debug
    │      │      │              │     │     │              │     │     │
├─ login   │ ├─ encrypt      ├─ CRUD  │ ├─ plan        ├─ success │ ├─ log
├─ logout  │ ├─ decrypt      ├─ list  │ ├─ calc        ├─ error   │ ├─ trace
├─ refresh │ ├─ validate     ├─ filter│ ├─ validate    ├─ info    │ ├─ performance
├─ context │ └─ expire       └─ sort  │ └─ hours       └─ clear   │ └─ export
└─ check       │                     │                           │
               │                Store │                  Calendar │
       WorkContext                   │                           │
               │              ┌──────┼──────┐             ┌─────┼─────┐
        ├─ set │              │      │      │             │     │     │
        ├─ get │         Franchise  │   Store         ├─ month │ ├─ week
        ├─ clear              │      │      │         ├─ year  │ ├─ day
        └─ validate      ├─ CRUD     │ ├─ CRUD        ├─ format│ └─ utils
                         ├─ list     │ ├─ list        └─ parse
                         └─ filter   │ └─ validate
                                    │
                               Shift Planning
                                    │
                              ┌─────┼─────┐
                              │     │     │
                         Hours    │   Absence
                              │     │     │
                        ├─ calculate ├─ request
                        ├─ validate  ├─ approve
                        ├─ summary   ├─ list
                        └─ project   └─ filter

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            🧩 SHARED COMPONENTS LAYER                           │
└─────────────────────────────────────────────────────────────────────────────────┘

            📱 Layout Components           🎨 UI Components         🔧 Utilities
                     │                           │                       │
        ┌────────────┼────────────┐             │              ┌────────┼────────┐
        │            │            │             │              │        │        │
   MainLayout   PageTitle   WorkContext     StatusSelect   TimeFormat │  FormHeader
        │            │        Selector          │              │        │        │
   ├─ Header     ├─ Title   ├─ Dropdown     ├─ Status      ├─ Pipe  ├─ Debug  ├─ Form
   ├─ Sidebar    ├─ Breadc  ├─ Validation   ├─ Select      ├─ Format├─ Info   ├─ Utils
   ├─ Footer     └─ Icons   ├─ Store        └─ Material    ├─ Hours │ Directive└─ Enum
   └─ Router                ├─ Franchise                   └─ Minutes└─ Global
                           └─ Context

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🌊 DATA FLOW DIAGRAM                              │
└─────────────────────────────────────────────────────────────────────────────────┘

     USER                COMPONENT              STORE                SERVICE
      │                     │                    │                    │
      │ 1. User Action      │                    │                    │
      ├────────────────────▶│                    │                    │
      │                     │ 2. Dispatch Action │                    │
      │                     ├───────────────────▶│                    │
      │                     │                    │ 3. Effect Trigger  │
      │                     │                    ├───────────────────▶│
      │                     │                    │                    │ 4. HTTP Call
      │                     │                    │                    ├──────────▶ API
      │                     │                    │                    │
      │                     │                    │ 5. Success Action  │ 6. Response
      │                     │                    │◀───────────────────┤◀───────────
      │                     │ 7. State Update    │                    │
      │                     │◀───────────────────┤                    │
      │ 8. UI Update        │                    │                    │
      │◀────────────────────┤                    │                    │
```

---

## 🛡️ **Capas de la Aplicación**

### **1. Security Layer**

- **Guards:** Protección de rutas basada en autenticación y contexto
- **Interceptors:** Inyección automática de tokens y logging de requests
- **Handlers:** Manejo global de errores y validación de tokens

### **2. Routing Layer**

- **Lazy Loading:** Módulos cargados bajo demanda
- **Protected Routes:** Rutas protegidas con guards múltiples
- **Feature Modules:** Organización por funcionalidad

### **3. State Management Layer**

- **NgRx Store:** Estado centralizado e inmutable
- **Effects:** Manejo de side effects y operaciones asíncronas
- **Selectors:** Queries optimizadas y memoizadas

### **4. Core Services Layer**

- **Business Logic:** Servicios de dominio específico
- **Utilities:** Servicios de infraestructura
- **HTTP Communication:** Abstracción de API calls

### **5. Shared Components Layer**

- **Layout:** Componentes de estructura de página
- **UI:** Componentes reutilizables de interfaz
- **Utilities:** Pipes, directivas y utilidades

---

## 🏠 **Estructura de Routing**

```typescript
/                          → Redirect to /auth/login
├─ /auth                   → Authentication Module (No Guards)
│  ├─ /login              → LoginFormComponent
│  └─ /select-context     → SelectContextComponent
│
└─ / (protected)          → MainLayoutComponent + Guards
   ├─ /home               → HomeComponent (Dashboard)
   ├─ /admin              → Admin Module (Lazy)
   │  ├─ /franchises      → CRUD Franchises
   │  └─ /stores          → CRUD Stores
   ├─ /employees          → Employee Module (Lazy)
   │  ├─ /list            → Employee List + Search
   │  └─ /form            → Employee CRUD Form
   └─ /shifts             → Shifts Module (Lazy)
      ├─ /planning        → Shift Planning Interface
      ├─ /config          → Shift Configuration
      └─ /absences        → Absence Management
```

**Guards aplicados:**

- `AuthGuard`: Verifica autenticación válida
- `WorkContextGuard`: Verifica contexto de trabajo seleccionado

---

## 🧠 **Estado NgRx**

### **AuthState**

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  workContext: WorkContext | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

**Acciones principales:**

- `login`, `loginSuccess`, `loginFailure`
- `selectContext`, `selectContextSuccess`
- `logout`, `refreshToken`, `tokenExpired`

### **EmployeeState (EntityState)**

```typescript
interface EmployeeState extends EntityState<Employee> {
  loading: boolean;
  error: string | null;
  filters: EmployeeFilters;
  selectedId: string | null;
  pagination: PaginationState;
}
```

**Acciones CRUD:**

- `loadEmployees`, `createEmployee`, `updateEmployee`, `deleteEmployee`
- `setFilters`, `selectEmployee`, `clearSelection`

### **UIState**

```typescript
interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  notifications: Notification[];
  loading: LoadingState;
}
```

**Acciones UI:**

- `toggleSidebar`, `setTheme`, `showNotification`
- `startLoading`, `stopLoading`

---

## ⚙️ **Servicios Core**

### **🔐 Servicios de Autenticación**

#### **AuthService**

- Login/Logout de usuarios
- Selección de contexto de trabajo
- Refresh de tokens automático
- Validación de estado de autenticación

#### **TokenStorageService**

- Encriptación AES de tokens
- Almacenamiento seguro en localStorage
- Validación de expiración
- Limpieza automática

#### **WorkContextService**

- Gestión de contexto de franquicia/tienda
- Persistencia en localStorage
- Validación de contexto

### **📊 Servicios de Negocio**

#### **EmployeeService**

- CRUD completo de empleados
- Filtrado y búsqueda
- Validaciones de negocio

#### **ShiftService**

- Planificación de turnos
- Cálculo de horas
- Validaciones de horarios

#### **FranchiseService / StoreService**

- Gestión de franquicias y tiendas
- Jerarquía organizacional

### **🛠️ Servicios de Utilidad**

#### **NotificationService**

- Sistema de notificaciones toast
- Tipos: success, error, info, warning
- Configuración personalizable

#### **DebugService**

- Logging estructurado
- Performance monitoring
- Export de logs para análisis

#### **CalendarService**

- Utilidades de fechas y calendario
- Formateo de fechas
- Cálculos de períodos

---

## 🧩 **Componentes Compartidos**

### **📱 Layout Components**

#### **MainLayoutComponent**

- Header con navegación y usuario
- Sidebar con menú principal
- Footer con información
- Router outlet para contenido

#### **PageTitleComponent**

- Títulos de página dinámicos
- Breadcrumbs automáticos
- Iconos contextuales

### **🎨 UI Components**

#### **WorkContextSelectorComponent**

- Dropdown de franquicias
- Selección de tienda
- Validación de contexto
- Integración con NgRx

#### **StatusSelectComponent**

- Select de estados Material
- Configuración flexible
- Validación integrada

### **🔧 Utilities**

#### **TimeFormatPipe**

- Formateo de horas y minutos
- Múltiples formatos soportados
- Localización

#### **DebugInfoDirective**

- Información de debugging en desarrollo
- Performance stats en hover
- Component state inspection

---

## 🌊 **Flujo de Datos**

### **Patrón NgRx Típico:**

1. **User Action**: Usuario interactúa con componente
2. **Dispatch Action**: Componente dispara acción al store
3. **Effect Trigger**: Effect intercepta la acción
4. **Service Call**: Effect llama al servicio correspondiente
5. **HTTP Request**: Servicio hace llamada a API
6. **Response**: API responde con datos
7. **Success Action**: Effect dispara acción de éxito
8. **State Update**: Reducer actualiza el estado
9. **UI Update**: Componente se actualiza vía selectores

### **Ejemplo: Login de Usuario**

```typescript
// 1. Usuario hace login
onLogin() →
  // 2. Componente dispara acción
  this.store.dispatch(AuthActions.login({ credentials })) →
    // 3. Effect intercepta
    login$ effect →
      // 4. Llama al servicio
      authService.login(credentials) →
        // 5. HTTP request
        POST /auth/login →
          // 6. Response
          { token, user } →
            // 7. Success action
            AuthActions.loginSuccess({ response }) →
              // 8. Reducer actualiza estado
              authReducer →
                // 9. Componente navega
                Effect navigation → /select-context
```

---

## 📋 **Módulos por Funcionalidad**

### **🔐 Auth Module**

**Propósito:** Autenticación y selección de contexto

**Componentes:**

- `LoginFormComponent`: Formulario de login con validaciones
- `SelectContextComponent`: Selección de franquicia/tienda

**Características:**

- Formularios reactivos con validación
- Integración completa con NgRx
- OnPush change detection
- Error handling centralizado

### **👥 Employees Module**

**Propósito:** Gestión completa de empleados

**Componentes:**

- `EmployeeListComponent`: Lista con filtros y paginación
- `EmployeeFormComponent`: CRUD form con validaciones

**Características:**

- EntityAdapter para gestión eficiente
- Filtrado y búsqueda en tiempo real
- TrackBy functions para performance
- Lazy loading de datos

### **⏰ Shifts Module**

**Propósito:** Planificación de turnos y gestión de ausencias

**Sub-módulos:**

- **Planning**: Planificación visual de turnos
- **Config**: Configuración de horarios
- **Absences**: Gestión de ausencias

**Componentes principales:**

- `PlanningComponent`: Interface principal de planificación
- `ShiftTableComponent`: Tabla de turnos con drag-drop
- `ShiftFormComponent`: Formulario de turnos
- `HoursCalculationComponent`: Cálculo automático de horas
- `MonthNavigationComponent`: Navegación por períodos

### **🏪 Admin Module**

**Propósito:** Administración de franquicias y tiendas

**Componentes:**

- `FranchiseListComponent` / `FranchiseFormComponent`
- `StoreListComponent` / `StoreFormComponent`

**Características:**

- CRUD completo para entidades administrativas
- Jerarquía franquicia → tienda
- Validaciones de negocio

### **🏠 Home Module**

**Propósito:** Dashboard principal con resúmenes

**Componentes:**

- `HomeComponent`: Dashboard con métricas clave

**Características:**

- Widgets de resumen
- Gráficos y estadísticas
- Navegación rápida

---

## 🎯 **Relaciones Clave**

### **1. 🔐 Authentication Flow**

```
LoginForm → AuthActions → AuthEffects → AuthService →
SelectContext → WorkContextSelector → MainLayout → Protected Routes
```

### **2. 📊 Employee Management**

```
EmployeeList → Search/Filter → EmployeeActions → EmployeeEffects →
EmployeeService → NgRx Store → Selectors → UI Updates
```

### **3. ⏰ Shift Planning**

```
Planning → ShiftForm → ShiftValidation → ShiftTable →
HoursCalculation → CalendarService → Store Updates
```

### **4. 🛡️ Security Chain**

```
Route Access → AuthGuard → WorkContextGuard →
AuthInterceptor → TokenStorage → API Communication
```

### **5. 🎨 UI State Management**

```
User Interaction → UIActions → UIReducer → UISelectors →
Theme/Sidebar/Notifications → Component Updates
```

### **6. 📱 Layout Structure**

```
MainLayout → Header/Sidebar/Footer → PageTitle →
WorkContextSelector → Router Outlet → Feature Components
```

---

## 📊 **Métricas de Arquitectura**

- **Total Components**: ~25 feature components
- **Total Services**: ~15 core services
- **NgRx Store Modules**: 4 (Auth, Employee, UI, + future)
- **Lazy Modules**: 4 (Admin, Employees, Shifts, Absences)
- **Guards**: 2 (Auth, WorkContext)
- **Interceptors**: 2 (Auth, Debug)
- **Shared Components**: ~8 reusable components
- **Change Detection**: OnPush optimized where applicable

---

## 🚀 **Ventajas de la Arquitectura**

### **✅ Escalabilidad**

- Módulos lazy-loaded para mejor performance
- Feature-based organization
- NgRx para estado complejo

### **✅ Mantenibilidad**

- Separación clara de responsabilidades
- Servicios especializados
- Componentes reutilizables

### **✅ Performance**

- OnPush change detection
- TrackBy functions en listas
- Lazy loading de rutas
- Memoized selectors

### **✅ Developer Experience**

- NgRx DevTools integration
- Debugging utilities
- TypeScript strict mode
- Comprehensive error handling

### **✅ Seguridad**

- Guards en múltiples niveles
- Token encryption
- Interceptors automáticos
- Session management

---

_Última actualización: Diciembre 2024_ _Versión de la aplicación: Angular 20 +
NgRx_
