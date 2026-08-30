import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  recipientEmail: { type: String, required: true, lowercase: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['ORDER_STATUS', 'INVENTORY_ALERT', 'PROMO', 'SYSTEM'], default: 'ORDER_STATUS' },
  orderId: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const NotificationModel = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
