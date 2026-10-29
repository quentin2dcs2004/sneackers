import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TPipe } from '../../pipes/t.pipe';
import { I18nService } from '../../services/i18n.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-menu-overlay',
  standalone: true,
  imports: [RouterLink, TPipe],
  templateUrl: './menu-overlay.html',
  styleUrl: './menu-overlay.scss',
})
export class MenuOverlayComponent {
  readonly ui = inject(UiService);
  private readonly i18n = inject(I18nService);

  readonly links = computed(() => {
    this.i18n.lang();
    return [
      { path: '/shop', label: this.i18n.t('nav.shop'), index: '01' },
      { path: '/shop', label: this.i18n.t('nav.new'), index: '02', query: { sort: 'new' } },
      { path: '/lookbook', label: this.i18n.t('nav.lookbook'), index: '03' },
      { path: '/about', label: this.i18n.t('nav.about'), index: '04' },
    ];
  });

  close() {
    this.ui.toggleMenu(false);
  }
}
