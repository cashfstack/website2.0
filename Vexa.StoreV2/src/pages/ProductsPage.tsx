import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface ProductsPageProps {
  onProductClick: (product: Product) => void;
  searchQuery: string;
  initialCategory?: string;
}

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

export default function ProductsPage({ onProductClick, searchQuery, initialCategory }: ProductsPageProps) {
  const { products, getProductRating, getProductReviewCount } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 500;
    return Math.ceil(Math.max(...products.map(p => p.price)) / 10) * 10;
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    result = result.filter(p => {
      const price = p.salePrice ?? p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case 'newest':
        result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case 'rating':
        result.sort((a, b) => getProductRating(b.id) - getProductRating(a.id));
        break;
      case 'popular':
      default:
        result.sort((a, b) => getProductReviewCount(b.id) - getProductReviewCount(a.id));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, priceRange, getProductRating, getProductReviewCount]);

  return (
    <div className="min-h-screen bg-[#0f0f11] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-white font-bold text-3xl sm:text-4xl">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-zinc-500 mt-2">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-between gap-4 mb-8"
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              showFilters
                ? 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white/5 border border-white/5 text-zinc-300 text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-blue-500/50 cursor-pointer hover:bg-white/10 transition-all"
            >
              <option value="popular">Most Reviewed</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-[#18181c] border border-white/6 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Price Range</h3>
                  <button
                    onClick={() => setPriceRange([0, maxPrice])}
                    className="text-blue-400 text-xs hover:underline"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-zinc-500 text-xs mb-1 block">Min Price</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        min={0}
                        max={priceRange[1]}
                        className="w-full bg-[#0f0f11] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <span className="text-zinc-600 mt-5">—</span>
                    <div className="flex-1">
                      <label className="text-zinc-500 text-xs mb-1 block">Max Price</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        min={priceRange[0]}
                        className="w-full bg-[#0f0f11] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>$0</span>
                    <span>${maxPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(selectedCategory !== 'all' || searchQuery || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory !== 'all' && (
              <span className="flex items-center gap-1.5 bg-blue-600/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-lg">
                {categories.find(c => c.id === selectedCategory)?.label}
                <button onClick={() => setSelectedCategory('all')}>
                  <X size={12} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="flex items-center gap-1.5 bg-violet-600/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-lg">
                Search: {searchQuery}
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <span className="flex items-center gap-1.5 bg-emerald-600/20 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-lg">
                ${priceRange[0]} — ${priceRange[1]}
                <button onClick={() => setPriceRange([0, maxPrice])}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onProductClick(product)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-white font-semibold text-xl mb-2">No products found</h3>
            <p className="text-zinc-500 text-sm mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange([0, maxPrice]);
              }}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
