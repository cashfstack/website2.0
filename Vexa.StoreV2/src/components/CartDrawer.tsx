import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, ImageOff } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { state, removeItem, updateQuantity, closeCart, subtotal } = useCart();

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#14141a] border-l border-white/5 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <ShoppingBag size={16} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Your Cart</h2>
                  <p className="text-zinc-500 text-xs">
                    {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="text-zinc-500 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <ShoppingBag size={28} className="text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 font-medium">Your cart is empty</p>
                  <p className="text-zinc-600 text-sm mt-1">Browse the store and add items</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {state.items.map((item) => {
                      const price = item.product.salePrice ?? item.product.price;
                      return (
                        <motion.div
                          key={item.product.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          className="flex gap-4 bg-white/3 border border-white/5 rounded-xl p-3"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#111] flex-shrink-0">
                            {item.product.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
                                  const icon = document.createElement('span');
                                  icon.textContent = '🎮';
                                  icon.className = 'text-2xl';
                                  (e.target as HTMLImageElement).parentElement!.appendChild(icon);
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageOff size={20} className="text-zinc-600" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium truncate">
                              {item.product.title}
                            </h4>
                            <p className="text-blue-400 text-sm font-semibold mt-1">
                              ${(price * item.quantity).toFixed(2)}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-0.5">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.product.id, item.quantity - 1)
                                  }
                                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-white text-xs font-medium w-6 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      Math.min(item.quantity + 1, item.product.stock)
                                    )
                                  }
                                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t border-white/5 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Subtotal</span>
                  <span className="text-white font-bold text-lg">${subtotal.toFixed(2)}</span>
                </div>
                <motion.button
                  onClick={() => {
                    closeCart();
                    onCheckout();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </motion.button>
                <p className="text-center text-zinc-600 text-xs">
                  Secure checkout • Instant delivery
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
