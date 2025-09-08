import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkContextService {
  private context: WorkContext | null = null;

  set(ctx: WorkContext): void {
    this.context = ctx;
    localStorage.setItem('work-context', JSON.stringify(ctx));
  }

  get(): WorkContext | null {
    if (!this.context) {
      const saved = localStorage.getItem('work-context');
      if (saved) this.context = JSON.parse(saved);
    }
    return this.context;
  }

  getStoreId(): number {
    const ctx = JSON.parse(localStorage.getItem('work-context') || '{}');
    return +ctx.storeID;
  }

  clear(): void {
    this.context = null;
    localStorage.removeItem('work-context');
  }
}
