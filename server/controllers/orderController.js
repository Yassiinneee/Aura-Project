import {
  OrderModel,
  ProductModel,
  CouponModel,
  StockMovementModel,
  NotificationModel,
  memoryOrders,
  memoryProducts,
  memoryCoupons,
  memoryStockMovements,
  memoryNotifications,
  DELIVERY_OPTIONS,
  VALID_STATUS_TRANSITIONS
} from "../models/index.js";
import { getDbStatus } from "../config/db.js";
import { processPaymentSimulation } from "../services/paymentService.js";
import { sendEmail } from "../services/emailService.js";
import { recordAuditLog } from "../services/auditService.js";
import { emitNotification } from "../websockets/socketHandler.js";
import { generateInvoiceHtml } from "../services/pdfService.js";

export async function createOrder(req, res) {
  try {
    const { items, shippingAddress, deliveryOptionId = 'standard', promoCode, paymentDetails } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ error: "Complete shipping address is required" });
    }

    const userEmail = req.user?.email || shippingAddress.email?.toLowerCase().trim();
    if (!userEmail) {
      return res.status(400).json({ error: "A valid customer email address is required" });
    }

    // 1. Authoritative Server Inventory Check & Price Snapshotting
    let calculatedSubtotal = 0;
    const validatedItems = [];
    const stockDeductionsToCommit = [];

    for (const rawItem of items) {
      let product = null;
      if (getDbStatus()) {
        product = await ProductModel.findOne({
          $or: [{ productId: rawItem.productId }, { _id: rawItem.productId.match(/^[0-9a-fA-F]{24}$/) ? rawItem.productId : null }]
        });
      } else {
        product = memoryProducts.find(p => p.productId === rawItem.productId);
      }

      if (!product) {
        return res.status(400).json({ error: `Product '${rawItem.name || rawItem.productId}' is no longer available in our boutique.` });
      }

      const requestedQty = Math.max(1, Number(rawItem.quantity) || 1);
      const availableStock = product.stock !== undefined ? product.stock : 25;

      if (availableStock < requestedQty) {
        return res.status(400).json({
          error: `Insufficient stock for '${product.name}'. Available: ${availableStock}, Requested: ${requestedQty}.`
        });
      }

      const authoritativePrice = product.price;
      const lineTotal = authoritativePrice * requestedQty;
      calculatedSubtotal += lineTotal;

      validatedItems.push({
        productId: product.productId,
        name: product.name,
        unitPrice: authoritativePrice,
        price: authoritativePrice,
        quantity: requestedQty,
        selectedColor: rawItem.selectedColor || (product.colors?.[0] || 'Standard'),
        selectedSize: rawItem.selectedSize || (product.sizes?.[0] || 'One Size'),
        image: product.image,
        lineTotal
      });

      stockDeductionsToCommit.push({
        productDoc: product,
        productId: product.productId,
        productName: product.name,
        qty: requestedQty,
        previousStock: availableStock,
        newStock: availableStock - requestedQty,
        threshold: product.lowStockThreshold || 5
      });
    }

    // 2. Authoritative Coupon Verification
    let calculatedDiscount = 0;
    let appliedCouponDoc = null;

    if (promoCode && promoCode.trim().length > 0) {
      const codeUpper = promoCode.trim().toUpperCase();
      let coupon = null;

      if (getDbStatus()) {
        coupon = await CouponModel.findOne({ code: codeUpper, isActive: true });
      } else {
        coupon = memoryCoupons.find(c => c.code === codeUpper && c.isActive);
      }

      if (coupon) {
        if (coupon.minOrderValue && calculatedSubtotal < coupon.minOrderValue) {
          return res.status(400).json({
            error: `Promo code ${coupon.code} requires a minimum order of $${coupon.minOrderValue}.`
          });
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
          return res.status(400).json({ error: "Promo code has expired." });
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          return res.status(400).json({ error: "Promo code usage limit has been reached." });
        }

        if (coupon.discountType === 'percentage') {
          calculatedDiscount = (calculatedSubtotal * coupon.discountValue) / 100;
        } else {
          calculatedDiscount = coupon.discountValue;
        }
        calculatedDiscount = Math.min(calculatedSubtotal, calculatedDiscount);
        appliedCouponDoc = coupon;
      }
    }

    // 3. Shipping Delivery Option
    const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === deliveryOptionId) || DELIVERY_OPTIONS[0];
    let shippingFee = selectedDelivery.price;
    if (selectedDelivery.threshold > 0 && calculatedSubtotal >= selectedDelivery.threshold) {
      shippingFee = 0;
    }

    const calculatedTotal = Number((calculatedSubtotal - calculatedDiscount + shippingFee).toFixed(2));

    // 4. Simulated Payment Gateway Settlement
    const paymentResult = processPaymentSimulation({
      method: paymentDetails?.method || 'card',
      amount: calculatedTotal,
      cardDetails: paymentDetails?.cardDetails
    });

    // 5. Commit Stock Deductions & Movement Logs
    for (const itemDeduct of stockDeductionsToCommit) {
      if (getDbStatus()) {
        await ProductModel.updateOne(
          { productId: itemDeduct.productId },
          {
            $set: { stock: itemDeduct.newStock, inStock: itemDeduct.newStock > 0 },
            $inc: { reviewCount: 0 }
          }
        );

        await StockMovementModel.create({
          movementId: `mov-ord-${Date.now()}-${itemDeduct.productId}`,
          productId: itemDeduct.productId,
          productName: itemDeduct.productName,
          change: -itemDeduct.qty,
          previousStock: itemDeduct.previousStock,
          newStock: itemDeduct.newStock,
          reason: 'ORDER_DEDUCT',
          referenceId: `CHECKOUT-${Date.now()}`,
          actor: userEmail,
          timestamp: new Date()
        });
      } else {
        const prod = memoryProducts.find(p => p.productId === itemDeduct.productId);
        if (prod) {
          prod.stock = itemDeduct.newStock;
          prod.inStock = itemDeduct.newStock > 0;
        }

        memoryStockMovements.unshift({
          movementId: `mov-ord-${Date.now()}-${itemDeduct.productId}`,
          productId: itemDeduct.productId,
          productName: itemDeduct.productName,
          change: -itemDeduct.qty,
          previousStock: itemDeduct.previousStock,
          newStock: itemDeduct.newStock,
          reason: 'ORDER_DEDUCT',
          referenceId: `CHECKOUT-${Date.now()}`,
          actor: userEmail,
          timestamp: new Date()
        });
      }

      // Check Low Stock Threshold & Broadcast to Admin
      if (itemDeduct.newStock <= itemDeduct.threshold) {
        const lowStockNotif = {
          notificationId: `notif-stock-${itemDeduct.productId}-${Date.now()}`,
          recipientEmail: 'admin@auraboutique.com',
          title: `Low Stock Alert: ${itemDeduct.productName}`,
          message: `Stock level dropped to ${itemDeduct.newStock} units (Threshold: ${itemDeduct.threshold})`,
          type: 'INVENTORY_ALERT',
          isRead: false,
          createdAt: new Date().toISOString()
        };
        if (getDbStatus()) await NotificationModel.create(lowStockNotif);
        else memoryNotifications.unshift(lowStockNotif);

        emitNotification(lowStockNotif);
      }
    }

    // 6. Increment Coupon Usage
    if (appliedCouponDoc) {
      if (getDbStatus()) {
        await CouponModel.updateOne({ _id: appliedCouponDoc._id }, { $inc: { usedCount: 1 } });
      } else {
        appliedCouponDoc.usedCount = (appliedCouponDoc.usedCount || 0) + 1;
      }
    }

    // 7. Persist New Order Record
    const orderId = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newOrderData = {
      orderId,
      userEmail,
      userId: req.user?.userId,
      customerName: shippingAddress.fullName,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      promoCode: appliedCouponDoc ? appliedCouponDoc.code : "",
      deliveryOption: {
        id: selectedDelivery.id,
        name: selectedDelivery.name,
        estimatedDays: selectedDelivery.estimatedDays,
        price: shippingFee
      },
      shippingFee,
      total: calculatedTotal,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: userEmail,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'United States',
      },
      payment: {
        status: 'Paid',
        method: paymentResult.method,
        last4: paymentResult.last4,
        cardBrand: paymentResult.cardBrand,
        transactionRef: paymentResult.transactionRef,
      },
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: nowIso,
          note: 'Order submitted & payment settled via secure simulated boundary',
          updatedBy: 'Checkout Service'
        }
      ],
      correlationId: req.correlationId,
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };

    if (getDbStatus()) {
      await OrderModel.create(newOrderData);
    } else {
      memoryOrders.unshift(newOrderData);
    }

    // 8. Email Notification (FEATURE-019)
    await sendEmail({
      to: userEmail,
      subject: `Order Confirmation ${orderId} - Aura & Co.`,
      template: 'ORDER_CONFIRMATION',
      payload: newOrderData
    });

    // 9. Real-Time Socket.IO Notification (FEATURE-011)
    const notif = {
      notificationId: `notif-${Date.now()}`,
      recipientEmail: userEmail,
      title: 'Order Confirmed',
      message: `Your order ${orderId} for $${calculatedTotal.toFixed(2)} has been placed successfully!`,
      type: 'ORDER_STATUS',
      orderId,
      isRead: false,
      createdAt: nowIso
    };
    if (getDbStatus()) await NotificationModel.create(notif);
    else memoryNotifications.unshift(notif);

    emitNotification(notif);

    return res.status(201).json(newOrderData);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: error.message || "Failed to place order" });
  }
}

export async function getOrders(req, res) {
  try {
    const emailQuery = req.query.email;
    const statusFilter = req.query.status;
    const isAdmin = req.user && req.user.role === 'admin';

    let targetEmail = null;
    if (isAdmin && !emailQuery) {
      targetEmail = null;
    } else if (req.user) {
      targetEmail = req.user.role === 'admin' && emailQuery ? emailQuery.toLowerCase() : req.user.email.toLowerCase();
    } else if (emailQuery) {
      targetEmail = emailQuery.toLowerCase();
    } else {
      return res.json([]);
    }

    if (getDbStatus()) {
      const query = {};
      if (targetEmail) query.userEmail = targetEmail;
      if (statusFilter && statusFilter !== 'All') query.status = statusFilter;
      const orders = await OrderModel.find(query).sort({ _id: -1 });
      return res.json(orders);
    } else {
      let list = [...memoryOrders];
      if (targetEmail) list = list.filter(o => o.userEmail.toLowerCase() === targetEmail.toLowerCase());
      if (statusFilter && statusFilter !== 'All') list = list.filter(o => o.status === statusFilter);
      return res.json(list);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

export async function getAllOrdersAdmin(req, res) {
  try {
    const { status, search } = req.query;
    if (getDbStatus()) {
      const query = {};
      if (status && status !== 'All') query.status = status;
      if (search) {
        query.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { userEmail: { $regex: search, $options: 'i' } },
          { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        ];
      }
      const orders = await OrderModel.find(query).sort({ _id: -1 });
      return res.json(orders);
    } else {
      let list = [...memoryOrders];
      if (status && status !== 'All') list = list.filter(o => o.status === status);
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(o =>
          o.orderId.toLowerCase().includes(s) ||
          o.userEmail.toLowerCase().includes(s) ||
          o.shippingAddress?.fullName?.toLowerCase().includes(s)
        );
      }
      return res.json(list);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load admin orders" });
  }
}

export async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;
    let order = null;

    if (getDbStatus()) {
      order = await OrderModel.findOne({
        $or: [{ orderId }, { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }]
      });
    } else {
      order = memoryOrders.find(o => o.orderId === orderId);
    }

    if (!order) return res.status(404).json({ error: "Order not found" });

    // Authorization check
    if (req.user && req.user.role !== 'admin' && req.user.email.toLowerCase() !== order.userEmail.toLowerCase()) {
      return res.status(403).json({ error: "Access denied to this order" });
    }

    return res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to load order" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status: nextStatus, note } = req.body;

    if (!nextStatus) return res.status(400).json({ error: "New status required" });

    const allValid = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allValid.includes(nextStatus)) {
      return res.status(400).json({ error: `Invalid status '${nextStatus}'.` });
    }

    let order = null;
    if (getDbStatus()) {
      order = await OrderModel.findOne({ $or: [{ orderId }, { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }] });
    } else {
      order = memoryOrders.find(o => o.orderId === orderId);
    }

    if (!order) return res.status(404).json({ error: "Order not found" });

    const currentStatus = order.status;
    const allowed = VALID_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      return res.status(400).json({
        error: `Cannot transition from '${currentStatus}' to '${nextStatus}'. Allowed: [${allowed.join(', ')}]`
      });
    }

    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const transitionEntry = {
      status: nextStatus,
      timestamp: nowIso,
      note: note?.trim() || `Status updated to ${nextStatus}`,
      updatedBy: req.user.name || 'Admin',
    };

    order.status = nextStatus;
    order.updatedAt = formattedDate;
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push(transitionEntry);

    if (getDbStatus()) await order.save();

    // Emit Deduplicated Order Status Real-Time Notification
    const notif = {
      notificationId: `notif-ord-${orderId}-${nextStatus}-${Date.now()}`,
      recipientEmail: order.userEmail,
      title: `Order Status: ${nextStatus}`,
      message: `Your order ${orderId} has been updated to "${nextStatus}". ${note ? `(${note})` : ''}`,
      type: 'ORDER_STATUS',
      orderId,
      isRead: false,
      createdAt: nowIso
    };

    if (getDbStatus()) await NotificationModel.create(notif);
    else memoryNotifications.unshift(notif);

    emitNotification(notif);

    // Send Customer Email Notification
    await sendEmail({
      to: order.userEmail,
      subject: `Order Update: ${nextStatus} - Order ${orderId}`,
      template: 'ORDER_STATUS_UPDATE',
      payload: {
        orderId,
        status: nextStatus,
        customerName: order.customerName || order.shippingAddress?.fullName,
        note
      }
    });

    // Audit Log
    await recordAuditLog({
      actorEmail: req.user.email,
      action: 'UPDATE_ORDER_STATUS',
      targetResource: 'ORDER',
      targetId: orderId,
      correlationId: req.correlationId,
      details: { previousStatus: currentStatus, newStatus: nextStatus, note }
    });

    return res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update order status" });
  }
}

export async function downloadInvoice(req, res) {
  try {
    const { orderId } = req.params;
    let order = null;

    if (getDbStatus()) {
      order = await OrderModel.findOne({
        $or: [{ orderId }, { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }]
      });
    } else {
      order = memoryOrders.find(o => o.orderId === orderId);
    }

    if (!order) return res.status(404).send("<h1>Order not found</h1>");

    const html = generateInvoiceHtml(order);
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch (err) {
    res.status(500).send("<h1>Failed to generate invoice</h1>");
  }
}
