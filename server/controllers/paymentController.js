import { processPaymentSimulation, verifyWebhookSignature } from "../services/paymentService.js";
import { OrderModel, memoryOrders } from "../models/index.js";
import { getDbStatus } from "../config/db.js";
import { recordAuditLog } from "../services/auditService.js";

export async function simulatePayment(req, res) {
  try {
    const { method = 'card', amount, currency = 'USD', cardDetails } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid payment amount required" });
    }

    const result = processPaymentSimulation({ method, amount, currency, cardDetails });
    return res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Payment simulation failed" });
  }
}

export async function handleWebhook(req, res) {
  try {
    const signature = req.headers['x-aura-signature'] || req.headers['stripe-signature'];
    const payloadString = JSON.stringify(req.body);

    const isValid = verifyWebhookSignature(payloadString, signature);
    if (!isValid && process.env.NODE_ENV === 'production') {
      return res.status(401).json({ error: "Invalid webhook HMAC signature" });
    }

    const { event, data } = req.body;
    console.log(`[Payment Webhook Received] Event: ${event}`, data);

    if (event === 'payment.succeeded' && data?.orderId) {
      if (getDbStatus()) {
        await OrderModel.updateOne(
          { orderId: data.orderId },
          { $set: { 'payment.status': 'Paid', 'payment.transactionRef': data.transactionRef } }
        );
      } else {
        const ord = memoryOrders.find(o => o.orderId === data.orderId);
        if (ord) {
          ord.payment.status = 'Paid';
          ord.payment.transactionRef = data.transactionRef;
        }
      }

      await recordAuditLog({
        actorEmail: 'payment-gateway-webhook',
        actorRole: 'system',
        action: 'WEBHOOK_PAYMENT_SETTLED',
        targetResource: 'ORDER',
        targetId: data.orderId,
        correlationId: req.correlationId,
        details: data
      });
    }

    return res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: "Webhook handling error" });
  }
}
