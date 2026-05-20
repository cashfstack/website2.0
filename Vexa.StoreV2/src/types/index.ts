export type Category = 'game-keys' | 'accounts' | 'boosts' | 'cosmetics' | 'currency';

export interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  salePrice?: number;
  image: string;
  category: Category;
  tags: string[];
  stock: number;
  platform?: string;
  deliveryTime: string;
  featured?: boolean;
  new?: boolean;
  bestseller?: boolean;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Page = 'home' | 'products' | 'product-detail' | 'checkout' | 'confirmation' | 'admin';
