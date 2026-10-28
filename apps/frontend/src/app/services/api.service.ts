import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, Product } from '../models/product.model';
import { AuthResponse, User } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  getProducts(filters: {
    category?: string;
    brand?: string;
    q?: string;
    minPrice?: number;
    maxPrice?: number;
  } = {}): Observable<Product[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (typeof value === 'number' && Number.isNaN(value)) return;
      params = params.set(key, String(value));
    });
    return this.http.get<Product[]>(`${this.base}/products`, { params });
  }

  getFeatured(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products/featured`);
  }

  getProduct(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${slug}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }

  register(payload: { email: string; password: string; fullName: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, payload);
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.base}/auth/me`);
  }

  createOrder(items: { productId: number; size: string; quantity: number }[]) {
    return this.http.post(`${this.base}/orders`, { items });
  }
}
