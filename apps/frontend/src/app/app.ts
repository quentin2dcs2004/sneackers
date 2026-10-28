import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthModalComponent } from './components/auth-modal/auth-modal';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor';
import { FooterComponent } from './components/footer/footer';
import { HeaderComponent } from './components/header/header';
import { MenuOverlayComponent } from './components/menu-overlay/menu-overlay';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MenuOverlayComponent,
    CartDrawerComponent,
    AuthModalComponent,
    FooterComponent,
    CustomCursorComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly cart = inject(CartService);

  constructor() {
    effect(() => {
      document.body.classList.toggle('drawer-open', this.cart.open());
    });
  }
}
