import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Sparkles,
  PackageOpen,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Heart,
  Bell
} from 'lucide-react';
import { useGetWishlistQuery, useGetNotificationsQuery } from '../store/apiSlice.js';

export const Navbar = ({
  cartCount,
  onOpenCart,
  onOpenAiAssistant,
  onOpenOrders,
  onOpenAuth,
  currentUser,
  onLogout,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories = [],
  onOpenAdmin,
  onOpenWishlist,
  onOpenNotifications,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isAdmin = currentUser && currentUser.role === 'admin';
  const userEmail = currentUser?.email;

  // Wishlist count
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !currentUser });
  const wishlistCount = wishlistData?.productIds?.length || 0;

  // Notifications unread count
  const { data: notifications = [] } = useGetNotificationsQuery(userEmail, {
    skip: !userEmail,
    pollingInterval: 20000,
  });
  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-2xs">
      {/* Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-100 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <span>Complimentary express shipping on orders over $100 &bull; Code <span className="underline font-semibold text-amber-300">AURA10</span> for 10% off</span>
        {isAdmin && (
          <span className="hidden sm:inline bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded text-[10px] ml-2 tracking-wide">
            ADMIN RBAC ACTIVE
          </span>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <span className="font-bold text-lg">✕</span> : <span className="font-bold text-lg">☰</span>}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <a href="#" className="inline-block" onClick={(e) => { e.preventDefault(); onSelectCategory('All'); }}>
              <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900">
                AURA <span className="font-sans text-xs tracking-widest uppercase font-semibold text-stone-500 block sm:inline sm:ml-2">Boutique</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            <button
              onClick={() => onSelectCategory('All')}
              className={`text-xs uppercase tracking-wider font-semibold transition-colors ${
                selectedCategory === 'All' ? 'text-stone-900 border-b-2 border-stone-900 pb-1' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Collection
            </button>
            {categories.map((cat) => {
              const catName = typeof cat === 'string' ? cat : cat.name;
              const catSlug = typeof cat === 'string' ? cat : cat.slug;
              const isSelected = selectedCategory === catName || selectedCategory === catSlug;
              return (
                <button
                  key={catSlug || catName}
                  onClick={() => onSelectCategory(catSlug || catName)}
                  className={`text-xs uppercase tracking-wider font-semibold transition-colors ${
                    isSelected ? 'text-stone-900 border-b-2 border-stone-900 pb-1' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-stone-100 rounded-full px-3 py-1.5 shadow-sm border border-stone-300 w-60 sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search curated goods..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent text-xs text-stone-800 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="text-stone-400 hover:text-stone-600 ml-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                  title="Search products"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Admin Console Trigger */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs border border-amber-500/30"
                title="Admin Control Center"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Console</span>
              </button>
            )}

            {/* AI Shopping Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="hidden md:flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Ask AI</span>
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
              title="View Curated Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Real-time Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
              title="Real-Time Atelier Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-xs">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Orders Lookup Button */}
            <button
              onClick={onOpenOrders}
              className="p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors relative"
              title="View Customer Order History"
            >
              <PackageOpen className="w-5 h-5" />
            </button>

            {/* Auth User Profile or Login Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-stone-200">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                  <p className="text-[10px] text-stone-500 font-mono capitalize">{currentUser.role || 'customer'}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-stone-500 hover:text-rose-600 rounded-full hover:bg-stone-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-full transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 animate-in fade-in duration-150">
          <div className="pt-2 pb-3 border-b border-stone-100">
            <div className="relative flex items-center bg-stone-100 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-stone-400 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-800 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => {
              onSelectCategory('All');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider ${
              selectedCategory === 'All' ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            All Collection
          </button>
          {categories.map((cat) => {
            const catName = typeof cat === 'string' ? cat : cat.name;
            const catSlug = typeof cat === 'string' ? cat : cat.slug;
            return (
              <button
                key={catSlug || catName}
                onClick={() => {
                  onSelectCategory(catSlug || catName);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider ${
                  selectedCategory === catName || selectedCategory === catSlug
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {catName}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-stone-100 space-y-2">
            {isAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-lg text-xs w-full justify-center"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Console</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenAiAssistant();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 bg-stone-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium w-full justify-center"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask Aura AI Concierge</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
