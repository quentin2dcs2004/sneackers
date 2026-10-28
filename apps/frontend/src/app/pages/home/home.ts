import { AfterViewInit, Component, ElementRef, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ProductSlider3dComponent } from '../../components/product-slider-3d/product-slider-3d';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ShoeRunwayComponent } from '../../components/shoe-runway/shoe-runway';
import { ShoeViewerComponent } from '../../components/shoe-viewer/shoe-viewer';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { RevealDirective } from '../../directives/reveal.directive';
import { Product } from '../../models/product.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    ProductSlider3dComponent,
    ProductCardComponent,
    ShoeRunwayComponent,
    ShoeViewerComponent,
    RevealDirective,
    MagneticDirective,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage implements OnInit, AfterViewInit {
  private readonly api = inject(ApiService);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly featured = signal<Product[]>([]);
  readonly latest = signal<Product[]>([]);
  readonly heroShoe = signal<Product | null>(null);

  ngOnInit() {
    this.api.getFeatured().subscribe((items) => {
      this.featured.set(items);
      this.heroShoe.set(items[0] ?? null);
    });
    this.api.getProducts().subscribe((items) => this.latest.set(items.slice(0, 8)));
  }

  ngAfterViewInit() {
    const root = this.host.nativeElement;
    gsap.from(root.querySelectorAll('.hero h1 span, .hero h1 em'), {
      yPercent: 110,
      opacity: 0,
      duration: 1.15,
      stagger: 0.12,
      ease: 'power4.out',
      delay: 0.08,
    });
    gsap.from(root.querySelectorAll('.hero__lead, .hero__cta, .hero__eyebrow, .hero__viewer'), {
      y: 28,
      opacity: 0,
      duration: 0.95,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.28,
    });
  }
}
