import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TPipe } from '../../pipes/t.pipe';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { I18nService } from '../../services/i18n.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, TPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  readonly ui = inject(UiService);
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  search = '';

  submitSearch() {
    const q = this.search.trim();
    this.ui.toggleMenu(false);
    this.router.navigate(['/shop'], { queryParams: q ? { q } : {} });
  }

  goNew() {
    this.router.navigate(['/shop'], { queryParams: { sort: 'new' } });
  }
}
