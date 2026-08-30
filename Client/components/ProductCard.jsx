import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, Heart, AlertCircle } from 'lucide-react';
import { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../store/apiSlice.js';
import { handleImageError } from '../utils/imageFallback.js';

export const ProductCard = ({ product, onQuickView, onAddToCart, onOpenReviews, user, onOpenAuth }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const productId = product.id || product.productId;
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !user });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isWishlisted = wishlistData?.productIds?.includes(productId);

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (isWishlisted) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product, product.colors?.[0], product.sizes ? product.sizes[0] : undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
  const isOutOfStock = product.stock === 0 || product.inStock === false;

  return (
    <div
      onClick={() => onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer bg-white rounded-xl border border-stone-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col relative"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        <img
          src={isHovered && product.secondaryImage ? product.secondaryImage : product.image}
          alt={product.name}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
          {product.isNewItem && (
            <span className="bg-stone-900 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-amber-200 shadow-xs">
              Best Seller
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-rose-500 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              Sale
            </span>
          )}
          {isLowStock && (
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-rose-600 shadow-sm backdrop-blur-xs transition-all"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Quick Actions on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/95 backdrop-blur-md hover:bg-white text-stone-900 py-2 px-3 rounded-lg text-xs font-semibold shadow-md transition-all flex items-center justify-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect</span>
          </button>
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`py-2 px-3 rounded-lg text-xs font-semibold shadow-md transition-all flex items-center justify-center space-x-1 ${
              isOutOfStock
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-amber-800 text-white'
            }`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{isOutOfStock ? 'Sold Out' : added ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
            <span className="uppercase tracking-widest text-[10px] font-semibold text-stone-500">{product.category}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenReviews) onOpenReviews(product);
              }}
              className="flex items-center space-x-1 text-amber-500 hover:text-amber-600 transition-colors"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-stone-700 font-semibold text-xs">{Number(product.rating || 5).toFixed(1)}</span>
              <span className="text-stone-400 text-[11px]">({product.reviewCount || product.reviews?.length || 0})</span>
            </button>
          </div>
          <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-1 mt-1 font-light leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-bold text-stone-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through font-normal">${product.originalPrice}</span>
            )}
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="flex space-x-1 items-center">
              {product.colors.slice(0, 3).map((color, i) => (
                <span
                  key={i}
                  title={color}
                  className="w-2.5 h-2.5 rounded-full border border-stone-300 bg-stone-300"
                  style={{
                    backgroundColor:
                      color.toLowerCase().includes('white') ? '#ffffff' :
                      color.toLowerCase().includes('black') || color.toLowerCase().includes('space') ? '#1c1917' :
                      color.toLowerCase().includes('brass') || color.toLowerCase().includes('gold') ? '#d97706' :
                      color.toLowerCase().includes('green') || color.toLowerCase().includes('sage') ? '#4d7c0f' :
                      color.toLowerCase().includes('walnut') || color.toLowerCase().includes('brown') ? '#78350f' :
                      color.toLowerCase().includes('rose') ? '#fb7185' : '#a8a29e'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
