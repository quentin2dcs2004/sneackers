import { Directive, ElementRef, HostListener, OnDestroy, inject } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[saMagnetic]',
  standalone: true,
  host: { class: 'is-magnetic' },
})
export class MagneticDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private tween?: gsap.core.Tween;

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent) {
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    this.tween?.kill();
    this.tween = gsap.to(node, { x: x * 0.22, y: y * 0.22, duration: 0.35, ease: 'power3.out' });
  }

  @HostListener('pointerleave')
  onLeave() {
    this.tween?.kill();
    this.tween = gsap.to(this.el.nativeElement, { x: 0, y: 0, duration: 0.55, ease: 'power3.out' });
  }

  ngOnDestroy() {
    this.tween?.kill();
  }
}
