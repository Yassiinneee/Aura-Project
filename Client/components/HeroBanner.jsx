import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const HeroBanner = ({ onExploreClick, onOpenAiAssistant }) => {
  return (
    <div className="relative bg-stone-900 text-stone-100 overflow-hidden">
      {/* Background Decorative Image with Overlay */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80"
          alt="Interior aesthetic"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent z-1" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-stone-800/80 backdrop-blur-md border border-stone-700 px-3 py-1.5 rounded-full text-xs font-medium text-stone-200 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Curated Living &bull; Fall/Winter Collection</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-white leading-[1.1] mb-6">
            Design for mindful <span className="italic font-light">everyday living</span>.
          </h1>
          <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed mb-8 max-w-xl">
            Discover thoughtfully crafted objects, organic textiles, and sustainable acoustic goods designed to bring calm and beauty into your sanctuary.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center justify-center space-x-2 bg-white text-stone-900 hover:bg-stone-100 px-7 py-3.5 rounded-full font-medium text-sm tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAiAssistant}
              className="inline-flex items-center justify-center space-x-2 bg-stone-800/80 hover:bg-stone-700 text-stone-100 border border-stone-600 px-6 py-3.5 rounded-full font-medium text-sm tracking-wide transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Get AI Styling Advice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Strip */}
      <div className="relative z-10 bg-stone-950/60 border-t border-stone-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-stone-300 text-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-stone-800 rounded-lg text-amber-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-white">Complimentary Delivery</p>
              <p className="text-xs text-stone-400">On all continental orders over $100</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-stone-800 rounded-lg text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-white">Craftsmanship Guarantee</p>
              <p className="text-xs text-stone-400">2-year warranty on all artisan goods</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-stone-800 rounded-lg text-amber-300">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-white">Seamless Returns</p>
              <p className="text-xs text-stone-400">30-day effortless return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
