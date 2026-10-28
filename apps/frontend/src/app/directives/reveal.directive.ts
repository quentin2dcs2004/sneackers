import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[saReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit() {
    const node = this.el.nativeElement;
    node.classList.add('sa-reveal');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add('is-in');
            this.observer?.unobserve(node);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(node);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
