import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartPage implements OnInit {
  readonly cart = inject(CartService);

  ngOnInit() {
    this.cart.toggle(true);
  }
}
