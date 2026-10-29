import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ShoeViewerComponent } from '../../components/shoe-viewer/shoe-viewer';
import { Product } from '../../models/product.model';
import { TPipe } from '../../pipes/t.pipe';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, ShoeViewerComponent, TPipe],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class ProductPage implements OnInit, AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly cart = inject(CartService);

  readonly product = signal<Product | null>(null);
  readonly sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  selectedSize = '42';
  readonly added = signal(false);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) return;
      this.api.getProduct(slug).subscribe((p) => {
        this.product.set(p);
        this.added.set(false);
        this.selectedSize = '42';
        queueMicrotask(() => this.animateIn());
      });
    });
  }

  ngAfterViewInit() {
    this.animateIn();
  }

  sizeOptions() {
    return this.sizes;
  }

  add() {
    const p = this.product();
    if (!p) return;
    this.cart.add(p, this.selectedSize, 1);
    this.added.set(true);
    const btn = this.host.nativeElement.querySelector('.product__cta');
    if (btn) {
      gsap.fromTo(btn, { scale: 0.94 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1,0.5)' });
    }
  }

  private animateIn() {
    const root = this.host.nativeElement;
    const title = root.querySelectorAll('.product__info > *');
    if (!title.length) return;
    gsap.from(title, {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.06,
      ease: 'power3.out',
    });
  }
}
