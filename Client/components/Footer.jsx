import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export const Footer = ({ onSelectCategory }) => {
  const [subscribed, setSubscribed] = useState(false);

  const handleCategoryClick = (e, slug) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(slug);
      const el = document.getElementById('catalog-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <span className="font-serif text-2xl font-medium tracking-tight text-white block">
            AURA <span className="font-sans text-xs tracking-widest uppercase font-semibold text-stone-400">Boutique</span>
          </span>
          <p className="text-xs text-stone-400 font-light leading-relaxed">
            Curated objects and sustainable lifestyle goods designed to inspire mindful living and elevate everyday rituals.
          </p>
          <div className="flex items-center space-x-2 text-xs text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>Featuring Aura AI Shopping Concierge</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Collection</h4>
          <ul className="space-y-2.5 text-xs text-stone-400">
            <li><button onClick={(e) => handleCategoryClick(e, 'home-and-living')} className="hover:text-white transition-colors text-left">Home & Living</button></li>
            <li><button onClick={(e) => handleCategoryClick(e, 'tech-and-audio')} className="hover:text-white transition-colors text-left">Tech & Audio</button></li>
            <li><button onClick={(e) => handleCategoryClick(e, 'apparel')} className="hover:text-white transition-colors text-left">Apparel</button></li>
            <li><button onClick={(e) => handleCategoryClick(e, 'lifestyle')} className="hover:text-white transition-colors text-left">Lifestyle</button></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-xs text-stone-400">
            <li><a href="#" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Craftsmanship Warranty</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Concierge</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Join the Journal</h4>
          <p className="text-xs text-stone-400 mb-3 font-light">
            Receive seasonal editorial digests, early access to new releases, and exclusive member codes.
          </p>
          {subscribed ? (
            <p className="text-xs text-emerald-400 font-medium bg-emerald-950/50 p-3 rounded-lg border border-emerald-800">
              Thank you for subscribing! Use code AURA10 for 10% off.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="bg-stone-800 border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-stone-500 flex-1"
              />
              <button
                type="submit"
                className="bg-white hover:bg-stone-100 text-stone-900 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
        <p>&copy; {new Date().getFullYear()} Aura & Co. Boutique. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-stone-300">Privacy Policy</a>
          <a href="#" className="hover:text-stone-300">Terms of Service</a>
          <a href="#" className="hover:text-stone-300">Cookie Preferences</a>
        </div>
      </div>
    </footer>
  );
};
