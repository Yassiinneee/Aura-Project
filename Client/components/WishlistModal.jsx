import React from 'react';
import {
  Heart,
  ShoppingBag,
  Trash2,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation
} from '../store/apiSlice.js';
import { handleImageError } from '../utils/imageFallback.js';

export const WishlistModal = ({ isOpen, onClose, onAddToCart, onOpenProduct }) => {
  const { data, isLoading } = useGetWishlistQuery(undefined, { skip: !isOpen });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  if (!isOpen) return null;

  const wishlistProducts = data?.products || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col border-l border-stone-200">
        {/* Header */}
        <div className="p-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">Your Wishlist</h2>
              <p className="text-xs text-stone-500">
                {wishlistProducts.length} curated {wishlistProducts.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-stone-400 text-sm">
              Loading wishlist...
            </div>
          ) : wishlistProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <Heart className="w-12 h-12 stroke-1 mb-3 text-stone-300" />
              <p className="font-medium text-stone-700">Your wishlist is currently empty</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Save your favorite artisanal pieces by clicking the heart icon on any product.
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) => {
              const pId = product.id || product.productId;
              return (
                <div
                  key={pId}
                  className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs flex gap-3 items-center group hover:border-stone-300 transition-all"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover bg-stone-100 shrink-0 cursor-pointer"
                    onClick={() => {
                      onOpenProduct(product);
                      onClose();
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block truncate">
                      {product.category}
                    </span>
                    <h4
                      className="text-sm font-semibold text-stone-900 truncate hover:text-amber-800 cursor-pointer"
                      onClick={() => {
                        onOpenProduct(product);
                        onClose();
                      }}
                    >
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-stone-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                      }}
                      className="p-2 bg-stone-900 hover:bg-amber-800 text-white rounded-lg transition-colors flex items-center justify-center shadow-xs"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(pId)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
