import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, Sparkles, Heart, ShieldCheck, AlertCircle, MessageSquarePlus } from 'lucide-react';
import { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../store/apiSlice.js';
import { handleImageError } from '../utils/imageFallback.js';

export const ProductModal = ({
  product,
  onClose,
  onAddToCart,
  onAskAiAboutProduct,
  onOpenReviews,
  user,
  onOpenAuth
}) => {
  const productId = product.id || product.productId;
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : undefined);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !user });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isWishlisted = wishlistData?.productIds?.includes(productId);

  const images = Array.from(new Set([
    product.image,
    product.secondaryImage,
    ...(product.mediaGallery || [])
  ])).filter(Boolean);

  const stockCount = product.stock !== undefined ? product.stock : 25;
  const isOutOfStock = stockCount <= 0;
  const isLowStock = stockCount > 0 && stockCount <= (product.lowStockThreshold || 5);

  const handleWishlistToggle = async () => {
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

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 p-2 rounded-full shadow-md transition-all border border-stone-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery */}
        <div className="md:w-1/2 bg-stone-50 p-6 flex flex-col justify-between border-r border-stone-200">
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-inner mb-4 border border-stone-200">
              <img
                src={selectedImage}
                alt={product.name}
                onError={handleImageError}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <button
                onClick={handleWishlistToggle}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md backdrop-blur-xs transition-all"
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex space-x-2.5 justify-center overflow-x-auto py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img ? 'border-stone-900 scale-105 shadow-xs' : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={handleImageError}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ask AI concierge banner */}
          <div className="mt-6 bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900">Curious about materials or care?</p>
                <p className="text-[11px] text-amber-700">Ask our AI concierge for styling tips.</p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onAskAiAboutProduct(product.name);
              }}
              className="bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0 shadow-xs"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* Right: Details & Options */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[90vh]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{product.category}</span>
              <button
                onClick={() => {
                  if (onOpenReviews) onOpenReviews(product);
                }}
                className="flex items-center space-x-1 text-amber-500 hover:text-amber-600 transition-colors"
              >
                <Star className="w-4 h-4 fill-current" />
                <span className="text-stone-800 font-bold text-sm">{Number(product.rating || 5).toFixed(1)}</span>
                <span className="text-stone-400 text-xs">({product.reviewCount || product.reviews?.length || 0} reviews)</span>
              </button>
            </div>

            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">{product.name}</h2>
            {product.sku && (
              <p className="text-[11px] text-stone-400 font-mono mb-3">SKU: {product.sku}</p>
            )}

            <div className="flex items-center space-x-3 mb-5">
              <span className="text-2xl font-bold text-stone-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">${product.originalPrice}</span>
              )}
              
              {isOutOfStock ? (
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Only {stockCount} left
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  In Stock ({stockCount} available)
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-200 mb-5">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 mr-6 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                  activeTab === 'details' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`pb-2 mr-6 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                  activeTab === 'features' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Craft & Specs
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                  activeTab === 'reviews' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Reviews ({product.reviewCount || product.reviews?.length || 0})
              </button>
            </div>

            {/* Tab content */}
            {activeTab === 'details' && (
              <div className="text-xs text-stone-600 leading-relaxed space-y-3 mb-6">
                <p>{product.description}</p>
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/80 flex items-center gap-2 text-stone-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Handmade in limited batches with eco-conscious materials.</span>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <ul className="space-y-2 text-xs text-stone-600 mb-6">
                {(product.features || []).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-800">
                    Average Score: {Number(product.rating || 5).toFixed(1)} / 5.0
                  </span>
                  <button
                    onClick={() => {
                      if (onOpenReviews) onOpenReviews(product);
                    }}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline flex items-center gap-1"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    View all & write review
                  </button>
                </div>
                {(product.reviews || []).slice(0, 2).map((r, i) => (
                  <div key={i} className="p-3 bg-stone-50 rounded-lg text-xs border border-stone-200">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>{r.author}</span>
                      <span className="text-amber-500">{'★'.repeat(r.rating || 5)}</span>
                    </div>
                    <p className="text-stone-600 mt-1">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Color: <span className="font-normal text-stone-900">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        selectedColor === color
                          ? 'border-stone-900 bg-stone-900 text-white font-medium shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Size: <span className="font-normal text-stone-900">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        selectedSize === size
                          ? 'border-stone-900 bg-stone-900 text-white font-medium shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock || quantity <= 1}
                className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-40"
              >
                -
              </button>
              <span className="px-3 text-xs font-bold text-stone-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                disabled={isOutOfStock || quantity >= stockCount}
                className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-40"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`flex-1 py-3 px-6 rounded-lg text-xs font-bold tracking-wider uppercase shadow-md transition-all flex items-center justify-center space-x-2 ${
                isOutOfStock
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 hover:bg-amber-800 text-white'
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              <span>{isOutOfStock ? 'Sold Out' : added ? 'Added to Bag' : 'Add to Bag'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
