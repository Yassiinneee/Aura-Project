import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  sku: { type: String },
  name: { type: String, required: true },
  category: { type: String, required: true },
  categorySlug: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number, default: 25 },
  lowStockThreshold: { type: Number, default: 5 },
  rating: { type: Number, default: 5 },
  reviewCount: { type: Number, default: 0 },
  image: { type: String, required: true },
  secondaryImage: { type: String },
  mediaGallery: [String],
  description: { type: String, required: true },
  features: [String],
  colors: [String],
  sizes: [String],
  inStock: { type: Boolean, default: true },
  isNewItem: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  reviews: [
    {
      id: String,
      author: String,
      email: String,
      rating: Number,
      date: String,
      comment: String,
      isVerifiedPurchase: { type: Boolean, default: false },
      isApproved: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now }
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);
