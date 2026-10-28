import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-menu-overlay',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu-overlay.html',
  styleUrl: './menu-overlay.scss',
})
export class MenuOverlayComponent {
  readonly ui = inject(UiService);

  readonly links = [
    { path: '/shop', label: 'Shop', index: '01' },
    { path: '/shop', label: 'New Drops', index: '02', query: { sort: 'new' } },
    { path: '/lookbook', label: 'Lookbook', index: '03' },
    { path: '/about', label: 'About', index: '04' },
  ];

  close() {
    this.ui.toggleMenu(false);
  }
}
