import React, { useState, useEffect } from 'react';
import { X, CreditCard, Truck, Lock, AlertCircle, ShieldCheck, Tag, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCreateOrderMutation, useValidateCouponMutation, useGetDeliveryOptionsQuery } from '../store/apiSlice.js';

export const CheckoutModal = ({
  isOpen,
  onClose,
  items,
  currentUser,
  onOrderComplete,
}) => {
  const [step, setStep] = useState('shipping'); // 'shipping' | 'delivery' | 'payment'
  const { data: deliveryOptions = [] } = useGetDeliveryOptionsQuery(undefined, { skip: !isOpen });
  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();
  const [validateCoupon, { isLoading: validatingCoupon }] = useValidateCouponMutation();

  const [selectedDeliveryId, setSelectedDeliveryId] = useState('standard');
  const [promoCodeInput, setPromoCodeInput] = useState('AURA10');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'applepay'
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || 'Alex Vance',
    email: currentUser?.email || 'alex.vance@example.com',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
    cardNumber: '4242 •••• •••• 4242',
    cardBrand: 'Visa',
    expDate: '08/28',
    cvv: '123',
  });

  // Calculate Subtotal
  const clientSubtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Auto-test default coupon on open
  useEffect(() => {
    if (isOpen && !appliedPromo) {
      validateCoupon({ code: 'AURA10', subtotal: clientSubtotal })
        .unwrap()
        .then((res) => {
          if (res.valid) setAppliedPromo(res);
        })
        .catch(() => {});
    }
  }, [isOpen, clientSubtotal]);

  if (!isOpen) return null;

  const currentDelivery = deliveryOptions.find(d => d.id === selectedDeliveryId) || {
    id: 'standard',
    name: 'Standard Atelier Delivery',
    estimatedDays: '3-5 Business Days',
    price: 0
  };

  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const netSubtotal = clientSubtotal - discountAmount;
  const shippingFee = (currentDelivery.id === 'standard' && netSubtotal >= 100) ? 0 : currentDelivery.price;
  const estimatedTotal = Number((netSubtotal + shippingFee).toFixed(2));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setPromoError('');
    if (!promoCodeInput.trim()) return;

    try {
      const res = await validateCoupon({ code: promoCodeInput.trim(), subtotal: clientSubtotal }).unwrap();
      if (res.valid) {
        setAppliedPromo(res);
        setPromoError('');
      }
    } catch (err) {
      setAppliedPromo(null);
      setPromoError(err?.data?.error || 'Invalid or expired promo code');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Prepare Authoritative Order Payload
    const orderPayload = {
      items: items.map((i) => ({
        productId: i.product.id || i.product.productId,
        quantity: i.quantity,
        selectedColor: i.selectedColor || 'Standard',
        selectedSize: i.selectedSize || 'One Size',
      })),
      shippingAddress: {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
      },
      deliveryOptionId: selectedDeliveryId,
      promoCode: appliedPromo ? appliedPromo.code : '',
      paymentDetails: {
        method: paymentMethod,
        brand: formData.cardBrand || 'Visa',
        cardNumber: formData.cardNumber,
      },
    };

    try {
      const createdOrder = await createOrder(orderPayload).unwrap();
      onOrderComplete(createdOrder);
    } catch (err) {
      console.error('Order creation failed:', err);
      setErrorMsg(err.data?.error || err.error || 'Failed to place order. Inventory or payment rejected.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative border border-stone-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Atelier Checkout</h2>
            <p className="text-xs text-stone-500 mt-0.5">Authoritative server-side price & inventory snapshot</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b border-stone-200 px-6 py-3 bg-stone-100/60 text-xs font-semibold space-x-6">
          <button
            onClick={() => setStep('shipping')}
            className={`flex items-center space-x-2 ${step === 'shipping' ? 'text-stone-900 font-bold' : 'text-stone-400'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'shipping' ? 'bg-stone-900 text-white' : 'bg-stone-300 text-stone-700'}`}>1</span>
            <span>Address</span>
          </button>

          <button
            onClick={() => setStep('delivery')}
            className={`flex items-center space-x-2 ${step === 'delivery' ? 'text-stone-900 font-bold' : 'text-stone-400'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'delivery' ? 'bg-stone-900 text-white' : 'bg-stone-300 text-stone-700'}`}>2</span>
            <span>Delivery</span>
          </button>

          <button
            onClick={() => setStep('payment')}
            className={`flex items-center space-x-2 ${step === 'payment' ? 'text-stone-900 font-bold' : 'text-stone-400'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-stone-900 text-white' : 'bg-stone-300 text-stone-700'}`}>3</span>
            <span>Payment & Review</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: SHIPPING */}
          {step === 'shipping' && (
            <form onSubmit={(e) => { e.preventDefault(); setStep('delivery'); }} className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900">Destination Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Email for Dispatch Tracking</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span>Select Delivery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DELIVERY OPTIONS */}
          {step === 'delivery' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900">Select Delivery Method</h3>
              <div className="space-y-3">
                {deliveryOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedDeliveryId(opt.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedDeliveryId === opt.id
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedDeliveryId === opt.id ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{opt.name}</h4>
                        <p className="text-[11px] text-stone-500">{opt.estimatedDays}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      {opt.id === 'standard' && netSubtotal >= 100 ? 'Complimentary' : `$${opt.price}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Back to Address
                </button>
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & REVIEW */}
          {step === 'payment' && (
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {/* Payment Boundary Selector */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-2">Payment Gateway Boundary</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'card'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit / Debit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'paypal'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-serif italic font-bold">P</span>
                    <span>PayPal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'applepay'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span></span>
                    <span>Apple Pay</span>
                  </button>
                </div>
              </div>

              {/* Coupon validator box */}
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      placeholder="Enter promo code (e.g. AURA10)"
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    {validatingCoupon ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {appliedPromo && (
                  <div className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Applied code <strong>{appliedPromo.code}</strong> (-${appliedPromo.discountAmount.toFixed(2)})</span>
                  </div>
                )}
                {promoError && (
                  <div className="mt-2 text-xs font-medium text-rose-600">
                    {promoError}
                  </div>
                )}
              </div>

              {/* Order Summary Snapshot */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal ({items.length} items):</span>
                  <span className="font-semibold text-stone-900">${clientSubtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({appliedPromo.code}):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery ({currentDelivery.name}):</span>
                  <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Authoritative Grand Total:</span>
                  <span className="text-base text-stone-900">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-100 rounded-lg flex items-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero card data stored. Tokenized simulated payment boundary.</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep('delivery')}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Back to Delivery
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying & Placing...' : `Authorize & Pay $${estimatedTotal.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
