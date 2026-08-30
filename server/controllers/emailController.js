import { EmailRecordModel } from "../models/EmailRecord.js";
import { memoryEmails, retryEmail } from "../services/emailService.js";
import { getDbStatus } from "../config/db.js";
import { recordAuditLog } from "../services/auditService.js";

export async function getEmailLogs(req, res) {
  try {
    const { to, status, limit = 50 } = req.query;

    if (getDbStatus()) {
      const query = {};
      if (to) query.to = to.toLowerCase();
      if (status) query.status = status;
      const emails = await EmailRecordModel.find(query).sort({ sentAt: -1 }).limit(Number(limit));
      return res.json(emails);
    } else {
      let list = [...memoryEmails];
      if (to) list = list.filter(e => e.to.includes(to.toLowerCase()));
      if (status) list = list.filter(e => e.status === status);
      return res.json(list.slice(0, Number(limit)));
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to load email logs" });
  }
}

export async function retryEmailDelivery(req, res) {
  try {
    const emailId = req.params.emailId || req.params.id;
    const result = await retryEmail(emailId);

    await recordAuditLog({
      actorEmail: req.user.email,
      action: 'RETRY_EMAIL_DELIVERY',
      targetResource: 'EMAIL',
      targetId: emailId,
      correlationId: req.correlationId
    });

    return res.json({ message: "Email delivery re-attempted successfully", email: result });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to retry email delivery" });
  }
}
