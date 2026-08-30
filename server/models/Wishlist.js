import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, lowercase: true },
  productIds: [{ type: String, required: true }],
  updatedAt: { type: Date, default: Date.now },
});

export const WishlistModel = mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
