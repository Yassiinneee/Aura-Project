import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { HeroBanner } from './components/HeroBanner.jsx';
import { ProductCard } from './components/ProductCard.jsx';
import { ProductModal } from './components/ProductModal.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';
import { CheckoutModal } from './components/CheckoutModal.jsx';
import { OrderSuccessModal } from './components/OrderSuccessModal.jsx';
import { AiAssistant } from './components/AiAssistant.jsx';
import { OrdersModal } from './components/OrdersModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { AdminModal } from './components/AdminModal.jsx';
import { WishlistModal } from './components/WishlistModal.jsx';
import { ReviewModal } from './components/ReviewModal.jsx';
import { NotificationCenter } from './components/NotificationCenter.jsx';
import { Footer } from './components/Footer.jsx';
import {
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Tag,
  Filter,
  Check,
  Star,
  DollarSign,
  Package,
  BellRing
} from 'lucide-react';
import { useGetCategoriesQuery, useGetProductsQuery } from './store/apiSlice.js';
import { getSocket } from './utils/socket.js';

export default function App() {
  // --- URL Search Params Synchronization (FEATURE-008) ---
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      category: params.get('category') || 'All',
      search: params.get('q') || '',
      sortBy: params.get('sort') || 'featured',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      inStockOnly: params.get('inStock') === 'true',
      ratingMin: params.get('ratingMin') || '',
    };
  };

  const initialParams = getUrlParams();

  const [selectedCategory, setSelectedCategory] = useState(initialParams.category);
  const [searchQuery, setSearchQuery] = useState(initialParams.search);
  const [sortBy, setSortBy] = useState(initialParams.sortBy);
  const [minPrice, setMinPrice] = useState(initialParams.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialParams.maxPrice);
  const [inStockOnly, setInStockOnly] = useState(initialParams.inStockOnly);
  const [ratingMin, setRatingMin] = useState(initialParams.ratingMin);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Sync state back to URL
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    if (searchQuery) params.set('q', searchQuery);
    if (sortBy && sortBy !== 'featured') params.set('sort', sortBy);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (inStockOnly) params.set('inStock', 'true');
    if (ratingMin) params.set('ratingMin', ratingMin);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [selectedCategory, searchQuery, sortBy, minPrice, maxPrice, inStockOnly, ratingMin]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = getUrlParams();
      setSelectedCategory(p.category);
      setSearchQuery(p.search);
      setSortBy(p.sortBy);
      setMinPrice(p.minPrice);
      setMaxPrice(p.maxPrice);
      setInStockOnly(p.inStockOnly);
      setRatingMin(p.ratingMin);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- RTK Query: Categories & Products ---
  const { data: categories = [] } = useGetCategoriesQuery();

  const activeCategoryObj = categories.find(
    (c) => c.slug === selectedCategory || c.name === selectedCategory
  );
  const activeSlug = activeCategoryObj ? activeCategoryObj.slug : (selectedCategory === 'All' ? 'all' : selectedCategory);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const {
    data: products = [],
    isLoading: loadingProducts,
    refetch: refetchProducts,
  } = useGetProductsQuery({
    categorySlug: activeSlug !== 'all' ? activeSlug : undefined,
    category: activeCategoryObj ? activeCategoryObj.name : (selectedCategory !== 'All' ? selectedCategory : undefined),
    search: searchQuery || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    inStockOnly: inStockOnly ? 'true' : undefined,
    ratingMin: ratingMin || undefined,
    sort: sortBy || undefined,
  });

  // --- User Authentication State ---
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('aura_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // --- Cart State (Scoped to active session) ---
  const [cart, setCart] = useState(() => {
    try {
      const savedUser = localStorage.getItem('aura_user');
      if (!savedUser) return [];
      const user = JSON.parse(savedUser);
      const userCartKey = user?.email ? `aura_cart_${user.email}` : 'aura_cart';
      const saved = localStorage.getItem(userCartKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // --- Modals State ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewTargetProduct, setReviewTargetProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState(undefined);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [liveToast, setLiveToast] = useState(null);

  // --- Real-time Socket.IO Listeners (FEATURE-011, FEATURE-012) ---
  useEffect(() => {
    const email = currentUser?.email || localStorage.getItem('aura_user_email');
    const token = localStorage.getItem('aura_token');
    const socket = getSocket(token, email);

    const onNotification = (notif) => {
      setLiveToast(notif);
      setTimeout(() => setLiveToast(null), 6000);
      refetchProducts();
    };

    socket.on('notification.created', onNotification);
    socket.on('order.updated', (order) => {
      setLiveToast({
        title: `Order Status: ${order.status}`,
        message: `Order #${order.orderId} updated to ${order.status}`,
      });
      setTimeout(() => setLiveToast(null), 6000);
    });

    return () => {
      socket.off('notification.created', onNotification);
      socket.off('order.updated');
    };
  }, [currentUser, refetchProducts]);

  useEffect(() => {
    try {
      if (currentUser?.email) {
        localStorage.setItem(`aura_cart_${currentUser.email}`, JSON.stringify(cart));
      } else {
        localStorage.removeItem('aura_cart');
      }
    } catch (e) {
      console.error(e);
    }
  }, [cart, currentUser]);

  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('aura_user', JSON.stringify(user));
    localStorage.setItem('aura_user_email', user.email);
    localStorage.setItem('aura_token', token);

    // Restore this user's shopping bag if previously saved
    try {
      const savedUserCart = localStorage.getItem(`aura_cart_${user.email}`);
      if (savedUserCart) {
        setCart(JSON.parse(savedUserCart));
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsOrdersOpen(false);
    setIsAdminOpen(false);
    setIsWishlistOpen(false);
    setIsNotificationsOpen(false);
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_user_email');
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_cart');
  };

  const handleAddToCart = (product, color, size, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index, qty) => {
    if (qty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = qty;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOrderComplete = (order) => {
    setCart([]);
    setIsCheckoutOpen(false);
    setCompletedOrder(order);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setRatingMin('');
  };

  const hasActiveFilters = Boolean(
    (selectedCategory && selectedCategory !== 'All') ||
    searchQuery ||
    minPrice ||
    maxPrice ||
    inStockOnly ||
    ratingMin ||
    sortBy !== 'featured'
  );

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-stone-900 selection:text-white relative">
      {/* Real-time Push Toast (FEATURE-011) */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-stone-900 text-white p-4 rounded-xl shadow-2xl border border-stone-700 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg shrink-0">
            <BellRing className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-amber-300 truncate">{liveToast.title}</h4>
            <p className="text-xs text-stone-300 mt-0.5 leading-relaxed line-clamp-2">{liveToast.message}</p>
          </div>
          <button onClick={() => setLiveToast(null)} className="text-stone-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiAssistant={() => {
          setAiInitialPrompt(undefined);
          setIsAiOpen(true);
        }}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        categories={categories}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Hero Banner (Only on 'All' category and without search/filters) */}
      {selectedCategory === 'All' && !searchQuery && !minPrice && !maxPrice && (
        <HeroBanner
          onExploreClick={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAiAssistant={() => {
            setAiInitialPrompt('Can you recommend a signature piece from the collection for my living room?');
            setIsAiOpen(true);
          }}
        />
      )}

      {/* Main Catalog Section */}
      <main id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Navigation Pills */}
        <div className="mb-6 overflow-x-auto pb-2 flex items-center space-x-2">
          <button
            onClick={() => handleSelectCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              selectedCategory === 'All'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
            }`}
          >
            <span>All Collection</span>
          </button>
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.name || selectedCategory === cat.slug;
            return (
              <button
                key={cat.categoryId || cat.id || cat.slug || cat._id || `cat-${idx}`}
                onClick={() => handleSelectCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                }`}
              >
                <span>{cat.name}</span>
                {cat.itemCount !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {cat.itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Header & Filter Controls Bar (FEATURE-008) */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                <span>{activeCategoryObj ? activeCategoryObj.name : selectedCategory}</span>
                <span>&bull;</span>
                <span>{products.length} {products.length === 1 ? 'item' : 'items'} found</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                {activeCategoryObj ? activeCategoryObj.name : 'Curated Masterpieces'}
              </h2>
            </div>

            {/* Filter Toggle & Quick Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${
                  showFilterDrawer || hasActiveFilters
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters && '• Active'}</span>
              </button>

              <div className="flex items-center space-x-2 text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-stone-900 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Expanded Filter Panel (FEATURE-008) */}
          {showFilterDrawer && (
            <div className="mt-5 pt-5 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-150 text-xs">
              {/* Price Range */}
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Price Range ($)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                  <span className="text-stone-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Minimum Rating
                </label>
                <select
                  value={ratingMin}
                  onChange={(e) => setRatingMin(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">★ 4.5 & above</option>
                  <option value="4.0">★ 4.0 & above</option>
                  <option value="3.0">★ 3.0 & above</option>
                </select>
              </div>

              {/* Stock Status */}
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Availability
                </label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-stone-900 rounded border-stone-300 focus:ring-stone-900"
                  />
                  <span className="font-semibold text-stone-800">In Stock only</span>
                </label>
              </div>

              {/* Filter Reset */}
              <div className="flex items-end">
                <button
                  onClick={resetAllFilters}
                  className="w-full px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loadingProducts ? (
          <div className="text-center py-20">
            <p className="text-stone-500 text-sm animate-pulse">Loading curated artisanal pieces...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 my-8 shadow-xs">
            <p className="font-serif text-xl text-stone-700 mb-2">No matching products found</p>
            <p className="text-xs text-stone-400 mb-6">Try adjusting your filters, price range, or category selection.</p>
            <button
              onClick={resetAllFilters}
              className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id || product.productId}
                product={product}
                onQuickView={setSelectedProduct}
                onAddToCart={handleAddToCart}
                onOpenReviews={setReviewTargetProduct}
                user={currentUser}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            ))}
          </div>
        )}
      </main>

      {/* AI Assistant Floating Banner */}
      <section className="bg-gradient-to-r from-stone-900 to-stone-950 text-white py-12 my-16 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-stone-800 px-3 py-1 rounded-full text-xs font-medium text-amber-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Shopping Concierge</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium mb-2">Unsure what fits your space?</h3>
            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
              Ask Aura AI to recommend matching color palettes, explain artisanal materials, or curate a bespoke gift set tailored to your style.
            </p>
          </div>
          <button
            onClick={() => {
              setAiInitialPrompt('Can you help me design a minimalist living room setup?');
              setIsAiOpen(true);
            }}
            className="bg-white hover:bg-stone-100 text-stone-900 px-8 py-4 rounded-full font-medium text-xs tracking-wider uppercase transition-all shadow-xl flex items-center space-x-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Chat with Aura AI</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* --- Modals & Drawers --- */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenReviews={setReviewTargetProduct}
          user={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onAskAiAboutProduct={(name) => {
            setAiInitialPrompt(`Can you tell me more about ${name}? What are its standout features and care instructions?`);
            setIsAiOpen(true);
          }}
        />
      )}

      {reviewTargetProduct && (
        <ReviewModal
          isOpen={Boolean(reviewTargetProduct)}
          onClose={() => setReviewTargetProduct(null)}
          product={reviewTargetProduct}
          user={currentUser}
        />
      )}

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenProduct={setSelectedProduct}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        user={currentUser}
        onSelectOrder={() => setIsOrdersOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currentUser={currentUser}
        onOrderComplete={handleOrderComplete}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onContinueShopping={() => setCompletedOrder(null)}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        currentUser={currentUser}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        products={products}
        initialPrompt={aiInitialPrompt}
      />
    </div>
  );
}
