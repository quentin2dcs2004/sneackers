import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { Product } from '../../models/product.model';
import { TiltDirective } from '../../directives/tilt.directive';

@Component({
  selector: 'app-shoe-runway',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, TiltDirective],
  templateUrl: './shoe-runway.html',
  styleUrl: './shoe-runway.scss',
})
export class ShoeRunwayComponent implements AfterViewInit, OnDestroy {
  @Input() products: Product[] = [];
  @ViewChild('track', { static: true }) track!: ElementRef<HTMLElement>;
  @ViewChildren('panel') panels!: QueryList<ElementRef<HTMLElement>>;

  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private raf = 0;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      () => this.paint(),
      { threshold: [0, 0.25, 0.5, 0.75, 1], root: this.track.nativeElement },
    );
    this.panels.changes.subscribe(() => this.bind());
    this.bind();
    this.track.nativeElement.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.track.nativeElement.removeEventListener('scroll', this.onScroll);
    cancelAnimationFrame(this.raf);
  }

  private bind() {
    this.observer?.disconnect();
    this.panels.forEach((p) => this.observer?.observe(p.nativeElement));
    this.paint();
  }

  private onScroll = () => {
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => this.paint());
  };

  private paint() {
    const root = this.track.nativeElement;
    const mid = root.scrollLeft + root.clientWidth / 2;
    this.panels.forEach((ref, i) => {
      const el = ref.nativeElement;
      const center = el.offsetLeft + el.offsetWidth / 2;
      const dist = (center - mid) / root.clientWidth;
      const abs = Math.min(1, Math.abs(dist));
      gsap.set(el, {
        rotateY: dist * -28,
        scale: 1 - abs * 0.18,
        z: (1 - abs) * 80,
        opacity: 1 - abs * 0.35,
        filter: `blur(${abs * 2.2}px)`,
      });
      const media = el.querySelector('.runway__media') as HTMLElement | null;
      if (media) {
        gsap.set(media, { rotateZ: dist * 8, y: Math.sin(dist * Math.PI) * 18 });
      }
    });
  }

  scrollByDir(dir: number) {
    const root = this.track.nativeElement;
    root.scrollBy({ left: dir * root.clientWidth * 0.72, behavior: 'smooth' });
  }
}
