import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
})
export class CartDrawerComponent {
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  readonly ui = inject(UiService);
  private readonly api = inject(ApiService);

  readonly checkoutMsg = signal<string | null>(null);
  readonly busy = signal(false);

  close() {
    this.cart.toggle(false);
    this.checkoutMsg.set(null);
  }

  checkout() {
    if (!this.auth.isLoggedIn()) {
      this.ui.openAuth('login');
      return;
    }
    if (!this.cart.items().length) {
      return;
    }
    this.busy.set(true);
    this.checkoutMsg.set(null);
    const items = this.cart.items().map((i) => ({
      productId: i.product.id,
      size: i.size,
      quantity: i.quantity,
    }));
    this.api.createOrder(items).subscribe({
      next: () => {
        this.cart.clear();
        this.checkoutMsg.set('Commande envoyée. Merci.');
        this.busy.set(false);
      },
      error: () => {
        this.checkoutMsg.set('Échec de la commande. Réessaie.');
        this.busy.set(false);
      },
    });
  }
}
