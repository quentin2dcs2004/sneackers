import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {
  readonly menuOpen = signal(false);
  readonly authOpen = signal(false);
  readonly authMode = signal<'login' | 'register'>('login');

  constructor() {
    effect(() => {
      document.body.classList.toggle('menu-open', this.menuOpen());
    });
  }

  toggleMenu(force?: boolean) {
    this.menuOpen.set(force ?? !this.menuOpen());
  }

  openAuth(mode: 'login' | 'register' = 'login') {
    this.authMode.set(mode);
    this.authOpen.set(true);
  }

  closeAuth() {
    this.authOpen.set(false);
  }
}
