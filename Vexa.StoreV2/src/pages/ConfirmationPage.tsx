import { motion } from 'framer-motion';
import { CheckCircle, Mail, Zap, ArrowRight, Copy, Shield } from 'lucide-react';
import { useState } from 'react';

interface ConfirmationPageProps {
  onNavigate: (page: string) => void;
}

export default function ConfirmationPage({ onNavigate }: ConfirmationPageProps) {
  const [copied, setCopied] = useState(false);
  const orderId = `VXA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        {/* Success Icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-emerald-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white font-bold text-3xl mb-2"
          >
            Payment Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400"
          >
            Your order has been confirmed and is being processed
          </motion.p>
        </div>

        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#18181c] border border-white/6 rounded-2xl p-6 space-y-5"
        >
          {/* Order ID */}
          <div>
            <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1.5">Order ID</div>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono font-medium">{orderId}</span>
              <button
                onClick={handleCopy}
                className="text-zinc-500 hover:text-blue-400 transition-colors p-1"
                title="Copy"
              >
                {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Status */}
          <div>
            <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1.5">Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-medium text-sm">Delivered</span>
            </div>
          </div>

          {/* Delivery */}
          <div>
            <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1.5">Delivery Method</div>
            <div className="flex items-center gap-2 text-white text-sm">
              <Mail size={14} className="text-blue-400" />
              Instant — Sent to Email
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Next Steps */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">What's next?</h3>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Check your email inbox for your purchase receipt' },
                { step: '2', text: 'Follow the redemption instructions in the email' },
                { step: '3', text: 'Contact support if you have any issues' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </span>
                  <span className="text-zinc-400 text-sm">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
            <Shield size={16} className="text-emerald-400 flex-shrink-0" />
            <p className="text-zinc-400 text-xs">
              Protected by the Vexa Purchase Guarantee. Issues? We'll replace or refund.
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-3"
        >
          <motion.button
            onClick={() => onNavigate('products')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue Shopping
            <ArrowRight size={16} />
          </motion.button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium py-3.5 rounded-xl transition-all text-sm"
          >
            <Zap size={14} />
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
