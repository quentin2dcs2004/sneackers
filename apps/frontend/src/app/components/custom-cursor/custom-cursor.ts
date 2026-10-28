import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  templateUrl: './custom-cursor.html',
  styleUrl: './custom-cursor.scss',
})
export class CustomCursorComponent {
  readonly x = signal(0);
  readonly y = signal(0);
  readonly hover = signal(false);
  readonly shoe = signal(false);
  readonly label = signal('');
  readonly visible = signal(false);

  @HostListener('document:mousemove', ['$event'])
  onMove(e: MouseEvent) {
    this.x.set(e.clientX);
    this.y.set(e.clientY);
    this.visible.set(true);
    const target = e.target as HTMLElement | null;
    const shoe = !!target?.closest('.is-shoe, app-shoe-viewer, .viewer');
    const interactive = !!target?.closest('a, button, .is-magnetic, input, select');
    this.shoe.set(shoe);
    this.hover.set(interactive || shoe);
    this.label.set(shoe ? 'INSPECT' : interactive ? 'VIEW' : '');
  }

  @HostListener('document:mouseleave')
  onLeave() {
    this.visible.set(false);
  }
}
