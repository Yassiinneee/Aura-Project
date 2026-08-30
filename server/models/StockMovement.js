import mongoose from "mongoose";

const StockMovementSchema = new mongoose.Schema({
  movementId: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  productName: { type: String },
  change: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  reason: { type: String, enum: ['RESTOCK', 'ORDER_DEDUCT', 'RETURN', 'MANUAL_ADJUST', 'AUDIT_CORRECTION'], default: 'MANUAL_ADJUST' },
  referenceId: { type: String },
  actor: { type: String, default: 'System' },
  timestamp: { type: Date, default: Date.now }
});

export const StockMovementModel = mongoose.models.StockMovement || mongoose.model("StockMovement", StockMovementSchema);
