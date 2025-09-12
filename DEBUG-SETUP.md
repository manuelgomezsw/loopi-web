# 🐛 Configuración de Debugging - Loopi Web

## 📋 **Configuración Completa Implementada**

### ✅ **Source Maps y Build**

- Source maps habilitados para desarrollo
- Configuración optimizada para debugging
- Build no optimizado en development

### ✅ **VSCode/Cursor Debugging**

- Configuración completa de launch.json
- Tasks para ng serve, build, test
- Configuraciones recomendadas de extensiones

### ✅ **Environment Variables**

- Variables específicas para debugging
- Feature flags para desarrollo
- Configuración de logging por niveles

### ✅ **Servicios de Debugging**

- DebugService para logging estructurado
- Debug interceptor para HTTP requests
- Utilities y decorators para debugging

## 🚀 **Cómo Usar el Sistema de Debugging**

### 1. **Inicio Rápido**

#### Opción A: VSCode/Cursor Debugging

1. Abrir Command Palette (`Cmd+Shift+P`)
2. Ejecutar `Debug: Start Debugging`
3. Seleccionar `🚀 Launch Angular App`
4. La aplicación iniciará con debugging habilitado

#### Opción B: Terminal

```bash
# Desarrollo con debugging
npm start

# Desarrollo con debugging detallado
ng serve --configuration=development --verbose
```

### 2. **Herramientas Disponibles en el Browser**

#### Console Global de Debug

Una vez iniciada la aplicación, tienes acceso a herramientas globales:

```javascript
// Acceso al servicio de debug
window.debug.service;

// Ver todos los logs
window.debug.logs();

// Ver logs filtrados
window.debug.logs().filter((log) => log.level === "error");

// Limpiar logs
window.debug.clear();

// Exportar logs como JSON
window.debug.export();

// Ver información de performance
window.debug.performance();

// Ver configuración de environment
window.debug.environment;
```

#### Componentes Registrados

```javascript
// Ver componentes registrados para debugging
window.components;

// Acceder a un componente específico
window.components.LoginFormComponent;
```

### 3. **DebugService - Logging Estructurado**

#### Uso Básico

```typescript
import { DebugService } from './core/services/debug/debug.service';

constructor(private debug: DebugService) {}

// Diferentes niveles de log
this.debug.debug('AuthService', 'User login attempt', { email: user.email });
this.debug.info('AuthService', 'Login successful');
this.debug.warn('AuthService', 'Token expiring soon');
this.debug.error('AuthService', 'Login failed', error);
```

#### Medición de Performance

```typescript
// Medir operación sincrónica
const result = this.debug.measurePerformance(
  "AuthService",
  "validateToken",
  () => {
    return this.validateToken(token);
  }
);

// Medir operación asíncrona
const result = await this.debug.measurePerformanceAsync(
  "AuthService",
  "loginUser",
  async () => {
    return this.http.post("/login", credentials).toPromise();
  }
);
```

### 4. **Decorators para Debugging**

#### @LogMethod - Logging Automático

```typescript
import { LogMethod } from "./core/utils/debug.utils";

export class AuthService {
  @LogMethod("AuthService")
  login(credentials: LoginCredentials) {
    // Se loggea automáticamente la entrada y salida
    return this.http.post("/auth/login", credentials);
  }
}
```

#### @TrackPerformance - Monitoreo de Performance

```typescript
import { TrackPerformance } from "./core/utils/debug.utils";

export class DataService {
  @TrackPerformance(500) // Alerta si toma más de 500ms
  processLargeDataset(data: any[]) {
    return this.complexOperation(data);
  }
}
```

### 5. **Debugging de Componentes**

#### Registro de Componentes

```typescript
import { ComponentDebugger } from "./core/utils/debug.utils";

export class LoginFormComponent implements OnInit {
  ngOnInit() {
    // Registrar componente para debugging global
    ComponentDebugger.getInstance().registerComponent("LoginForm", this);
  }
}
```

#### Directiva de Debug Info

```html
<!-- Mostrar información de debugging en el DOM -->
<div appDebugInfo="LoginForm" [debugData]="form.value">
  <!-- Contenido del componente -->
</div>
```

### 6. **Debugging de Estados y Formularios**

#### Estado

```typescript
import { StateDebugger } from "./core/utils/debug.utils";

// Comparar estados
StateDebugger.diffStates(oldState, newState, "UserState");
```

#### Formularios

```typescript
import { FormDebugger } from "./core/utils/debug.utils";

// Debug completo de formulario
FormDebugger.debugForm(this.loginForm, "LoginForm");
```

### 7. **HTTP Request Debugging**

El `debugInterceptor` logea automáticamente:

- ✅ Todas las requests salientes
- ✅ Responses con timing
- ✅ Errores HTTP detallados
- ✅ Performance warnings para requests lentas
- ✅ Headers (sin información sensible)

#### Ejemplo de Log

```
[HTTP:Request] POST /auth/login
{
  requestId: "req_1234567890_abc123",
  method: "POST",
  url: "/auth/login",
  headers: { "content-type": "application/json" },
  body: { email: "user@example.com", password: "[REDACTED]" }
}

[HTTP:Response] POST /auth/login - 200
{
  requestId: "req_1234567890_abc123",
  status: 200,
  duration: "245.67ms",
  bodySize: "1.2 KB"
}
```

## 🔧 **Configuración de VSCode/Cursor**

### Launch Configurations Disponibles:

- 🚀 **Launch Angular App**: Inicia la app con debugging
- 🔍 **Attach to Chrome**: Se conecta a Chrome ya ejecutándose
- 🧪 **Debug Angular Tests**: Debugging de unit tests
- 🔧 **Debug Node**: Para scripts de build

### Tasks Disponibles:

- **ng-serve**: Servidor de desarrollo
- **ng-test**: Ejecutar tests
- **ng-build-dev**: Build de desarrollo
- **ng-lint**: Linting del código
- **🧹 Clean & Rebuild**: Limpia y reconstruye

## 📊 **Environment Flags**

### Development (environment.ts)

```typescript
enableDebugMode: true           // Habilita todas las herramientas
enableConsoleLogging: true      // Logs en console
enableDetailedErrors: true      // Stack traces completos
enablePerformanceLogging: true  // Métricas de performance
features.showDebugInfo: true    // Info visual en componentes
```

### Production (environment.prod.ts)

```typescript
enableDebugMode: false; // Deshabilitado en producción
enableConsoleLogging: false; // Solo errores críticos
enableDetailedErrors: false; // Errores genéricos
enablePerformanceLogging: false; // Sin métricas
```

## 🎯 **Breakpoints y Debugging**

### En el Código TypeScript:

1. Colocar breakpoints directamente en VSCode/Cursor
2. Iniciar debugging con `F5` o `🚀 Launch Angular App`
3. La aplicación se pausará en los breakpoints

### En el Browser:

1. Abrir DevTools (`F12`)
2. Ir a Sources tab
3. Los archivos TypeScript originales están disponibles
4. Colocar breakpoints directamente

### En Tests:

1. Usar configuración `🧪 Debug Angular Tests`
2. Breakpoints funcionan en archivos `.spec.ts`

## 📈 **Performance Monitoring**

### Métricas Automáticas:

- Timing de HTTP requests
- Tiempo de ejecución de métodos decorados
- Performance marks en el browser
- Memory usage (cuando esté disponible)

### Manual:

```typescript
// Marcar puntos en el timeline
this.debug.mark("operation-start");
// ... operación
this.debug.mark("operation-end");
this.debug.measure("operation-total", "operation-start", "operation-end");
```

## 🚨 **Troubleshooting**

### Si no aparecen source maps:

1. Verificar que `sourceMap: true` en angular.json
2. Reiniciar el servidor de desarrollo
3. Limpiar cache del browser

### Si no funciona el debugging en VSCode:

1. Verificar que Chrome esté cerrado antes de iniciar
2. Verificar puerto 4200 esté libre
3. Instalar Chrome extension para debugging

### Si no aparecen logs:

1. Verificar `environment.enableDebugMode = true`
2. Verificar nivel de logging en environment
3. Abrir console del browser (`F12`)

## 🔄 **Próximos Pasos**

1. **Angular DevTools**: Instalar extensión de Chrome
2. **Error Tracking**: Integrar Sentry/LogRocket en producción
3. **Performance Monitoring**: Configurar métricas automáticas
4. **E2E Debugging**: Configurar Cypress/Playwright

¡La configuración de debugging está lista! Ahora tienes todas las herramientas necesarias para desarrollar y debuggear eficientemente.
