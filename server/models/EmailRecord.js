import mongoose from "mongoose";

const EmailRecordSchema = new mongoose.Schema({
  emailId: { type: String, required: true, unique: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  template: { type: String, required: true },
  status: { type: String, enum: ['delivered', 'failed', 'pending'], default: 'delivered' },
  attempts: { type: Number, default: 1 },
  lastError: { type: String },
  payload: { type: mongoose.Schema.Types.Mixed },
  sentAt: { type: Date, default: Date.now }
});

export const EmailRecordModel = mongoose.models.EmailRecord || mongoose.model("EmailRecord", EmailRecordSchema);
