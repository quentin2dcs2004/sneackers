import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  signal,
} from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-shoe-viewer',
  standalone: true,
  templateUrl: './shoe-viewer.html',
  styleUrl: './shoe-viewer.scss',
})
export class ShoeViewerComponent {
  @Input({ required: true }) imageUrl!: string;
  @Input() imageUrlAlt?: string | null;
  @Input() name = '';
  @Input() brand = '';
  @Input() compact = false;

  @ViewChild('stage', { static: true }) stage!: ElementRef<HTMLElement>;
  @ViewChild('shoeA', { static: true }) shoeA!: ElementRef<HTMLImageElement>;
  @ViewChild('shoeB') shoeB?: ElementRef<HTMLImageElement>;
  @ViewChild('ring', { static: true }) ring!: ElementRef<HTMLElement>;
  @ViewChild('lens', { static: true }) lens!: ElementRef<HTMLElement>;

  readonly inspecting = signal(false);
  readonly spin = signal(0);
  private dragging = false;
  private lastX = 0;

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent) {
    const stage = this.stage.nativeElement;
    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 28;
    const ry = (px - 0.5) * 36 + this.spin();

    gsap.to(this.shoeA.nativeElement, {
      rotateX: rx,
      rotateY: ry,
      rotateZ: (px - 0.5) * 6,
      x: (px - 0.5) * 30,
      y: (py - 0.5) * 18,
      scale: 1.04,
      duration: 0.45,
      ease: 'power3.out',
      transformPerspective: 1000,
    });

    if (this.shoeB) {
      gsap.to(this.shoeB.nativeElement, {
        opacity: px > 0.45 ? Math.min(1, (px - 0.45) * 2.2) : 0,
        rotateX: rx * 0.8,
        rotateY: ry * 0.8,
        x: (px - 0.5) * 20,
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    gsap.to(this.ring.nativeElement, {
      rotate: px * 40 + this.spin() * 0.3,
      scale: 0.92 + py * 0.12,
      duration: 0.5,
      ease: 'power2.out',
    });

    if (this.inspecting()) {
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      gsap.set(this.lens.nativeElement, {
        x: lx,
        y: ly,
        backgroundPosition: `${-lx * 1.6 + 80}px ${-ly * 1.6 + 80}px`,
      });
    }

    if (this.dragging) {
      this.spin.update((s) => s + (e.clientX - this.lastX) * 0.35);
      this.lastX = e.clientX;
    }
  }

  @HostListener('pointerleave')
  onLeave() {
    this.dragging = false;
    this.inspecting.set(false);
    gsap.to(this.shoeA.nativeElement, {
      rotateX: 0,
      rotateY: this.spin(),
      rotateZ: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
    if (this.shoeB) {
      gsap.to(this.shoeB.nativeElement, { opacity: 0, duration: 0.5 });
    }
  }

  @HostListener('pointerdown', ['$event'])
  onDown(e: PointerEvent) {
    this.dragging = true;
    this.lastX = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  @HostListener('pointerup')
  onUp() {
    this.dragging = false;
  }

  toggleInspect() {
    this.inspecting.update((v) => !v);
    const lens = this.lens.nativeElement;
    gsap.to(lens, {
      opacity: this.inspecting() ? 1 : 0,
      scale: this.inspecting() ? 1 : 0.6,
      duration: 0.35,
      ease: 'power3.out',
    });
  }

  autoSpin() {
    const start = this.spin();
    const proxy = { y: start };
    gsap.to(proxy, {
      y: start + 360,
      duration: 1.7,
      ease: 'power3.inOut',
      onUpdate: () => {
        this.spin.set(proxy.y);
        gsap.set(this.shoeA.nativeElement, { rotateY: proxy.y, transformPerspective: 1000 });
      },
    });
  }
}
