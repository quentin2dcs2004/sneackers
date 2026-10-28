import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  readonly ui = inject(UiService);
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
}
