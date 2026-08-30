import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback.js';

export const CartDrawer = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  discount,
  promoCode,
  onApplyPromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 15;
  const total = subtotal - discountAmount + shipping;

  const freeShippingThreshold = 100;
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h2 className="font-serif text-xl font-medium text-stone-900">Your Shopping Bag ({items.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-stone-50 px-5 py-3 border-b border-stone-200">
          {amountNeeded > 0 ? (
            <p className="text-xs text-stone-600 mb-1">
              Add <span className="font-bold text-stone-900">${amountNeeded.toFixed(2)}</span> more to qualify for <span className="font-semibold text-emerald-700">Free Shipping</span>!
            </p>
          ) : (
            <p className="text-xs font-semibold text-emerald-700 mb-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              You have unlocked Free Shipping!
            </p>
          )}
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-stone-900 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4 stroke-1" />
              <p className="font-serif text-lg text-stone-700 mb-1">Your bag is empty</p>
              <p className="text-xs text-stone-400 mb-6">Explore our curated collection to find your next favorite piece.</p>
              <button
                onClick={onClose}
                className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-xs font-medium tracking-wide hover:bg-stone-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex space-x-4 pb-4 border-b border-stone-100 last:border-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm font-medium text-stone-900 line-clamp-1">{item.product.name}</h4>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-stone-400 hover:text-rose-600 transition-colors ml-2"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Color: {item.selectedColor} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-stone-200 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-l"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-r"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-bold text-stone-950">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/50 space-y-4">
            {/* Promo Code Input */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. AURA10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-800 uppercase focus:outline-none focus:border-stone-400"
                />
              </div>
              <button
                onClick={() => {
                  if (promoInput.trim().toUpperCase() === 'AURA10') {
                    onApplyPromo('AURA10');
                    setPromoError(false);
                  } else {
                    setPromoError(true);
                  }
                }}
                className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-[11px] text-rose-600">Invalid promo code. Try AURA10.</p>}
            {discount > 0 && <p className="text-[11px] text-emerald-600 font-medium">Promo code AURA10 applied (10% off)!</p>}

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount (10%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-medium text-stone-900">
                  {shipping === 0 ? <span className="text-emerald-600 uppercase font-bold text-[11px]">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3.5 rounded-xl font-medium text-sm tracking-wide transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
