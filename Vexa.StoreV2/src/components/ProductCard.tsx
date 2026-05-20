import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Clock, Check, ImageOff } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { categoryLabels } from '../data/categories';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addItem } = useCart();
  const { getProductRating, getProductReviewCount } = useProducts();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const rating = getProductRating(product.id);
  const reviewCount = getProductReviewCount(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group bg-[#18181c] border border-white/6 hover:border-blue-500/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#111114]">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-violet-500/10">
            <ImageOff size={40} className="text-zinc-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181c] via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.new && (
            <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              New
            </span>
          )}
          {product.bestseller && (
            <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              Bestseller
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category + Delivery */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md">
            {categoryLabels[product.category] || product.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-500">
            <Clock size={10} />
            {product.deliveryTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-300 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={
                  i < Math.round(rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-zinc-700'
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-zinc-500">
            {rating > 0 ? `${rating} (${reviewCount})` : 'No reviews yet'}
          </span>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-1.5 mb-3">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
          <span
            className={`text-[10px] font-medium ${
              isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-zinc-500'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left` : 'In Stock'}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div>
            {product.salePrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-white font-bold text-base">
                  ${product.salePrice.toFixed(2)}
                </span>
                <span className="text-zinc-600 text-xs line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-white font-bold text-base">${product.price.toFixed(2)}</span>
            )}
          </div>
          <motion.button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : added
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
            }`}
            whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
          >
            {added ? <Check size={14} /> : <ShoppingCart size={14} />}
            {added ? 'Added' : 'Add'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
