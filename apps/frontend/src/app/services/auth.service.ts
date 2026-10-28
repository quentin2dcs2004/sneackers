import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, User } from '../models/auth.model';

const TOKEN_KEY = 'sa_token';
const USER_KEY = 'sa_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly userSignal = signal<User | null>(this.readUser());
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.tokenSignal());

  login(email: string, password: string) {
    return this.api.login({ email, password }).pipe(tap((res) => this.persist(res)));
  }

  register(email: string, password: string, fullName: string) {
    return this.api.register({ email, password, fullName }).pipe(tap((res) => this.persist(res)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private persist(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.tokenSignal.set(res.accessToken);
    this.userSignal.set(res.user);
  }

  private readUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
