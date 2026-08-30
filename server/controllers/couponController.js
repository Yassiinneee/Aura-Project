import { CouponModel, memoryCoupons } from "../models/index.js";
import { getDbStatus } from "../config/db.js";
import { recordAuditLog } from "../services/auditService.js";

export async function getAllCoupons(req, res) {
  try {
    if (getDbStatus()) {
      const coupons = await CouponModel.find({}).sort({ createdAt: -1 });
      return res.json(coupons);
    } else {
      return res.json(memoryCoupons);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
}

export async function createCoupon(req, res) {
  try {
    const { code, discountType = 'percentage', discountValue, minOrderValue = 0, maxUses = 100, expiresAt, isActive = true } = req.body;
    if (!code || discountValue === undefined) {
      return res.status(400).json({ error: "Coupon code and discount value are required" });
    }

    const codeUpper = code.trim().toUpperCase();
    const couponId = `coup-${Date.now()}`;
    const newCoupon = {
      couponId,
      code: codeUpper,
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue),
      maxUses: Number(maxUses),
      usedCount: 0,
      expiresAt: expiresAt || null,
      isActive: Boolean(isActive),
      createdAt: new Date()
    };

    if (getDbStatus()) {
      const existing = await CouponModel.findOne({ code: codeUpper });
      if (existing) return res.status(400).json({ error: "Coupon code already exists" });

      const created = await CouponModel.create(newCoupon);

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'CREATE_COUPON',
        targetResource: 'COUPON',
        targetId: couponId,
        correlationId: req.correlationId,
        details: { code: codeUpper, discountType, discountValue }
      });

      return res.status(201).json(created);
    } else {
      const existing = memoryCoupons.find(c => c.code === codeUpper);
      if (existing) return res.status(400).json({ error: "Coupon code already exists" });

      memoryCoupons.unshift(newCoupon);

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'CREATE_COUPON',
        targetResource: 'COUPON',
        targetId: couponId,
        correlationId: req.correlationId,
        details: { code: codeUpper, discountType, discountValue }
      });

      return res.status(201).json(newCoupon);
    }
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create coupon" });
  }
}

export async function deleteCoupon(req, res) {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const deleted = await CouponModel.findOneAndDelete({
        $or: [{ couponId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (!deleted) return res.status(404).json({ error: "Coupon not found" });

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'DELETE_COUPON',
        targetResource: 'COUPON',
        targetId: id,
        correlationId: req.correlationId,
        details: { code: deleted.code }
      });

      return res.json({ message: "Coupon deleted successfully", id });
    } else {
      const idx = memoryCoupons.findIndex(c => c.couponId === id);
      if (idx === -1) return res.status(404).json({ error: "Coupon not found" });

      const deleted = memoryCoupons.splice(idx, 1)[0];

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'DELETE_COUPON',
        targetResource: 'COUPON',
        targetId: id,
        correlationId: req.correlationId,
        details: { code: deleted.code }
      });

      return res.json({ message: "Coupon deleted successfully", id });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete coupon" });
  }
}

export async function validateCoupon(req, res) {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) return res.status(400).json({ error: "Coupon code required" });

    const codeUpper = code.trim().toUpperCase();
    let coupon = null;

    if (getDbStatus()) {
      coupon = await CouponModel.findOne({ code: codeUpper, isActive: true });
    } else {
      coupon = memoryCoupons.find(c => c.code === codeUpper && c.isActive);
    }

    if (!coupon) {
      return res.status(404).json({ valid: false, error: "Invalid promo code" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, error: "Promo code has expired" });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ valid: false, error: "Promo code usage limit has been reached" });
    }

    if (coupon.minOrderValue && Number(subtotal) < coupon.minOrderValue) {
      return res.status(400).json({
        valid: false,
        error: `Promo code requires a minimum order value of $${coupon.minOrderValue}`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (Number(subtotal) * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }
    discountAmount = Math.min(Number(subtotal), discountAmount);

    return res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Number(discountAmount.toFixed(2)),
      minOrderValue: coupon.minOrderValue
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to validate coupon" });
  }
}
