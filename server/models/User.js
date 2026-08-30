import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  status: { type: String, enum: ['active', 'suspended', 'disabled'], default: 'active' },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
