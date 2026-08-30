import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true, lowercase: true },
  userId: { type: String },
  customerName: { type: String },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      unitPrice: { type: Number, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      selectedColor: String,
      selectedSize: String,
      image: String,
      lineTotal: { type: Number, required: true },
    },
  ],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  promoCode: { type: String, default: "" },
  deliveryOption: {
    id: { type: String, default: 'standard' },
    name: { type: String, default: 'Standard Atelier Delivery' },
    estimatedDays: { type: String, default: '3-5 Business Days' },
    price: { type: Number, default: 0 }
  },
  shippingFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  payment: {
    status: { type: String, default: 'Paid' },
    method: { type: String, default: 'Card (Simulated Boundary)' },
    last4: { type: String, default: '4242' },
    cardBrand: { type: String, default: 'Visa' },
    transactionRef: { type: String },
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  statusHistory: [
    {
      status: { type: String, required: true },
      timestamp: { type: String, default: () => new Date().toISOString() },
      note: { type: String },
      updatedBy: { type: String, default: 'System' },
    },
  ],
  correlationId: { type: String },
  createdAt: { type: String, required: true },
  updatedAt: { type: String },
});

export const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);
