import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product } from '../models/product.model';

const CART_KEY = 'sa_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>(this.read());
  readonly open = signal(false);

  readonly items = this.itemsSignal.asReadonly();
  readonly count = computed(() => this.itemsSignal().reduce((n, i) => n + i.quantity, 0));
  readonly total = computed(() =>
    this.itemsSignal().reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  );

  add(product: Product, size: string, quantity = 1) {
    const items = [...this.itemsSignal()];
    const idx = items.findIndex((i) => i.product.id === product.id && i.size === size);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
    } else {
      items.push({ product, size, quantity });
    }
    this.commit(items);
    this.open.set(true);
  }

  updateQty(productId: number, size: string, quantity: number) {
    const items = this.itemsSignal()
      .map((i) => (i.product.id === productId && i.size === size ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0);
    this.commit(items);
  }

  remove(productId: number, size: string) {
    this.commit(this.itemsSignal().filter((i) => !(i.product.id === productId && i.size === size)));
  }

  clear() {
    this.commit([]);
  }

  toggle(force?: boolean) {
    this.open.set(force ?? !this.open());
  }

  private commit(items: CartItem[]) {
    this.itemsSignal.set(items);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  private read(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
