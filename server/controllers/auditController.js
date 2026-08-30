import { getAuditLogs } from "../services/auditService.js";
import { getDbStatus } from "../config/db.js";

export async function getAuditLogsController(req, res) {
  try {
    const { action, targetResource, limit = 100 } = req.query;
    const logs = await getAuditLogs({ action, targetResource, limit: Number(limit) });
    return res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to load audit logs" });
  }
}

export async function exportAuditLogs(req, res) {
  try {
    const logs = await getAuditLogs({ limit: 1000 });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="aura-audit-export.json"');
    return res.json({ exportedAt: new Date().toISOString(), total: logs.length, records: logs });
  } catch (err) {
    res.status(500).json({ error: "Failed to export audit logs" });
  }
}

export async function getTelemetryHealth(req, res) {
  const dbConnected = getDbStatus();
  return res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      driver: dbConnected ? 'MongoDB Mongoose Driver' : 'In-Memory Distributed Store',
      connected: dbConnected,
    },
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
}
