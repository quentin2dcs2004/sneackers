import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.scss',
})
export class AuthModalComponent {
  readonly ui = inject(UiService);
  private readonly auth = inject(AuthService);

  email = '';
  password = '';
  fullName = '';
  readonly error = signal<string | null>(null);
  readonly busy = signal(false);

  submit() {
    this.busy.set(true);
    this.error.set(null);
    const req =
      this.ui.authMode() === 'login'
        ? this.auth.login(this.email, this.password)
        : this.auth.register(this.email, this.password, this.fullName);

    req.subscribe({
      next: () => {
        this.busy.set(false);
        this.ui.closeAuth();
        this.email = this.password = this.fullName = '';
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message || 'Authentification impossible');
      },
    });
  }
}
