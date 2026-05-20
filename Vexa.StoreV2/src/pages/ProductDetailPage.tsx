import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Shield, Zap, RefreshCw, ShoppingCart, Check, Clock, Tag, ImageOff, Send, User, MessageSquare } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { categoryLabels } from '../data/categories';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onCheckout: () => void;
}

export default function ProductDetailPage({ product, onBack, onCheckout }: ProductDetailPageProps) {
  const { addItem } = useCart();
  const { addReview, getProductReviews, getProductRating, getProductReviewCount } = useProducts();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const price = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const rating = getProductRating(product.id);
  const reviewCount = getProductReviewCount(product.id);
  const reviews = getProductReviews(product.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product);
    onCheckout();
  };

  const handleSubmitReview = () => {
    if (!reviewName.trim() || !reviewComment.trim()) return;
    addReview(product.id, {
      name: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    setShowReviewForm(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Store
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#18181c] border border-white/6">
              {!imgError && product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                  <ImageOff size={60} className="text-zinc-600" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.new && (
                  <span className="bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                    New
                  </span>
                )}
                {product.bestseller && (
                  <span className="bg-amber-500/90 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                    Bestseller
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Shield, text: 'Secure Payment', sub: 'Protected' },
                { icon: Zap, text: 'Instant Delivery', sub: product.deliveryTime },
                { icon: RefreshCw, text: 'Easy Refunds', sub: '7-Day Policy' },
              ].map((t) => (
                <div
                  key={t.text}
                  className="bg-[#18181c] border border-white/6 rounded-xl p-3 text-center"
                >
                  <t.icon size={16} className="text-blue-400 mx-auto mb-1.5" />
                  <div className="text-white text-xs font-medium">{t.text}</div>
                  <div className="text-zinc-500 text-[10px] mt-0.5">{t.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-md">
                {categoryLabels[product.category] || product.category}
              </span>
              {product.platform && (
                <span className="text-xs text-zinc-500 bg-white/5 px-2.5 py-1 rounded-md">
                  {product.platform}
                </span>
              )}
            </div>

            <h1 className="text-white font-bold text-3xl sm:text-4xl leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-zinc-700'
                    }
                  />
                ))}
              </div>
              <span className="text-zinc-400 text-sm">
                {rating > 0 ? `${rating} · ${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 'No reviews yet'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-white font-black text-4xl">${price.toFixed(2)}</span>
                {product.salePrice && (
                  <>
                    <span className="text-zinc-600 text-xl line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-emerald-400 text-sm font-semibold bg-emerald-400/10 px-2 py-0.5 rounded-md">
                      Save ${(product.price - product.salePrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isOutOfStock
                      ? 'text-red-400'
                      : isLowStock
                      ? 'text-amber-400'
                      : 'text-zinc-400'
                  }`}
                >
                  {isOutOfStock
                    ? 'Out of Stock'
                    : isLowStock
                    ? `Only ${product.stock} remaining`
                    : `${product.stock} in stock`}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all ${
                    isOutOfStock
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                  }`}
                  whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                  whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                >
                  <Zap size={16} />
                  Buy Now
                </motion.button>
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all border ${
                    isOutOfStock
                      ? 'bg-zinc-800 text-zinc-600 border-zinc-800 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
                  whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
                >
                  {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                </motion.button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
              <h3 className="text-white font-semibold">About This Product</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{product.longDescription}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
              <h3 className="text-white font-semibold">Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/3 rounded-lg p-3">
                  <div className="text-zinc-500 text-xs mb-1">Delivery</div>
                  <div className="text-white text-sm font-medium flex items-center gap-1.5">
                    <Clock size={12} className="text-blue-400" />
                    {product.deliveryTime}
                  </div>
                </div>
                <div className="bg-white/3 rounded-lg p-3">
                  <div className="text-zinc-500 text-xs mb-1">Platform</div>
                  <div className="text-white text-sm font-medium">{product.platform || 'All'}</div>
                </div>
                <div className="bg-white/3 rounded-lg p-3">
                  <div className="text-zinc-500 text-xs mb-1">Category</div>
                  <div className="text-white text-sm font-medium">{categoryLabels[product.category] || product.category}</div>
                </div>
                <div className="bg-white/3 rounded-lg p-3">
                  <div className="text-zinc-500 text-xs mb-1">Availability</div>
                  <div className="text-white text-sm font-medium">{product.stock} units</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-white/5 text-zinc-400 text-xs px-3 py-1.5 rounded-lg"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex gap-3">
              <Shield size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-emerald-300 font-semibold text-sm">Vexa Purchase Guarantee</h4>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  If your product doesn't work as described, we'll replace it or issue a full refund — no questions asked.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 pt-10 border-t border-white/5"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-white font-bold text-2xl flex items-center gap-2">
                <MessageSquare size={22} className="text-blue-400" />
                Customer Reviews
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                {reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? 's' : ''} · ${rating.toFixed(1)} average` : 'No reviews yet — be the first!'}
              </p>
            </div>
            <motion.button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Send size={14} />
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </motion.button>
          </div>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-[#18181c] border border-white/6 rounded-2xl p-6 space-y-4">
                  <h3 className="text-white font-semibold">Leave a Review</h3>
                  
                  <div>
                    <label className="text-zinc-400 text-sm mb-1.5 block">Your Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full bg-[#0f0f11] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 text-sm mb-1.5 block">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={
                              star <= reviewRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-zinc-700'
                            }
                          />
                        </button>
                      ))}
                      <span className="text-zinc-400 text-sm ml-2">{reviewRating} / 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 text-sm mb-1.5 block">Your Review</label>
                    <textarea
                      placeholder="Share your experience with this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-5 py-2.5 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleSubmitReview}
                      disabled={!reviewName.trim() || !reviewComment.trim()}
                      className={`flex items-center gap-2 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all ${
                        reviewName.trim() && reviewComment.trim()
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      }`}
                      whileHover={reviewName.trim() && reviewComment.trim() ? { scale: 1.02 } : {}}
                      whileTap={reviewName.trim() && reviewComment.trim() ? { scale: 0.98 } : {}}
                    >
                      <Send size={14} />
                      Submit Review
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#18181c] border border-white/6 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <User size={18} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm">{review.name}</span>
                          {review.verified && (
                            <span className="text-emerald-400 text-[10px] bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-zinc-600 text-xs">{formatDate(review.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-700'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#18181c] border border-white/6 rounded-2xl">
              <MessageSquare size={40} className="text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-medium">No reviews yet</p>
              <p className="text-zinc-600 text-sm mt-1">Be the first to share your experience!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
