import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop').then((m) => m.ShopPage),
  },
  {
    path: 'shop/:slug',
    loadComponent: () => import('./pages/product/product').then((m) => m.ProductPage),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then((m) => m.CartPage),
  },
  {
    path: 'lookbook',
    loadComponent: () => import('./pages/lookbook/lookbook').then((m) => m.LookbookPage),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage),
  },
  { path: '**', redirectTo: '' },
];
