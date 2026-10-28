import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, RevealDirective, NgClass, TiltDirective],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() index = 0;
}
