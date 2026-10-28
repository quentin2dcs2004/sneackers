export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  imageUrl: string;
  imageUrlAlt?: string;
  categorySlug: string;
  categoryName: string;
  featured: boolean;
  colorway: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}
