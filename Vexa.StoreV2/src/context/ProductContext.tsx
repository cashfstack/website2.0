import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Review } from '../types';

const STORAGE_KEY = 'vexa-products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  importProducts: (products: Product[]) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'productId' | 'date' | 'verified'>) => void;
  getProductReviews: (productId: string) => Review[];
  getProductRating: (productId: string) => number;
  getProductReviewCount: (productId: string) => number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const starterProducts: Product[] = [
  {
    id: 'starter-1',
    title: 'Steam Wallet $50 Gift Card',
    description: 'Add $50 USD to your Steam wallet. Works globally.',
    longDescription: 'A $50 Steam Wallet Gift Card redeemable on the Steam platform. Use it to purchase games, DLC, software, and in-game items. No fees, no expiry. Delivered as a digital code within seconds of purchase.',
    price: 50.00,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
    category: 'currency',
    tags: ['steam', 'wallet', 'gift card', 'pc gaming'],
    stock: 300,
    platform: 'PC / Mac / Linux',
    deliveryTime: 'Instant',
    bestseller: true,
    featured: true,
    reviews: [],
  },
  {
    id: 'starter-2',
    title: 'Minecraft: Java Edition Key',
    description: 'Lifetime Minecraft Java Edition license. Official Mojang key.',
    longDescription: 'An official, unused Minecraft: Java Edition license key redeemable on the Microsoft/Mojang launcher. Full game access, all updates included forever. Works globally. One-time purchase, lifetime access.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=600&h=400&fit=crop',
    category: 'game-keys',
    tags: ['minecraft', 'java', 'mojang', 'sandbox'],
    stock: 75,
    platform: 'PC / Mac / Linux',
    deliveryTime: 'Instant',
    bestseller: true,
    reviews: [],
  },
  {
    id: 'starter-3',
    title: 'Fortnite V-Bucks 13,500',
    description: 'Official V-Bucks currency for Fortnite. Instant delivery via code.',
    longDescription: 'Get 13,500 V-Bucks for Fortnite — the in-game currency used to purchase outfits, gliders, pickaxes, emotes, and the Battle Pass. Delivered instantly as a redeemable code. Compatible with all platforms.',
    price: 79.99,
    salePrice: 64.99,
    image: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=600&h=400&fit=crop',
    category: 'currency',
    tags: ['fortnite', 'v-bucks', 'epic games'],
    stock: 150,
    platform: 'PC / Console / Mobile',
    deliveryTime: 'Instant',
    featured: true,
    bestseller: true,
    reviews: [],
  },
  {
    id: 'starter-4',
    title: 'Valorant Platinum Account',
    description: 'Platinum-ranked Valorant account with rare skins included.',
    longDescription: 'A fully verified Valorant account sitting at Platinum rank. Comes with 12+ rare skins, 2 Radiant-tier weapon bundles, and email access. Ready to use immediately.',
    price: 129.99,
    salePrice: 99.99,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&h=400&fit=crop',
    category: 'accounts',
    tags: ['valorant', 'platinum', 'riot games', 'ranked'],
    stock: 12,
    platform: 'PC',
    deliveryTime: 'Instant',
    featured: true,
    new: true,
    reviews: [],
  },
  {
    id: 'starter-5',
    title: 'CoD Warzone — Camo Unlock Boost',
    description: 'Get any mastery camo unlocked by our boosting team. 24h delivery.',
    longDescription: 'Our professional Call of Duty boosting service will unlock any Mastery Camo of your choice. Safe, manual boosting — no bots or cheats. Estimated completion: 12–24 hours.',
    price: 44.99,
    salePrice: 34.99,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=600&h=400&fit=crop',
    category: 'boosts',
    tags: ['cod', 'warzone', 'camo', 'boost'],
    stock: 28,
    platform: 'PC / PlayStation / Xbox',
    deliveryTime: '12–24 Hours',
    featured: true,
    reviews: [],
  },
  {
    id: 'starter-6',
    title: 'Apex Legends — 11,500 Coins',
    description: 'Apex Coins bundle. Buy Apex Packs, items & Battle Pass.',
    longDescription: 'Get 11,500 Apex Coins to spend on Legend skins, weapon cosmetics, Apex Packs, and the Battle Pass. Delivered as a digital top-up code. Works on all platforms.',
    price: 99.99,
    salePrice: 79.99,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop',
    category: 'currency',
    tags: ['apex legends', 'ea', 'coins', 'battle royale'],
    stock: 89,
    platform: 'PC / PlayStation / Xbox / Switch',
    deliveryTime: 'Instant',
    reviews: [],
  },
];

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: Product) => ({ ...p, reviews: p.reviews || [] }));
        }
      }
    } catch {}
    return starterProducts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [{ ...product, reviews: product.reviews || [] }, ...prev]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? { ...product, reviews: p.reviews } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProduct = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const importProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts.map(p => ({ ...p, reviews: p.reviews || [] })));
  }, []);

  const addReview = useCallback((productId: string, review: Omit<Review, 'id' | 'productId' | 'date' | 'verified'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId,
      date: new Date().toISOString(),
      verified: true,
    };
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, reviews: [newReview, ...p.reviews] } : p
    ));
  }, []);

  const getProductReviews = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.reviews || [];
  }, [products]);

  const getProductRating = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / product.reviews.length) * 10) / 10;
  }, [products]);

  const getProductReviewCount = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.reviews.length || 0;
  }, [products]);

  return (
    <ProductContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct, getProduct, importProducts,
      addReview, getProductReviews, getProductRating, getProductReviewCount,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
