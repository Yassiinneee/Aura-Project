import { EmailRecordModel } from "../models/EmailRecord.js";
import { getDbStatus } from "../config/db.js";

// In-memory fallback
export let memoryEmails = [];

export function renderEmailTemplate(template, payload) {
  switch (template) {
    case "ORDER_CONFIRMATION":
      return `
        <!DOCTYPE html>
        <html>
        <head><style>body{font-family:sans-serif;color:#292524;background:#f5f5f4;padding:20px;} .card{background:#ffffff;border-radius:12px;max-width:600px;margin:0 auto;padding:32px;border:1px solid #e7e5e4;} .brand{font-size:22px;font-weight:bold;letter-spacing:1px;color:#1c1917;} .total{font-size:18px;font-weight:bold;color:#047857;} .items{margin:20px 0;border-top:1px solid #f5f5f4;}</style></head>
        <body>
          <div class="card">
            <div class="brand">AURA & CO. ATELIER</div>
            <h2>Thank you for your order, ${payload.customerName || payload.shippingAddress?.fullName || 'Valued Customer'}!</h2>
            <p>Your order <strong>${payload.orderId}</strong> has been received and is currently being processed by our artisanal fulfillment team.</p>
            <div class="items">
              <p><strong>Delivery Method:</strong> ${payload.deliveryOption?.name || 'Standard Atelier Delivery'}</p>
              <p><strong>Destination:</strong> ${payload.shippingAddress?.address}, ${payload.shippingAddress?.city}</p>
              <p class="total">Grand Total: $${Number(payload.total).toFixed(2)}</p>
            </div>
            <p style="font-size:12px;color:#78716c;">Track your shipment anytime at our online portal.</p>
          </div>
        </body>
        </html>
      `;

    case "ORDER_STATUS_UPDATE":
      return `
        <!DOCTYPE html>
        <html>
        <head><style>body{font-family:sans-serif;color:#292524;background:#f5f5f4;padding:20px;} .card{background:#ffffff;border-radius:12px;max-width:600px;margin:0 auto;padding:32px;border:1px solid #e7e5e4;}</style></head>
        <body>
          <div class="card">
            <div style="font-size:20px;font-weight:bold;color:#1c1917;">AURA & CO. ATELIER</div>
            <h2>Order Status Update: ${payload.status}</h2>
            <p>Dear ${payload.customerName || 'Customer'},</p>
            <p>Your order <strong>${payload.orderId}</strong> has advanced to: <span style="background:#e0f2fe;color:#0369a1;padding:4px 8px;border-radius:4px;font-weight:bold;">${payload.status}</span></p>
            ${payload.note ? `<p><em>"${payload.note}"</em></p>` : ''}
            <p style="margin-top:24px;font-size:13px;color:#78716c;">Thank you for your patience as we handcraft and deliver your pieces.</p>
          </div>
        </body>
        </html>
      `;

    default:
      return `<p>Notification from Aura Boutique: ${payload.message || ''}</p>`;
  }
}

export async function sendEmail({ to, subject, template, payload }) {
  const emailId = `EML-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const emailHtml = renderEmailTemplate(template, payload);

  const isSuccess = true;
  const status = isSuccess ? 'delivered' : 'failed';

  const record = {
    emailId,
    to: to.toLowerCase().trim(),
    subject,
    template,
    status,
    attempts: 1,
    lastError: isSuccess ? null : 'Simulated provider connection timeout',
    payload: {
      ...payload,
      htmlPreview: emailHtml
    },
    sentAt: new Date()
  };

  try {
    if (getDbStatus()) {
      await EmailRecordModel.create(record);
    } else {
      memoryEmails.unshift(record);
    }
  } catch (err) {
    console.error("Failed to save email record:", err);
  }

  return record;
}

export async function retryEmail(emailId) {
  if (getDbStatus()) {
    const email = await EmailRecordModel.findOne({ emailId });
    if (!email) throw new Error("Email record not found");
    email.attempts += 1;
    email.status = 'delivered';
    email.lastError = null;
    email.sentAt = new Date();
    await email.save();
    return email;
  } else {
    const idx = memoryEmails.findIndex(e => e.emailId === emailId);
    if (idx === -1) throw new Error("Email record not found");
    memoryEmails[idx].attempts += 1;
    memoryEmails[idx].status = 'delivered';
    memoryEmails[idx].lastError = null;
    memoryEmails[idx].sentAt = new Date();
    return memoryEmails[idx];
  }
}
