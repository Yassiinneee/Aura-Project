import { AuditLogModel } from "../models/AuditLog.js";
import { getDbStatus } from "../config/db.js";

// In-memory fallback
export let memoryAuditLogs = [];

export function getCorrelationId(req) {
  return req.headers['x-correlation-id'] || `CORR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function recordAuditLog({
  actorEmail,
  actorRole = 'admin',
  action,
  targetResource,
  targetId,
  details,
  correlationId,
  ipAddress = '127.0.0.1'
}) {
  const logId = `AUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const logEntry = {
    logId,
    actorEmail: actorEmail?.toLowerCase() || 'system',
    actorRole,
    action,
    targetResource,
    targetId: targetId ? String(targetId) : undefined,
    details: details || {},
    correlationId: correlationId || `CORR-${Date.now()}`,
    ipAddress,
    timestamp: new Date()
  };

  try {
    if (getDbStatus()) {
      await AuditLogModel.create(logEntry);
    } else {
      memoryAuditLogs.unshift(logEntry);
      // Retention policy: cap in-memory logs to last 500 entries
      if (memoryAuditLogs.length > 500) {
        memoryAuditLogs.pop();
      }
    }
  } catch (err) {
    console.error("Audit log creation error:", err);
  }

  return logEntry;
}

export async function getAuditLogs({ limit = 100, action, targetResource } = {}) {
  if (getDbStatus()) {
    const query = {};
    if (action) query.action = action;
    if (targetResource) query.targetResource = targetResource;
    return await AuditLogModel.find(query).sort({ timestamp: -1 }).limit(limit);
  } else {
    let logs = [...memoryAuditLogs];
    if (action) logs = logs.filter(l => l.action.toLowerCase() === action.toLowerCase());
    if (targetResource) logs = logs.filter(l => l.targetResource.toLowerCase() === targetResource.toLowerCase());
    return logs.slice(0, limit);
  }
}
