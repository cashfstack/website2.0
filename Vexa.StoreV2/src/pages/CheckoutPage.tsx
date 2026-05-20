import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, Zap, Check, Lock, Tag, ImageOff, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutPageProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function CheckoutPage({ onBack, onComplete }: CheckoutPageProps) {
  const { state, subtotal, clearCart } = useCart();

  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState('');
  const [promoError, setPromoError] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const promoCodes: Record<string, number> = {
    VEXA10: 10,
    GAMING20: 20,
    WELCOME15: 15,
  };

  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (promoCodes[code]) {
      setPromoApplied(code);
      setDiscount(promoCodes[code]);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied('');
      setDiscount(0);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';
    if (!cardName.trim()) errs.cardName = 'Cardholder name is required';
    if (cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Valid card number is required';
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) errs.cardExpiry = 'Valid expiry (MM/YY) required';
    if (cardCvc.length < 3) errs.cardCvc = 'Valid CVC required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));
    clearCart();
    setLoading(false);
    onComplete();
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f11] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-white font-bold text-2xl mb-2">Your cart is empty</h2>
          <p className="text-zinc-500 mb-6">Add some items before checking out</p>
          <button
            onClick={onBack}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Browse Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Store
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-bold text-3xl mb-10"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Contact */}
            <div className="bg-[#18181c] border border-white/6 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Contact Information</h2>
              <div>
                <label className="text-zinc-400 text-sm mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-[#0f0f11] border rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-white/10 focus:border-blue-500/50'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                )}
                <p className="text-zinc-600 text-xs mt-1.5">
                  Your purchase confirmation and delivery will be sent here.
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-[#18181c] border border-white/6 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-blue-400" />
                  <h2 className="text-white font-semibold text-lg">Payment Details</h2>
                </div>
                <div className="flex gap-1.5">
                  {['Visa', 'MC', 'Amex', 'PayPal'].map((card) => (
                    <span
                      key={card}
                      className="bg-white/5 text-zinc-500 text-[10px] font-medium px-2 py-1 rounded"
                    >
                      {card}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {/* Cardholder Name */}
                <div>
                  <label className="text-zinc-400 text-sm mb-1.5 block">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className={`w-full bg-[#0f0f11] border rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors ${
                      errors.cardName ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                    }`}
                  />
                  {errors.cardName && <p className="text-red-400 text-xs mt-1.5">{errors.cardName}</p>}
                </div>

                {/* Card Number */}
                <div>
                  <label className="text-zinc-400 text-sm mb-1.5 block">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className={`w-full bg-[#0f0f11] border rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors pr-12 font-mono tracking-wider ${
                        errors.cardNumber ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                      }`}
                    />
                    <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                  </div>
                  {errors.cardNumber && <p className="text-red-400 text-xs mt-1.5">{errors.cardNumber}</p>}
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 text-sm mb-1.5 block">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      className={`w-full bg-[#0f0f11] border rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors font-mono ${
                        errors.cardExpiry ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                      }`}
                    />
                    {errors.cardExpiry && <p className="text-red-400 text-xs mt-1.5">{errors.cardExpiry}</p>}
                  </div>
                  <div>
                    <label className="text-zinc-400 text-sm mb-1.5 block">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className={`w-full bg-[#0f0f11] border rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors font-mono ${
                        errors.cardCvc ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                      }`}
                    />
                    {errors.cardCvc && <p className="text-red-400 text-xs mt-1.5">{errors.cardCvc}</p>}
                  </div>
                </div>
              </div>

              {/* Stripe badge */}
              <div className="flex items-center gap-2 mt-4 text-zinc-600 text-xs">
                <Shield size={12} />
                Payments are encrypted and processed securely. We never store card details.
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-[#18181c] border border-white/6 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={16} className="text-violet-400" />
                <h2 className="text-white font-semibold">Promo Code</h2>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter code..."
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError('');
                    }}
                    className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors uppercase tracking-wider"
                  />
                  {promoApplied && (
                    <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  )}
                </div>
                <button
                  onClick={applyPromo}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-5 py-3 rounded-xl text-sm transition-all"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}
              {promoApplied && (
                <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                  <Check size={12} />
                  Code {promoApplied} applied — {discount}% off!
                </p>
              )}
              <p className="text-zinc-600 text-xs mt-2">Test codes: VEXA10, GAMING20, WELCOME15</p>
            </div>

            {/* Submit */}
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-xl transition-all text-lg ${
                loading
                  ? 'bg-blue-800 text-blue-300 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
              }`}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Pay ${total.toFixed(2)} — Instant Delivery
                  <Zap size={14} className="fill-white" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#18181c] border border-white/6 rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-semibold text-lg mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#111] flex-shrink-0">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff size={16} className="text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">
                        {item.product.title}
                      </h4>
                      <div className="flex items-center gap-2 text-zinc-500 text-xs mt-0.5">
                        <span>Qty: {item.quantity}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Zap size={8} />
                          {item.product.deliveryTime}
                        </span>
                      </div>
                    </div>
                    <span className="text-white text-sm font-medium">
                      ${((item.product.salePrice ?? item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Tag size={12} />
                      Promo ({discount}% off)
                    </span>
                    <span className="text-emerald-400">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Delivery</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Zap size={10} />
                    Free / Instant
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold border-t border-white/5 pt-3">
                  <span className="text-white">Total</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-6 space-y-2">
                {[
                  { icon: Shield, text: 'Secure SSL Checkout' },
                  { icon: Zap, text: 'Instant Delivery After Payment' },
                  { icon: Check, text: 'Money-Back Guarantee' },
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-2 text-zinc-600 text-xs">
                    <t.icon size={12} className="text-emerald-500" />
                    {t.text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
