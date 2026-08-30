import React from 'react';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback.js';

export const OrderSuccessModal = ({
  order,
  onClose,
  onContinueShopping,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative p-6 sm:p-8 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="font-serif text-2xl font-medium text-stone-900 mb-1">Order Confirmed!</h2>
        <p className="text-xs text-stone-500 mb-6">
          Thank you for shopping with Aura & Co. Boutique. We have sent a confirmation email to <span className="font-medium text-stone-800">{order.shippingAddress.email}</span>.
        </p>

        {/* Order Details Card */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-left mb-6 space-y-3">
          <div className="flex justify-between items-center text-xs border-b border-stone-200 pb-2">
            <div>
              <span className="text-stone-400 block">Order Number</span>
              <span className="font-mono font-bold text-stone-900">{order.id}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block">Date</span>
              <span className="font-medium text-stone-800">{order.createdAt}</span>
            </div>
          </div>

          <div>
            <span className="text-stone-400 text-xs block mb-1">Items Ordered</span>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <img
                      src={item.product?.image || item.image}
                      alt=""
                      onError={handleImageError}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-stone-900 line-clamp-1">{item.product?.name || item.name}</p>
                      <p className="text-[10px] text-stone-500">Qty: {item.quantity} &bull; {item.selectedColor}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-stone-900">${((item.product?.price || item.unitPrice || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
            <span>Total Paid</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onContinueShopping}
            className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl font-medium text-xs tracking-wide transition-all shadow flex items-center justify-center space-x-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
