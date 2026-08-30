import {
  ProductModel,
  StockMovementModel,
  NotificationModel,
  memoryProducts,
  memoryStockMovements,
  memoryNotifications
} from "../models/index.js";
import { getDbStatus } from "../config/db.js";
import { recordAuditLog } from "../services/auditService.js";
import { emitNotification } from "../websockets/socketHandler.js";

export async function getInventorySummary(req, res) {
  try {
    let products = [];
    if (getDbStatus()) {
      products = await ProductModel.find({});
    } else {
      products = memoryProducts;
    }

    const totalSKUs = products.length;
    const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const lowStockItems = products.filter(p => (p.stock || 0) <= (p.lowStockThreshold || 5));
    const outOfStockItems = products.filter(p => (p.stock || 0) === 0);
    const inventoryValuation = products.reduce((acc, p) => acc + ((p.stock || 0) * (p.price || 0)), 0);

    return res.json({
      totalSKUs,
      totalUnits,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      inventoryValuation: Number(inventoryValuation.toFixed(2)),
      lowStockAlerts: lowStockItems.map(p => ({
        productId: p.productId,
        name: p.name,
        stock: p.stock,
        threshold: p.lowStockThreshold || 5,
        sku: p.sku
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load inventory summary" });
  }
}

export async function getLowStock(req, res) {
  try {
    let products = [];
    if (getDbStatus()) {
      products = await ProductModel.find({});
    } else {
      products = memoryProducts;
    }
    const lowStockItems = products.filter(p => (p.stock || 0) <= (p.lowStockThreshold || 5));
    return res.json(lowStockItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to load low stock items" });
  }
}

export async function getStockMovements(req, res) {
  try {
    const { productId, limit = 50 } = req.query;

    if (getDbStatus()) {
      const query = productId ? { productId } : {};
      const movements = await StockMovementModel.find(query).sort({ timestamp: -1 }).limit(Number(limit));
      return res.json(movements);
    } else {
      let list = [...memoryStockMovements];
      if (productId) list = list.filter(m => m.productId === productId);
      return res.json(list.slice(0, Number(limit)));
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to load stock movements" });
  }
}

export async function adjustStock(req, res) {
  try {
    const { productId, change, reason = 'MANUAL_ADJUST', referenceId } = req.body;
    if (!productId || change === undefined) {
      return res.status(400).json({ error: "Product ID and stock change amount are required" });
    }

    const delta = Number(change);
    if (isNaN(delta)) return res.status(400).json({ error: "Invalid change amount" });

    let product = null;
    let prevStock = 0;
    let newStock = 0;

    if (getDbStatus()) {
      product = await ProductModel.findOne({
        $or: [{ productId }, { _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null }]
      });
      if (!product) return res.status(404).json({ error: "Product not found" });

      prevStock = product.stock || 0;
      newStock = Math.max(0, prevStock + delta);
      product.stock = newStock;
      product.inStock = newStock > 0;
      await product.save();

      const movement = await StockMovementModel.create({
        movementId: `mov-adj-${Date.now()}`,
        productId: product.productId,
        productName: product.name,
        change: delta,
        previousStock: prevStock,
        newStock: newStock,
        reason,
        referenceId: referenceId || `MANUAL-${Date.now()}`,
        actor: req.user.email,
        timestamp: new Date()
      });

      if (newStock <= (product.lowStockThreshold || 5)) {
        const notif = {
          notificationId: `notif-stock-${product.productId}-${Date.now()}`,
          recipientEmail: 'admin@auraboutique.com',
          title: `Low Stock Alert: ${product.name}`,
          message: `Stock level is currently ${newStock} units (Threshold: ${product.lowStockThreshold || 5})`,
          type: 'INVENTORY_ALERT',
          isRead: false,
          createdAt: new Date()
        };
        await NotificationModel.create(notif);
        emitNotification(notif);
      }

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'ADJUST_INVENTORY',
        targetResource: 'INVENTORY',
        targetId: product.productId,
        correlationId: req.correlationId,
        details: { change: delta, previousStock: prevStock, newStock, reason }
      });

      return res.json({ product, movement });
    } else {
      product = memoryProducts.find(p => p.productId === productId);
      if (!product) return res.status(404).json({ error: "Product not found" });

      prevStock = product.stock || 0;
      newStock = Math.max(0, prevStock + delta);
      product.stock = newStock;
      product.inStock = newStock > 0;

      const movement = {
        movementId: `mov-adj-${Date.now()}`,
        productId: product.productId,
        productName: product.name,
        change: delta,
        previousStock: prevStock,
        newStock: newStock,
        reason,
        referenceId: referenceId || `MANUAL-${Date.now()}`,
        actor: req.user.email,
        timestamp: new Date()
      };
      memoryStockMovements.unshift(movement);

      if (newStock <= (product.lowStockThreshold || 5)) {
        const notif = {
          notificationId: `notif-stock-${product.productId}-${Date.now()}`,
          recipientEmail: 'admin@auraboutique.com',
          title: `Low Stock Alert: ${product.name}`,
          message: `Stock level is currently ${newStock} units (Threshold: ${product.lowStockThreshold || 5})`,
          type: 'INVENTORY_ALERT',
          isRead: false,
          createdAt: new Date()
        };
        memoryNotifications.unshift(notif);
        emitNotification(notif);
      }

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'ADJUST_INVENTORY',
        targetResource: 'INVENTORY',
        targetId: product.productId,
        correlationId: req.correlationId,
        details: { change: delta, previousStock: prevStock, newStock, reason }
      });

      return res.json({ product, movement });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to adjust inventory stock" });
  }
}
