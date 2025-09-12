#!/usr/bin/env node

/**
 * Script de validación completa del setup del proyecto
 * Ejecutar con: npm run validate:setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Validando Setup Completo de Loopi Web\n');

let errors = 0;
let warnings = 0;

// Función helper para verificar archivos
function checkFile(filePath, description) {
  const exists = fs.existsSync(path.join(__dirname, '..', filePath));
  if (exists) {
    console.log(`   ✅ ${description}`);
    return true;
  } else {
    console.log(`   ❌ ${description} - MISSING: ${filePath}`);
    errors++;
    return false;
  }
}

// Función helper para verificar comandos
function checkCommand(command, description, required = true) {
  try {
    execSync(command, { stdio: 'pipe', cwd: process.cwd() });
    console.log(`   ✅ ${description}`);
    return true;
  } catch (error) {
    const symbol = required ? '❌' : '⚠️';
    console.log(`   ${symbol} ${description} - ${error.message.split('\n')[0]}`);
    if (required) {
      errors++;
    } else {
      warnings++;
    }
    return false;
  }
}

// 1. Verificar archivos críticos del proyecto
console.log('📂 Verificando archivos críticos:');
const criticalFiles = [
  ['package.json', 'Package configuration'],
  ['angular.json', 'Angular configuration'],
  ['tsconfig.json', 'TypeScript configuration'],
  ['src/app/app.config.ts', 'App configuration'],
  ['src/environments/environment.ts', 'Development environment'],
  ['src/environments/environment.prod.ts', 'Production environment']
];

criticalFiles.forEach(([file, desc]) => checkFile(file, desc));

// 2. Verificar archivos de seguridad implementados
console.log('\n🛡️ Verificando implementaciones de seguridad:');
const securityFiles = [
  ['src/app/core/services/token-storage/token-storage.service.ts', 'TokenStorageService'],
  ['src/app/core/handlers/global-error.handler.ts', 'GlobalErrorHandler'],
  ['src/app/core/services/notification/notification.service.ts', 'NotificationService'],
  ['src/app/core/interceptors/auth.interceptor.ts', 'Auth Interceptor'],
  ['src/app/core/guards/auth.guard.ts', 'Auth Guard'],
  ['src/app/core/guards/work-context.guard.ts', 'Work Context Guard']
];

securityFiles.forEach(([file, desc]) => checkFile(file, desc));

// 3. Verificar archivos de debugging
console.log('\n🐛 Verificando sistema de debugging:');
const debugFiles = [
  ['src/app/core/services/debug/debug.service.ts', 'DebugService'],
  ['src/app/core/interceptors/debug.interceptor.ts', 'Debug Interceptor'],
  ['src/app/core/utils/debug.utils.ts', 'Debug Utilities'],
  ['src/app/core/directives/debug-info.directive.ts', 'Debug Info Directive'],
  ['.vscode/launch.json', 'VSCode Launch Config'],
  ['.vscode/tasks.json', 'VSCode Tasks Config'],
  ['.vscode/settings.json', 'VSCode Settings'],
  ['.vscode/extensions.json', 'VSCode Extensions']
];

debugFiles.forEach(([file, desc]) => checkFile(file, desc));

// 4. Verificar archivos de testing
console.log('\n🧪 Verificando infraestructura de testing:');
const testFiles = [
  ['src/app/testing/test-utils.ts', 'Test Utilities'],
  ['src/app/core/services/token-storage/token-storage.service.spec.ts', 'TokenStorageService Tests'],
  ['src/app/core/services/auth/auth-service.spec.ts', 'AuthService Tests'],
  ['src/app/core/services/notification/notification.service.spec.ts', 'NotificationService Tests'],
  ['src/app/core/handlers/global-error.handler.spec.ts', 'GlobalErrorHandler Tests']
];

testFiles.forEach(([file, desc]) => checkFile(file, desc));

// 5. Verificar documentación
console.log('\n📚 Verificando documentación:');
const docFiles = [
  ['README.md', 'README principal'],
  ['DEBUG-SETUP.md', 'Guía de debugging'],
  ['DEBUGGING-COMPLETE.md', 'Resumen de debugging'],
  ['SECURITY-IMPROVEMENTS.md', 'Mejoras de seguridad']
];

docFiles.forEach(([file, desc]) => checkFile(file, desc));

// 6. Verificar dependencias críticas
console.log('\n📦 Verificando dependencias críticas:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const criticalDeps = {
    '@angular/core': 'Angular Core',
    '@angular/common': 'Angular Common',
    '@angular/material': 'Angular Material',
    'crypto-js': 'Encryption Library',
    'rxjs': 'Reactive Extensions',
    'typescript': 'TypeScript'
  };

  Object.entries(criticalDeps).forEach(([dep, desc]) => {
    const version = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
    if (version) {
      console.log(`   ✅ ${desc}: ${version}`);
    } else {
      console.log(`   ❌ ${desc}: Missing`);
      errors++;
    }
  });
} catch (error) {
  console.log('   ❌ Error reading package.json');
  errors++;
}

// 7. Verificar scripts npm
console.log('\n🎯 Verificando scripts npm:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const requiredScripts = {
    'start': 'Development server',
    'start:debug': 'Debug development server',
    'build': 'Production build',
    'build:dev': 'Development build',
    'test': 'Unit tests',
    'debug:verify': 'Debug verification'
  };

  Object.entries(requiredScripts).forEach(([script, desc]) => {
    if (packageJson.scripts[script]) {
      console.log(`   ✅ ${desc}: ${script}`);
    } else {
      console.log(`   ❌ ${desc}: Missing script "${script}"`);
      errors++;
    }
  });
} catch (error) {
  console.log('   ❌ Error reading package.json scripts');
  errors++;
}

// 8. Verificar configuración de Angular
console.log('\n⚙️ Verificando configuración Angular:');
try {
  const angularJson = JSON.parse(fs.readFileSync('angular.json', 'utf8'));
  const devConfig = angularJson.projects['loopi-web'].architect.build.configurations.development;

  if (devConfig.sourceMap) {
    console.log('   ✅ Source maps habilitados');
  } else {
    console.log('   ❌ Source maps deshabilitados');
    errors++;
  }

  if (!devConfig.optimization) {
    console.log('   ✅ Optimización deshabilitada en desarrollo');
  } else {
    console.log('   ⚠️ Optimización habilitada en desarrollo');
    warnings++;
  }

  if (devConfig.namedChunks) {
    console.log('   ✅ Named chunks habilitados');
  } else {
    console.log('   ⚠️ Named chunks deshabilitados');
    warnings++;
  }
} catch (error) {
  console.log('   ❌ Error reading angular.json');
  errors++;
}

// 9. Verificar environment de desarrollo
console.log('\n🌍 Verificando environment de desarrollo:');
try {
  const envContent = fs.readFileSync('src/environments/environment.ts', 'utf8');

  const checks = [
    { name: 'enableDebugMode', pattern: /enableDebugMode:\s*true/, required: true },
    { name: 'enableConsoleLogging', pattern: /enableConsoleLogging:\s*true/, required: true },
    { name: 'enableDetailedErrors', pattern: /enableDetailedErrors:\s*true/, required: true },
    { name: 'enablePerformanceLogging', pattern: /enablePerformanceLogging:\s*true/, required: false }
  ];

  checks.forEach(check => {
    const enabled = check.pattern.test(envContent);
    const symbol = enabled ? '✅' : (check.required ? '❌' : '⚠️');
    console.log(`   ${symbol} ${check.name}: ${enabled ? 'Habilitado' : 'Deshabilitado'}`);

    if (!enabled && check.required) {
      errors++;
    } else if (!enabled && !check.required) {
      warnings++;
    }
  });
} catch (error) {
  console.log('   ❌ Error reading environment.ts');
  errors++;
}

// 10. Verificar builds
console.log('\n🏗️ Verificando builds:');
checkCommand('ng build --configuration=development --verbose=false', 'Development build', true);
checkCommand('ng build --configuration=production --verbose=false', 'Production build', false);

// 11. Verificar herramientas de desarrollo
console.log('\n🛠️ Verificando herramientas de desarrollo:');
checkCommand('node --version', 'Node.js', true);
checkCommand('npm --version', 'npm', true);
checkCommand('ng version', 'Angular CLI', false);

// Resumen final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VALIDACIÓN');
console.log('='.repeat(60));

if (errors === 0 && warnings === 0) {
  console.log('🎉 ¡PERFECTO! Todo está configurado correctamente.');
  console.log('✅ 0 errores, 0 advertencias');
  console.log('\n🚀 El proyecto está listo para desarrollo.');
} else if (errors === 0) {
  console.log(`⚠️ Configuración FUNCIONAL con ${warnings} advertencia(s).`);
  console.log('✅ 0 errores críticos');
  console.log('\n🚀 El proyecto está listo, pero revisa las advertencias.');
} else {
  console.log(`❌ ERRORES ENCONTRADOS: ${errors} error(es), ${warnings} advertencia(s)`);
  console.log('\n🔧 Revisa los errores antes de continuar.');
  process.exit(1);
}

console.log('\n📚 Documentación disponible:');
console.log('   - README.md (guía principal)');
console.log('   - DEBUG-SETUP.md (debugging)');
console.log('   - DEBUGGING-COMPLETE.md (resumen)');
console.log('   - SECURITY-IMPROVEMENTS.md (seguridad)');

console.log('\n🎯 Próximos pasos:');
console.log('   1. npm run start:debug  (iniciar con debugging)');
console.log('   2. Press F5 en VSCode   (debugging completo)');
console.log('   3. npm test             (ejecutar tests)');
console.log('   4. Revisar window.debug en browser console');

console.log('\n¡Happy coding! 🚀');
