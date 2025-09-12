# 🏢 Loopi Web - Employee Management System

[![Angular](https://img.shields.io/badge/Angular-20.1.0-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Material Design](https://img.shields.io/badge/Material_Design-20.1.6-757575?style=flat-square&logo=material-design)](https://material.angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)](https://nodejs.org/)

Sistema de gestión de empleados y horarios construido con Angular, enfocado en
franquicias y tiendas. Implementa autenticación segura, gestión de contextos de
trabajo, planificación de turnos y ausencias.

## 🚀 **Características Principales**

### ✨ **Funcionalidades de Negocio**

- 🔐 **Autenticación Segura**: Login con tokens encriptados y expiración
  automática
- 🏪 **Gestión Multi-Contexto**: Soporte para múltiples franquicias y tiendas
- 👥 **Gestión de Empleados**: CRUD completo con roles y permisos
- 📅 **Planificación de Turnos**: Sistema de horarios con validaciones
- 🚫 **Gestión de Ausencias**: Control de vacaciones y permisos
- 📊 **Reportes y Métricas**: Análisis de horas y performance

### 🛡️ **Características de Seguridad (Implementadas)**

- 🔒 **TokenStorageService**: Encriptación AES de tokens con expiración
  automática
- 🚨 **GlobalErrorHandler**: Manejo centralizado de errores con limpieza de
  sesión
- 📢 **NotificationService**: Sistema de notificaciones seguras y
  contextualizadas
- 🛂 **Guards Mejorados**: Verificación robusta de autenticación y contexto
- 🔍 **HTTP Interceptors**: Logging seguro y gestión automática de headers

### 🐛 **Características de Desarrollo (Implementadas)**

- 🔧 **Debugging Completo**: Sistema profesional de debugging para desarrollo
- 📊 **Performance Monitoring**: Tracking automático de rendimiento
- 🧪 **Testing Infrastructure**: Tests unitarios con utilities y mocks
- 🎯 **VSCode Integration**: Configuración completa para debugging
- 📝 **Logging Estructurado**: Sistema de logs por niveles y categorías

## 🛠️ **Stack Tecnológico**

### **Frontend Framework**

- **Angular 20.1.0** - Framework principal
- **TypeScript 5.8.2** - Lenguaje de programación
- **Angular Material 20.1.6** - Componentes UI
- **RxJS 7.8.0** - Programación reactiva

### **Herramientas de Desarrollo**

- **Angular CLI 20.1.5** - Herramientas de desarrollo
- **Karma + Jasmine** - Testing framework
- **ESLint + Prettier** - Linting y formateo
- **Chrome DevTools** - Debugging en browser

### **Seguridad y Utilidades**

- **crypto-js 4.2.0** - Encriptación de tokens
- **TypeScript Strict Mode** - Tipado estricto
- **HTTP Interceptors** - Manejo de requests
- **Environment Configurations** - Configuración por ambiente

### **Desarrollo y Debugging**

- **Source Maps** - Debugging de código original
- **VSCode/Cursor Config** - Configuración completa de IDE
- **Performance APIs** - Monitoreo de rendimiento
- **Debug Utilities** - Herramientas de debugging avanzadas

## 📋 **Requisitos Previos**

Antes de empezar, asegúrate de tener instalado:

- **Node.js 18.0.0+** ([Descargar aquí](https://nodejs.org/))
- **npm 9.0.0+** (viene con Node.js)
- **Git** ([Descargar aquí](https://git-scm.com/))
- **VSCode o Cursor** (recomendado para debugging)

### **Verificar Instalación**

```bash
node --version    # Debe ser 18.0.0+
npm --version     # Debe ser 9.0.0+
git --version     # Cualquier versión reciente
```

## 🚀 **Instalación y Configuración**

### **1. Clonar el Repositorio**

```bash
git clone https://github.com/tu-usuario/loopi-web.git
cd loopi-web
```

### **2. Instalar Dependencias**

```bash
# Instalar todas las dependencias
npm install

# Verificar que la instalación fue exitosa
npm run debug:verify
```

### **3. Configuración de Environment**

```bash
# Los archivos de environment ya están configurados:
# src/environments/environment.ts      (desarrollo)
# src/environments/environment.prod.ts (producción)

# Revisar configuración de API
cat src/environments/environment.ts
```

### **4. Verificar Configuración**

```bash
# Script de verificación automática
npm run debug:verify

# Debería mostrar:
# ✅ Checking required files
# ✅ Checking Angular configuration
# ✅ Checking Environment configuration
# ✅ Development build successful
```

## 🏃‍♂️ **Ejecutar Localmente**

### **Desarrollo Estándar**

```bash
# Iniciar servidor de desarrollo
npm start

# La aplicación estará disponible en http://localhost:4200
```

### **Desarrollo con Debugging Completo**

```bash
# Iniciar con todas las herramientas de debugging
npm run start:debug

# O usando VSCode/Cursor:
# 1. Press F5
# 2. Seleccionar "🚀 Launch Angular App"
```

### **Verificar que Funciona**

1. Abrir http://localhost:4200
2. Debe aparecer la página de login
3. Abrir DevTools (F12) para ver logs de debugging
4. Ejecutar `window.debug.logs()` en console

## 📦 **Scripts Disponibles**

### **Desarrollo**

```bash
npm start              # Servidor de desarrollo estándar
npm run start:debug    # Servidor con debugging completo
npm run build:dev      # Build de desarrollo con source maps
npm run watch          # Build continuo en desarrollo
```

### **Testing**

```bash
npm test               # Tests unitarios (single run)
npm run test:debug     # Tests con debugging en Chrome
```

### **Debugging y Utilidades**

```bash
npm run debug:verify   # Verificar configuración de debugging
npm run debug:clean    # Limpiar cache y archivos temporales
npm run debug:info     # Información del sistema (versiones)
```

### **Producción**

```bash
npm run build          # Build optimizado para producción
```

## 🐛 **Sistema de Debugging**

### **Configuración Automática**

El proyecto incluye un sistema completo de debugging configurado
automáticamente:

- ✅ **Source Maps**: Habilitados para debugging de código TypeScript original
- ✅ **VSCode/Cursor**: Configuración completa en `.vscode/`
- ✅ **Debug Interceptor**: Logging automático de HTTP requests
- ✅ **Performance Monitoring**: Tracking de operaciones lentas
- ✅ **Global Debug Console**: Utilities disponibles en `window.debug`

### **Debugging en VSCode/Cursor**

1. **Abrir el proyecto** en VSCode o Cursor
2. **Press F5** para iniciar debugging
3. **Seleccionar** "🚀 Launch Angular App"
4. **La aplicación se abre** con debugging completo habilitado
5. **Breakpoints** funcionan directamente en código TypeScript

### **Debugging en Browser**

```javascript
// Console global de debugging (disponible automáticamente)
window.debug.logs(); // Ver todos los logs
window.debug.logs().filter(l => l.level === 'error'); // Filtrar errores
window.debug.export(); // Exportar logs como JSON
window.debug.clear(); // Limpiar logs
window.debug.performance(); // Info de performance del navegador

// Componentes registrados para debugging
window.components.LoginFormComponent; // Acceso directo a componentes
```

### **Documentación Completa de Debugging**

- 📖 **[DEBUG-SETUP.md](./DEBUG-SETUP.md)** - Guía completa de debugging
- 📋 **[DEBUGGING-COMPLETE.md](./DEBUGGING-COMPLETE.md)** - Resumen ejecutivo

## 🏗️ **Estructura del Proyecto**

```
src/
├── app/
│   ├── core/                      # Servicios centrales y configuración
│   │   ├── guards/                # Guards de autenticación y contexto
│   │   ├── handlers/              # GlobalErrorHandler
│   │   ├── interceptors/          # HTTP interceptors (auth, debug)
│   │   ├── services/              # Servicios principales
│   │   │   ├── auth/              # AuthService mejorado
│   │   │   ├── debug/             # DebugService para logging
│   │   │   ├── notification/      # NotificationService
│   │   │   └── token-storage/     # TokenStorageService (encriptado)
│   │   ├── utils/                 # Utilities de debugging
│   │   └── directives/            # Directivas de debugging
│   ├── features/                  # Módulos de funcionalidad
│   │   ├── auth/                  # Login y selección de contexto
│   │   ├── admin/                 # Gestión de franquicias y tiendas
│   │   ├── employees/             # CRUD de empleados
│   │   ├── shifts/                # Planificación de turnos y ausencias
│   │   └── home/                  # Dashboard principal
│   ├── model/                     # Interfaces y modelos TypeScript
│   ├── shared/                    # Componentes compartidos
│   ├── testing/                   # Utilities para testing
│   └── styles/                    # Estilos globales y temas
├── environments/                  # Configuración por ambiente
├── assets/                        # Recursos estáticos
└── styles/                        # Estilos de notificaciones
```

## 🔒 **Consideraciones de Seguridad**

### **Autenticación**

- ✅ **Tokens encriptados** con AES usando crypto-js
- ✅ **Expiración automática** de tokens con limpieza
- ✅ **Validación robusta** en cada request
- ✅ **Logout automático** en errores 401

### **Manejo de Errores**

- ✅ **GlobalErrorHandler** centralizado
- ✅ **No exposición** de información sensible en producción
- ✅ **Logging estructurado** para debugging
- ✅ **Limpieza automática** de sesión en errores de autorización

### **HTTP Requests**

- ✅ **Headers automáticos** de autorización
- ✅ **Logging seguro** sin datos sensibles
- ✅ **Timeout configurado** para requests
- ✅ **Retry automático** con backoff

## 🧪 **Testing**

### **Tests Unitarios**

```bash
# Ejecutar todos los tests
npm test

# Tests con debugging
npm run test:debug

# Tests con coverage
npm test -- --code-coverage
```

### **Estructura de Testing**

- ✅ **Test Utilities** en `src/app/testing/test-utils.ts`
- ✅ **Mocks** para localStorage, HTTP, Router
- ✅ **Factory patterns** para datos de prueba
- ✅ **Setup automático** para servicios principales

### **Tests Implementados**

- ✅ **TokenStorageService**: Encriptación, expiración, validación
- ✅ **AuthService**: Login, logout, verificación de estado
- ✅ **NotificationService**: Todos los tipos de notificación
- ✅ **GlobalErrorHandler**: Manejo de errores HTTP y JavaScript

## 🚀 **Deployment**

### **Build de Producción**

```bash
# Build optimizado
npm run build

# Los archivos se generan en dist/loopi-web/
# Servir con cualquier servidor web estático
```

### **Environment de Producción**

- ✅ **Debugging deshabilitado** automáticamente
- ✅ **Logging mínimo** solo errores críticos
- ✅ **Optimizaciones** de bundle habilitadas
- ✅ **Source maps** deshabilitados para seguridad

## 👥 **Desarrollo y Contribución**

### **Guías de Desarrollo**

1. **Usar TypeScript estricto** - Tipos definidos para todo
2. **Seguir patrones Angular** - Servicios, componentes, guards
3. **Implementar tests** - Coverage mínimo del 80%
4. **Usar debugging tools** - Aprovechar el sistema implementado
5. **Documentar cambios** - JSDoc en métodos públicos

### **Workflow Recomendado**

```bash
# 1. Crear rama feature
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar con debugging habilitado
npm run start:debug

# 3. Ejecutar tests
npm test

# 4. Verificar build
npm run build:dev

# 5. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### **Estándares de Código**

- **Prettier** configurado para formateo automático
- **ESLint** con reglas de Angular (cuando se configure)
- **Conventional Commits** para mensajes de git
- **TypeScript Strict Mode** habilitado

## 📚 **Documentación Adicional**

- 📖 **[DEBUG-SETUP.md](./DEBUG-SETUP.md)** - Guía completa de debugging
- 📋 **[DEBUGGING-COMPLETE.md](./DEBUGGING-COMPLETE.md)** - Resumen de debugging
- 🛡️ **[SECURITY-IMPROVEMENTS.md](./SECURITY-IMPROVEMENTS.md)** - Mejoras de
  seguridad implementadas
- 📢 **[NOTIFICATION-GUIDELINES.md](./NOTIFICATION-GUIDELINES.md)** -
  Lineamientos del sistema de notificaciones

## 🆘 **Solución de Problemas**

### **Problemas Comunes**

#### **Error al instalar dependencias**

```bash
# Limpiar cache de npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### **Error de puertos en uso**

```bash
# Verificar qué proceso usa el puerto 4200
lsof -ti:4200
kill -9 $(lsof -ti:4200)

# O usar otro puerto
ng serve --port 4201
```

#### **Source maps no aparecen**

```bash
# Limpiar y rebuildar
npm run debug:clean
npm run start:debug
```

#### **Debugging no funciona en VSCode**

1. Cerrar todas las instancias de Chrome
2. Press F5 en VSCode/Cursor
3. Verificar que se abre Chrome automáticamente
4. Si falla, usar configuración "🔍 Attach to Chrome"

### **Verificación Automática**

```bash
# Script de verificación completa
npm run debug:verify

# Debe mostrar ✅ en todos los checks
```

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para
más detalles.

## 🤝 **Soporte**

Si tienes problemas o preguntas:

1. **Revisar la documentación** en los archivos `.md`
2. **Ejecutar verificación** con `npm run debug:verify`
3. **Revisar logs** en `window.debug.logs()`
4. **Crear un issue** en el repositorio

---

## 🎯 **Estado del Proyecto**

### ✅ **Completado (Fase 1)**

- 🛡️ **Seguridad**: TokenStorage, ErrorHandler, Notifications
- 🐛 **Debugging**: Sistema completo implementado
- 🧪 **Testing**: Infrastructure y tests unitarios
- ⚙️ **Configuración**: VSCode, environments, scripts

### 🔄 **En Progreso (Fase 2)**

- 📊 **Estado Global**: NgRx implementation
- 🔧 **Linting**: ESLint configuración estricta
- 📝 **Tipado**: TypeScript strict mode completo
- 🎨 **UI/UX**: Mejoras de interfaz

### 📅 **Planificado (Fase 3)**

- 🧪 **E2E Testing**: Cypress/Playwright
- 📈 **Monitoring**: Performance y error tracking
- 🚀 **CI/CD**: Pipeline de deployment
- 📚 **Documentación**: API docs y guías

---

**¡Feliz desarrollo!** 🚀 Si sigues esta guía, tendrás el proyecto corriendo
localmente con todas las herramientas de debugging en menos de 5 minutos.
