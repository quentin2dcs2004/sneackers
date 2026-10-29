import { AfterViewInit, Component, ElementRef, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ShoeRunwayComponent } from '../../components/shoe-runway/shoe-runway';
import { SneakerStage3dComponent } from '../../components/sneaker-stage-3d/sneaker-stage-3d';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { RevealDirective } from '../../directives/reveal.directive';
import { Product } from '../../models/product.model';
import { TPipe } from '../../pipes/t.pipe';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    ProductCardComponent,
    ShoeRunwayComponent,
    SneakerStage3dComponent,
    RevealDirective,
    MagneticDirective,
    TPipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage implements OnInit, AfterViewInit {
  private readonly api = inject(ApiService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  readonly featured = signal<Product[]>([]);
  readonly latest = signal<Product[]>([]);

  ngOnInit() {
    this.api.getFeatured().subscribe((items) => this.featured.set(items));
    this.api.getProducts().subscribe((items) => this.latest.set(items.slice(0, 8)));
  }

  openProduct(product: Product) {
    this.router.navigate(['/shop', product.slug]);
  }

  ngAfterViewInit() {
    const root = this.host.nativeElement;
    gsap.from(root.querySelectorAll('.hero h1 span, .hero h1 em'), {
      yPercent: 110,
      opacity: 0,
      duration: 1.05,
      stagger: 0.1,
      ease: 'power4.out',
    });
    gsap.from(root.querySelectorAll('.hero__lead, .hero__cta, .hero__eyebrow, .hero__stage'), {
      y: 22,
      opacity: 0,
      duration: 0.85,
      stagger: 0.07,
      ease: 'power3.out',
      delay: 0.2,
    });
  }
}
