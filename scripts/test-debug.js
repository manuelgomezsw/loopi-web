#!/usr/bin/env node

/**
 * Script para probar el sistema de debugging
 * Ejecutar con: node scripts/test-debug.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🐛 Testing Debug Setup for Loopi Web\n');

// Verificar archivos de configuración
const requiredFiles = [
  '.vscode/launch.json',
  '.vscode/tasks.json',
  '.vscode/settings.json',
  '.vscode/extensions.json',
  'src/app/core/services/debug/debug.service.ts',
  'src/app/core/interceptors/debug.interceptor.ts',
  'src/app/core/utils/debug.utils.ts',
  'src/app/core/directives/debug-info.directive.ts',
  'DEBUG-SETUP.md'
];

console.log('✅ Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Verificar configuración de Angular
console.log('\n✅ Checking Angular configuration:');
const angularJson = JSON.parse(fs.readFileSync('angular.json', 'utf8'));
const devConfig = angularJson.projects['loopi-web'].architect.build.configurations.development;

console.log(`   ✅ Source maps: ${devConfig.sourceMap ? 'Enabled' : 'Disabled'}`);
console.log(`   ✅ Optimization: ${devConfig.optimization ? 'Enabled' : 'Disabled'}`);
console.log(`   ✅ Named chunks: ${devConfig.namedChunks ? 'Enabled' : 'Disabled'}`);

// Verificar environment
console.log('\n✅ Checking Environment configuration:');
const envContent = fs.readFileSync('src/environments/environment.ts', 'utf8');
const checks = [
  { name: 'enableDebugMode', pattern: /enableDebugMode:\s*true/ },
  { name: 'enableConsoleLogging', pattern: /enableConsoleLogging:\s*true/ },
  { name: 'enableDetailedErrors', pattern: /enableDetailedErrors:\s*true/ },
  { name: 'enablePerformanceLogging', pattern: /enablePerformanceLogging:\s*true/ }
];

checks.forEach(check => {
  const enabled = check.pattern.test(envContent);
  console.log(`   ${enabled ? '✅' : '❌'} ${check.name}: ${enabled ? 'Enabled' : 'Disabled'}`);
});

// Verificar package.json scripts
console.log('\n✅ Checking Package scripts:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const scripts = ['start', 'build', 'test'];

scripts.forEach(script => {
  const exists = packageJson.scripts[script];
  console.log(`   ${exists ? '✅' : '❌'} ${script}: ${exists || 'Missing'}`);
});

// Intentar build de desarrollo
console.log('\n🔧 Testing development build:');
try {
  console.log('   Building...');
  execSync('ng build --configuration=development --verbose=false', {
    stdio: 'pipe',
    cwd: process.cwd()
  });
  console.log('   ✅ Development build successful');
} catch (error) {
  console.log('   ❌ Development build failed');
  console.log('   Error:', error.message);
}

// Verificar dependencias críticas
console.log('\n📦 Checking critical dependencies:');
const criticalDeps = ['crypto-js', '@angular/core', '@angular/common'];

criticalDeps.forEach(dep => {
  try {
    const depPath = require.resolve(dep);
    console.log(`   ✅ ${dep}: Installed`);
  } catch (error) {
    console.log(`   ❌ ${dep}: Missing`);
  }
});

console.log('\n🎉 Debug setup verification completed!');
console.log('\n📖 Next steps:');
console.log('   1. Run: npm start');
console.log('   2. Press F5 in VSCode/Cursor to start debugging');
console.log('   3. Open browser console to see debug logs');
console.log('   4. Check window.debug object for debugging utilities');
console.log('\n📚 See DEBUG-SETUP.md for detailed usage instructions');
