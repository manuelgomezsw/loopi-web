import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Directiva para mostrar información de debugging en elementos
 * Uso: <div appDebugInfo="ComponentName" [debugData]="someData">
 */
@Directive({
  selector: '[appDebugInfo]',
  standalone: true
})
export class DebugInfoDirective implements OnInit, OnDestroy {
  @Input('appDebugInfo') componentName!: string;
  @Input() debugData: any;

  private debugElement?: HTMLElement;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (!environment.features.showDebugInfo) return;

    this.createDebugInfo();
    this.addDebugStyles();
  }

  ngOnDestroy() {
    if (this.debugElement) {
      this.debugElement.remove();
    }
  }

  private createDebugInfo() {
    this.debugElement = document.createElement('div');
    this.debugElement.className = 'debug-info';
    this.debugElement.innerHTML = `
      <strong>${this.componentName}</strong>
      ${this.debugData ? `<pre>${JSON.stringify(this.debugData, null, 2)}</pre>` : ''}
    `;

    // Posicionar relativo al elemento
    this.el.nativeElement.style.position = 'relative';
    this.el.nativeElement.appendChild(this.debugElement);
  }

  private addDebugStyles() {
    if (!this.debugElement) return;

    this.debugElement.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
      background: rgba(255, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      font-size: 10px;
      font-family: monospace;
      z-index: 9999;
      border-radius: 0 0 0 4px;
      max-width: 200px;
      max-height: 100px;
      overflow: auto;
      pointer-events: none;
    `;
  }
}
