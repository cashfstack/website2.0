import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Save, Package, Search,
  ImageOff, Download, Upload, AlertTriangle, Check,
  Tag, ChevronDown, Eye, ToggleLeft, ToggleRight,
  Lock, LogOut, Key
} from 'lucide-react';
import { Product, Category } from '../types';
import { useProducts } from '../context/ProductContext';
import { categories, categoryLabels } from '../data/categories';

// CHANGE THIS PASSWORD to secure your admin panel
const ADMIN_PASSWORD = 'vexa-admin-2024';

type ModalMode = 'add' | 'edit' | null;

const emptyProduct: Omit<Product, 'id'> = {
  title: '',
  description: '',
  longDescription: '',
  price: 0,
  image: '',
  category: 'game-keys',
  tags: [],
  stock: 0,
  platform: '',
  deliveryTime: 'Instant',
  featured: false,
  new: false,
  bestseller: false,
  reviews: [],
};

export default function AdminPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { products, addProduct, updateProduct, deleteProduct, importProducts, getProductReviewCount } = useProducts();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [tagsInput, setTagsInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('vexa-admin-auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('vexa-admin-auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vexa-admin-auth');
    onNavigate('home');
  };

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openAdd = () => {
    setFormData({ ...emptyProduct, reviews: [] });
    setTagsInput('');
    setEditingProduct(null);
    setModalMode('add');
  };

  const openEdit = (product: Product) => {
    setFormData({ ...product });
    setTagsInput(product.tags.join(', '));
    setEditingProduct(product);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingProduct(null);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      showNotification('Product title is required', 'error');
      return;
    }
    if (formData.price <= 0) {
      showNotification('Price must be greater than 0', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    if (modalMode === 'add') {
      const newProduct: Product = {
        ...formData,
        id: `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        tags,
        reviews: [],
      };
      addProduct(newProduct);
      showNotification(`"${newProduct.title}" added successfully!`);
    } else if (modalMode === 'edit' && editingProduct) {
      const updated: Product = {
        ...formData,
        id: editingProduct.id,
        tags,
        reviews: editingProduct.reviews,
      };
      updateProduct(updated);
      showNotification(`"${updated.title}" updated successfully!`);
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    const product = products.find(p => p.id === id);
    deleteProduct(id);
    setDeleteConfirm(null);
    showNotification(`"${product?.title}" deleted`);
  };

  const handleExport = () => {
    const data = JSON.stringify(products, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vexa-products-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Products exported successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          importProducts(data.map((p: Product) => ({ ...p, reviews: p.reviews || [] })));
          showNotification(`${data.length} products imported successfully!`);
        } else {
          showNotification('Invalid file format', 'error');
        }
      } catch {
        showNotification('Failed to parse file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#18181c] border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-blue-400" />
            </div>
            <h1 className="text-white font-bold text-2xl">Admin Access</h1>
            <p className="text-zinc-500 text-sm mt-1">Enter your password to continue</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                placeholder="Enter admin password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className={`w-full bg-[#0f0f11] border rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors ${
                  passwordError ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                }`}
              />
            </div>
            {passwordError && (
              <p className="text-red-400 text-xs text-center">{passwordError}</p>
            )}
            <motion.button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Lock size={16} />
              Unlock Admin Panel
            </motion.button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full text-zinc-500 hover:text-zinc-300 text-sm py-2 transition-colors"
            >
              ← Back to Store
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={`fixed top-20 left-1/2 z-[100] flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium ${
                notification.type === 'success'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              }`}
            >
              {notification.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
              {notification.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-white font-bold text-3xl sm:text-4xl flex items-center gap-3">
              <Package size={32} className="text-blue-400" />
              Admin Panel
            </h1>
            <p className="text-zinc-500 mt-1">
              Manage your products — {products.length} total
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={openAdd}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus size={16} />
              Add Product
            </motion.button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium px-4 py-2.5 rounded-xl text-sm transition-all"
            >
              <Download size={14} />
              Export
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium px-4 py-2.5 rounded-xl text-sm transition-all"
            >
              <Upload size={14} />
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-400 font-medium px-4 py-2.5 rounded-xl text-sm transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: 'Total Products', value: products.length, color: 'text-blue-400' },
            { label: 'Featured', value: products.filter(p => p.featured).length, color: 'text-violet-400' },
            { label: 'On Sale', value: products.filter(p => p.salePrice).length, color: 'text-emerald-400' },
            { label: 'Out of Stock', value: products.filter(p => p.stock <= 0).length, color: 'text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#18181c] border border-white/6 rounded-xl p-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-zinc-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 text-zinc-300 text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-blue-500/50 cursor-pointer hover:bg-white/10 transition-all"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </motion.div>

        {filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 py-3 text-zinc-500 text-xs uppercase tracking-wider font-semibold">
              <div className="col-span-4">Product</div>
              <div className="col-span-1">Category</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Sale</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-1">Reviews</div>
              <div className="col-span-1">Flags</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-[#18181c] border border-white/6 hover:border-white/10 rounded-xl p-4 lg:p-5 transition-all"
                >
                  <div className="lg:hidden space-y-3">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#111] flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff size={18} className="text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm truncate">{product.title}</h3>
                        <p className="text-zinc-500 text-xs truncate">{product.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-white font-semibold text-sm">
                            ${(product.salePrice ?? product.price).toFixed(2)}
                          </span>
                          {product.salePrice && (
                            <span className="text-zinc-600 text-xs line-through">${product.price.toFixed(2)}</span>
                          )}
                          <span className="text-zinc-600 text-xs">· {product.stock} in stock</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.featured && (
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded font-medium">Featured</span>
                      )}
                      {product.bestseller && (
                        <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded font-medium">Bestseller</span>
                      )}
                      {product.new && (
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-medium">New</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium py-2 rounded-lg transition-all"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => onNavigate('product-detail-' + product.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium py-2 rounded-lg transition-all"
                      >
                        <Eye size={12} />
                        View
                      </button>
                      {deleteConfirm === product.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="bg-white/5 text-zinc-400 text-xs font-medium px-3 py-2 rounded-lg transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="flex items-center justify-center gap-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs font-medium px-3 py-2 rounded-lg transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                    <div className="col-span-4 flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#111] flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff size={14} className="text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-medium text-sm truncate">{product.title}</h3>
                        <p className="text-zinc-600 text-xs truncate">{product.description}</p>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <span className="text-blue-400 text-xs bg-blue-400/10 px-2 py-0.5 rounded font-medium">
                        {categoryLabels[product.category] || product.category}
                      </span>
                    </div>

                    <div className="col-span-1">
                      <span className="text-white text-sm font-medium">${product.price.toFixed(2)}</span>
                    </div>

                    <div className="col-span-1">
                      {product.salePrice ? (
                        <span className="text-emerald-400 text-sm font-medium">${product.salePrice.toFixed(2)}</span>
                      ) : (
                        <span className="text-zinc-600 text-sm">—</span>
                      )}
                    </div>

                    <div className="col-span-1">
                      <span className={`text-sm font-medium ${
                        product.stock <= 0 ? 'text-red-400' : product.stock <= 10 ? 'text-amber-400' : 'text-zinc-300'
                      }`}>
                        {product.stock}
                      </span>
                    </div>

                    <div className="col-span-1">
                      <span className="text-zinc-300 text-sm">
                        {getProductReviewCount(product.id)}
                      </span>
                    </div>

                    <div className="col-span-1 flex flex-wrap gap-1">
                      {product.featured && (
                        <span className="bg-blue-500/10 text-blue-400 text-[9px] px-1.5 py-0.5 rounded font-medium">F</span>
                      )}
                      {product.bestseller && (
                        <span className="bg-amber-500/10 text-amber-400 text-[9px] px-1.5 py-0.5 rounded font-medium">B</span>
                      )}
                      {product.new && (
                        <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-medium">N</span>
                      )}
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/8 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      {deleteConfirm === product.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="bg-white/5 text-zinc-400 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="flex items-center gap-1 text-zinc-600 hover:text-red-400 text-xs px-2 py-1.5 rounded-lg transition-all hover:bg-red-500/10"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-white font-semibold text-xl mb-2">
              {searchQuery ? 'No products match your search' : 'No products yet'}
            </h3>
            <p className="text-zinc-500 text-sm mb-6">
              {searchQuery ? 'Try a different search term' : 'Click "Add Product" to create your first product'}
            </p>
            {!searchQuery && (
              <motion.button
                onClick={openAdd}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus size={16} />
                Add Your First Product
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {modalMode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[90vh] bg-[#14141a] border border-white/10 rounded-2xl shadow-2xl z-[90] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h2 className="text-white font-bold text-lg">
                  {modalMode === 'add' ? '✨ Add New Product' : '✏️ Edit Product'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-zinc-500 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <div>
                  <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                    Product Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Fortnite V-Bucks 13,500"
                    value={formData.title}
                    onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                    Short Description
                  </label>
                  <input
                    type="text"
                    placeholder="Brief product summary (shown on cards)"
                    value={formData.description}
                    onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                    Full Description
                  </label>
                  <textarea
                    placeholder="Detailed product description (shown on detail page)"
                    value={formData.longDescription}
                    onChange={(e) => setFormData(f => ({ ...f, longDescription: e.target.value }))}
                    rows={4}
                    className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData(f => ({ ...f, image: e.target.value }))}
                    className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                  {formData.image && (
                    <div className="mt-2 w-20 h-14 rounded-lg overflow-hidden bg-[#111] border border-white/5">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(f => ({ ...f, category: e.target.value as Category }))}
                        className="w-full appearance-none bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 cursor-pointer transition-colors pr-10"
                      >
                        {categories.slice(1).map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                      Platform
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., PC / Console"
                      value={formData.platform || ''}
                      onChange={(e) => setFormData(f => ({ ...f, platform: e.target.value }))}
                      className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                      Price ($) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="99.99"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                      Sale Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Optional"
                      value={formData.salePrice || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setFormData(f => ({ ...f, salePrice: val > 0 ? val : undefined }));
                      }}
                      className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="100"
                      value={formData.stock || ''}
                      onChange={(e) => setFormData(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                    Delivery Time
                  </label>
                  <input
                    type="text"
                    placeholder="Instant"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData(f => ({ ...f, deliveryTime: e.target.value }))}
                    className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-sm font-medium mb-1.5 block">
                    Tags <span className="text-zinc-600">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., fortnite, v-bucks, epic games"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                  {tagsInput && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tagsInput.split(',').map((t, i) => t.trim() && (
                        <span key={i} className="flex items-center gap-1 bg-white/5 text-zinc-400 text-xs px-2 py-1 rounded">
                          <Tag size={8} />
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'featured' as const, label: 'Featured', color: 'text-blue-400' },
                    { key: 'bestseller' as const, label: 'Bestseller', color: 'text-amber-400' },
                    { key: 'new' as const, label: 'New', color: 'text-emerald-400' },
                  ].map(flag => (
                    <button
                      key={flag.key}
                      onClick={() => setFormData(f => ({ ...f, [flag.key]: !f[flag.key] }))}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border ${
                        formData[flag.key]
                          ? 'bg-white/8 border-white/15 text-white'
                          : 'bg-white/3 border-white/5 text-zinc-500'
                      }`}
                    >
                      {formData[flag.key] ? (
                        <ToggleRight size={18} className={flag.color} />
                      ) : (
                        <ToggleLeft size={18} />
                      )}
                      {flag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between gap-3">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={14} />
                  {modalMode === 'add' ? 'Add Product' : 'Save Changes'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
