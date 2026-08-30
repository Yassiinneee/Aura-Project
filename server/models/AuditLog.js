import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true },
  actorEmail: { type: String, required: true },
  actorRole: { type: String, default: 'admin' },
  action: { type: String, required: true },
  targetResource: { type: String, required: true },
  targetId: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  correlationId: { type: String },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export const AuditLogModel = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
