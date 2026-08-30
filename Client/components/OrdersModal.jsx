import React, { useState } from 'react';
import { X, PackageOpen, Truck, Clock, Layers, PackageCheck, XCircle, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';
import { useGetOrdersQuery } from '../store/apiSlice.js';
import { handleImageError } from '../utils/imageFallback.js';

const STATUS_ICONS = {
  Pending: { bg: 'bg-amber-100 text-amber-900 border-amber-200', icon: Clock },
  Processing: { bg: 'bg-blue-100 text-blue-900 border-blue-200', icon: Layers },
  Shipped: { bg: 'bg-purple-100 text-purple-900 border-purple-200', icon: Truck },
  Delivered: { bg: 'bg-emerald-100 text-emerald-900 border-emerald-200', icon: PackageCheck },
  Cancelled: { bg: 'bg-rose-100 text-rose-900 border-rose-200', icon: XCircle },
};

export const OrdersModal = ({ isOpen, onClose, currentUser }) => {
  const [guestEmail, setGuestEmail] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const activeEmail = currentUser?.email || lookupEmail;
  const { data: orders = [], isLoading } = useGetOrdersQuery(activeEmail || undefined, {
    skip: !isOpen,
  });

  if (!isOpen) return null;

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (guestEmail.trim()) {
      setLookupEmail(guestEmail.trim().toLowerCase());
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative border border-stone-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center space-x-2">
              <PackageOpen className="w-6 h-6 text-stone-900" />
              <h2 className="font-serif text-2xl font-medium text-stone-900">Your Order History</h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {currentUser ? `Orders for ${currentUser.email} (Enforced Server-Side)` : 'Track and review past orders'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest Email Lookup Bar if not logged in */}
        {!currentUser && (
          <div className="p-4 bg-stone-100 border-b border-stone-200">
            <form onSubmit={handleLookupSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter email used at checkout to view orders..."
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-stone-500"
                />
              </div>
              <button
                type="submit"
                className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
              >
                Look Up
              </button>
            </form>
          </div>
        )}

        {/* Orders Listing */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-stone-100/40">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-xs text-stone-400 animate-pulse">Loading orders via RTK Query...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-8">
              <PackageOpen className="w-16 h-16 text-stone-300 mx-auto mb-3 stroke-1" />
              <p className="font-serif text-lg text-stone-700 mb-1">No orders found</p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                {currentUser
                  ? 'You have not placed any orders under this account yet.'
                  : 'Enter your checkout email above or sign in to view your orders.'}
              </p>
            </div>
          ) : (
            orders.map((ord) => {
              const statusObj = STATUS_ICONS[ord.status] || STATUS_ICONS.Pending;
              const StatusIcon = statusObj.icon;
              const isExpanded = expandedOrderId === (ord.orderId || ord.id);

              return (
                <div
                  key={ord.orderId || ord.id}
                  className="border border-stone-200 rounded-xl bg-white shadow-xs overflow-hidden transition-all"
                >
                  {/* Order Summary Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          {ord.orderId || ord.id}
                        </span>
                        <span className="text-stone-300">&bull;</span>
                        <span className="text-xs text-stone-500">{ord.createdAt}</span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Recipient: <span className="font-medium text-stone-800">{ord.customerName || ord.shippingAddress?.fullName}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center space-x-1 ${statusObj.bg}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{ord.status}</span>
                      </span>

                      <button
                        onClick={() => toggleExpand(ord.orderId || ord.id)}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Quick items preview */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-2">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image || item.product?.image}
                              alt=""
                              onError={handleImageError}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                            />
                            <div>
                              <p className="font-medium text-stone-900">{item.name || item.product?.name}</p>
                              <p className="text-stone-500">
                                Unit Price: <span className="font-semibold text-stone-800">${item.unitPrice || item.price || item.product?.price}</span> &bull; Qty: {item.quantity} &bull; {item.selectedColor}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-stone-900">
                            ${Number((item.unitPrice || item.price || item.product?.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Server-Side Calculated Totals */}
                    <div className="pt-3 border-t border-stone-100 text-xs space-y-1 text-stone-600">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${Number(ord.subtotal || ord.total).toFixed(2)}</span>
                      </div>
                      {ord.discount > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount ({ord.promoCode || 'AURA10'})</span>
                          <span>-${Number(ord.discount).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{ord.shippingFee === 0 ? 'Complimentary' : `$${Number(ord.shippingFee).toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                        <span>Grand Total</span>
                        <span>${Number(ord.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details: Tracking Timeline & Destination */}
                  {isExpanded && (
                    <div className="bg-stone-50 p-5 border-t border-stone-100 space-y-4 text-xs animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-semibold">Delivery Address</span>
                          <p className="font-medium text-stone-900 mt-1">{ord.shippingAddress?.fullName}</p>
                          <p className="text-stone-600">{ord.shippingAddress?.address}</p>
                          <p className="text-stone-600">{ord.shippingAddress?.city}, {ord.shippingAddress?.postalCode}</p>
                          <p className="text-stone-600">{ord.shippingAddress?.country}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-semibold">Payment Details</span>
                          <p className="font-medium text-stone-900 mt-1">{ord.payment?.method || 'Card Payment'}</p>
                          <p className="text-stone-600">Status: {ord.payment?.status || 'Authorized'}</p>
                          <p className="text-stone-500 font-mono text-[11px] mt-0.5">Ref: {ord.payment?.transactionRef || 'TXN-CONFIRMED'}</p>
                        </div>
                      </div>

                      {ord.statusHistory && ord.statusHistory.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-stone-200">
                          <span className="text-[10px] text-stone-400 uppercase font-semibold">Tracking Timeline</span>
                          <div className="space-y-2">
                            {ord.statusHistory.map((sh, idx) => (
                              <div key={idx} className="flex items-start space-x-2.5">
                                <div className="w-2 h-2 rounded-full bg-stone-900 mt-1.5 flex-shrink-0" />
                                <div className="flex-1 flex justify-between">
                                  <div>
                                    <span className="font-semibold text-stone-900">{sh.status}</span>
                                    <p className="text-stone-500 text-[11px]">{sh.note}</p>
                                  </div>
                                  <span className="text-[10px] text-stone-400">
                                    {new Date(sh.timestamp).toLocaleDateString()} {new Date(sh.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
