import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductProvider, useProducts } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminPage from './pages/AdminPage';
import { Product, Page } from './types';

function AppInner() {
  const { getProduct } = useProducts();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialCategory, setInitialCategory] = useState<string | undefined>(undefined);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProduct]);

  const handleNavigate = (page: string, category?: string) => {
    // Handle product-detail navigation from admin
    if (page.startsWith('product-detail-')) {
      const productId = page.replace('product-detail-', '');
      const product = getProduct(productId);
      if (product) {
        setSelectedProduct(product);
        setCurrentPage('product-detail');
        return;
      }
    }

    if (category) {
      setInitialCategory(category);
    } else {
      setInitialCategory(undefined);
    }
    setCurrentPage(page as Page);
    if (page !== 'product-detail') {
      setSelectedProduct(null);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q && currentPage !== 'products') {
      setCurrentPage('products');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11]">
      {/* Navbar — always visible except confirmation */}
      {currentPage !== 'confirmation' && (
        <Navbar
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onNavigate={handleNavigate}
          currentPage={currentPage}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer onCheckout={() => setCurrentPage('checkout')} />

      {/* Pages */}
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage
              onProductClick={handleProductClick}
              onNavigate={handleNavigate}
            />
          </motion.div>
        )}

        {currentPage === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductsPage
              onProductClick={handleProductClick}
              searchQuery={searchQuery}
              initialCategory={initialCategory}
            />
          </motion.div>
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <motion.div
            key="product-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => setCurrentPage('products')}
              onCheckout={() => setCurrentPage('checkout')}
            />
          </motion.div>
        )}

        {currentPage === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckoutPage
              onBack={() => setCurrentPage('products')}
              onComplete={() => setCurrentPage('confirmation')}
            />
          </motion.div>
        )}

        {currentPage === 'confirmation' && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ConfirmationPage onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentPage === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPage onNavigate={handleNavigate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </ProductProvider>
  );
}
