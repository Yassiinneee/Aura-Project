import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  categoryId: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  itemCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);
