import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Clock, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface HomePageProps {
  onProductClick: (product: Product) => void;
  onNavigate: (page: string, category?: string) => void;
}

const trustBadges = [
  {
    icon: Shield,
    title: 'Verified & Secure',
    desc: 'Every product is verified before listing. Your payment is protected.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    desc: 'Most orders delivered within seconds. Access your purchase immediately.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    desc: 'Our support team is available around the clock for any issues.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
  {
    icon: Shield,
    title: 'Money-Back Guarantee',
    desc: "If your product doesn't work, we'll replace it or refund you — no questions asked.",
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage({ onProductClick, onNavigate }: HomePageProps) {
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured);
  const bestsellers = products.filter((p) => p.bestseller);

  return (
    <div className="min-h-screen bg-[#0f0f11]">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-[#0a0a1a] via-[#0f0f11] to-[#0d0d18]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f11]/60 via-[#0f0f11]/40 to-[#0f0f11]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Logo in hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-8"
            >
              <img
                src="/images/logo.png"
                alt="Vexa.Store"
                className="h-24 sm:h-32 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            >
              <Zap size={12} className="fill-blue-400" />
              Instant Digital Delivery
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight"
            >
              Your Premium
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Gaming Marketplace
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-zinc-400 text-lg leading-relaxed max-w-xl"
            >
              Game keys, premium accounts, boosts, and in-game currency — delivered
              instantly. Browse our store and find exactly what you need.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <motion.button
                onClick={() => onNavigate('products')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Browse Store
                <ArrowRight size={16} />
              </motion.button>
              <motion.button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-2 bg-white/6 hover:bg-white/10 border border-white/10 text-white font-semibold px-7 py-3.5 rounded-xl transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Manage Products
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-[#0f0f11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-white font-bold text-3xl">Shop by Category</h2>
            <p className="text-zinc-500 mt-2">Find exactly what you're looking for</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          >
            {categories.slice(1).map((cat) => (
              <motion.button
                key={cat.id}
                variants={itemVariants}
                onClick={() => onNavigate('products', cat.id)}
                className="group bg-[#18181c] border border-white/6 hover:border-blue-500/30 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all hover:bg-blue-500/5"
                whileHover={{ y: -3 }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-zinc-300 group-hover:text-white font-medium text-sm transition-colors">
                  {cat.label}
                </span>
                <ChevronRight size={14} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20 bg-[#0c0c0e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <h2 className="text-white font-bold text-3xl">Featured</h2>
                <p className="text-zinc-500 mt-2">Hand-picked deals just for you</p>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="hidden sm:flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View All
                <ArrowRight size={14} />
              </button>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {featured.slice(0, 6).map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard
                    product={product}
                    onClick={() => onProductClick(product)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="py-20 bg-[#0f0f11]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <h2 className="text-white font-bold text-3xl">Bestsellers</h2>
                <p className="text-zinc-500 mt-2">Our most popular products</p>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="hidden sm:flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View All
                <ArrowRight size={14} />
              </button>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {bestsellers.slice(0, 6).map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard
                    product={product}
                    onClick={() => onProductClick(product)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="py-20 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-white font-bold text-3xl">Why Choose Vexa.Store?</h2>
            <p className="text-zinc-500 mt-2">We prioritize your security and satisfaction</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {trustBadges.map((badge) => (
              <motion.div
                key={badge.title}
                variants={itemVariants}
                className="bg-[#18181c] border border-white/6 rounded-2xl p-6 text-center"
              >
                <div className={`w-12 h-12 ${badge.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <badge.icon size={22} className={badge.color} />
                </div>
                <h3 className="text-white font-semibold mb-2">{badge.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{badge.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Empty State CTA */}
      {products.length === 0 && (
        <section className="py-20 bg-[#0f0f11]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6">🏪</div>
            <h2 className="text-white font-bold text-3xl mb-3">Your store is empty</h2>
            <p className="text-zinc-500 mb-8">Head to the Admin Panel to add your first product and get started!</p>
            <motion.button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Open Admin Panel
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0a0a0c] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Vexa.Store"
                className="h-8 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                      </div>
                      <span class="text-white font-bold">Vexa<span class="text-blue-400">.Store</span></span>
                    `;
                  }
                }}
              />
            </div>
            <p className="text-zinc-600 text-sm">
              © {new Date().getFullYear()} Vexa.Store — Premium Digital Gaming Marketplace
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
