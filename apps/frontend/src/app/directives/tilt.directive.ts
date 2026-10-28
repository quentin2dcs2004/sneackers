import { Directive, ElementRef, HostListener, OnDestroy, inject, input } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[saTilt]',
  standalone: true,
})
export class TiltDirective implements OnDestroy {
  readonly max = input(14, { alias: 'saTilt' });
  readonly glare = input(true, { alias: 'saTiltGlare' });

  private readonly el = inject(ElementRef<HTMLElement>);
  private glareNode?: HTMLElement;
  private tween?: gsap.core.Tween;

  constructor() {
    const node = this.el.nativeElement;
    node.style.transformStyle = 'preserve-3d';
    node.style.willChange = 'transform';
    node.style.position = node.style.position || 'relative';
    this.glareNode = document.createElement('span');
    this.glareNode.className = 'sa-tilt-glare';
    node.appendChild(this.glareNode);
  }

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent) {
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * this.max();
    const ry = (px - 0.5) * this.max();
    this.tween?.kill();
    this.tween = gsap.to(node, {
      rotateX: rx,
      rotateY: ry,
      transformPerspective: 900,
      duration: 0.35,
      ease: 'power3.out',
    });
    if (this.glareNode) {
      gsap.to(this.glareNode, {
        opacity: 0.55,
        background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.55), transparent 55%)`,
        duration: 0.25,
      });
    }
  }

  @HostListener('pointerleave')
  onLeave() {
    const node = this.el.nativeElement;
    this.tween?.kill();
    this.tween = gsap.to(node, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'power3.out',
    });
    if (this.glareNode) {
      gsap.to(this.glareNode, { opacity: 0, duration: 0.4 });
    }
  }

  ngOnDestroy() {
    this.tween?.kill();
    this.glareNode?.remove();
  }
}
