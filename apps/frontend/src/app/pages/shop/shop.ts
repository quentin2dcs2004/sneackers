import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { RevealDirective } from '../../directives/reveal.directive';
import { Category, Product } from '../../models/product.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [FormsModule, ProductCardComponent, RevealDirective],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class ShopPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly brandOptions = signal<string[]>([]);
  readonly filtersOpen = signal(false);

  category = '';
  brand = '';
  q = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  ngOnInit() {
    this.api.getCategories().subscribe((c) => this.categories.set(c));
    this.api.getProducts().subscribe((all) => {
      this.brandOptions.set([...new Set(all.map((p) => p.brand))].sort());
    });
    this.route.queryParamMap.subscribe(() => this.load());
    this.load();
  }

  load() {
    this.api
      .getProducts({
        category: this.category || undefined,
        brand: this.brand || undefined,
        q: this.q || undefined,
        minPrice: this.parsePrice(this.minPrice),
        maxPrice: this.parsePrice(this.maxPrice),
      })
      .subscribe({
        next: (items) => this.products.set(items),
        error: () => this.products.set([]),
      });
  }

  private parsePrice(value: number | string | null | undefined): number | undefined {
    if (value === null || value === undefined || value === '') return undefined;
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : undefined;
  }

  reset() {
    this.category = '';
    this.brand = '';
    this.q = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.load();
  }
}
