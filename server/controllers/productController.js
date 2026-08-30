import {
  ProductModel,
  CategoryModel,
  StockMovementModel,
  NotificationModel,
  memoryProducts,
  memoryCategories,
  memoryStockMovements,
  memoryNotifications
} from "../models/index.js";
import { getDbStatus } from "../config/db.js";
import { emitNotification } from "../websockets/socketHandler.js";
import { recordAuditLog } from "../services/auditService.js";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[\s\W-]+/g, '-');
}

function normalizeCategory(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[\s\W-]+/g, '-');
}

export async function getAllProducts(req, res) {
  try {
    const categoryParam = req.query.categorySlug || req.query.category;
    const { search, sort, minPrice, maxPrice, inStock, inStockOnly, lowStock, rating, ratingMin } = req.query;

    const isStockOnly = inStock === 'true' || inStockOnly === 'true';
    const minRating = Number(ratingMin || rating);

    if (getDbStatus()) {
      const query = {};
      if (categoryParam && categoryParam !== 'All' && categoryParam !== 'all') {
        const normTarget = normalizeCategory(categoryParam);
        const originalEscaped = categoryParam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const withAnd = categoryParam.replace(/-/g, ' ').replace(/\band\b/i, '&');
        const withWordAnd = categoryParam.replace(/-/g, ' ').replace(/&/g, 'and');

        query.$or = [
          { category: new RegExp(`^${originalEscaped}$`, 'i') },
          { category: new RegExp(`^${withAnd}$`, 'i') },
          { category: new RegExp(`^${withWordAnd}$`, 'i') },
          { categorySlug: categoryParam },
          { categorySlug: normTarget },
          { categorySlug: new RegExp(`^${normTarget}$`, 'i') }
        ];
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { sku: { $regex: search, $options: "i" } }
        ];
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (isStockOnly) {
        query.stock = { $gt: 0 };
      }
      if (lowStock === 'true') {
        query.$expr = { $lte: ["$stock", "$lowStockThreshold"] };
      }
      if (!isNaN(minRating) && minRating > 0) {
        query.rating = { $gte: minRating };
      }

      let sortOption = { createdAt: -1 };
      if (sort === "price-low") sortOption = { price: 1 };
      else if (sort === "price-high") sortOption = { price: -1 };
      else if (sort === "rating") sortOption = { rating: -1 };
      else if (sort === "name-asc") sortOption = { name: 1 };

      const products = await ProductModel.find(query).sort(sortOption);
      return res.json(products);
    } else {
      let filtered = [...memoryProducts];

      if (categoryParam && categoryParam !== 'All' && categoryParam !== 'all') {
        const normTarget = normalizeCategory(categoryParam);
        filtered = filtered.filter(p => {
          const normCat = normalizeCategory(p.category || '');
          const normSlug = normalizeCategory(p.categorySlug || '');
          return (
            normCat === normTarget ||
            normSlug === normTarget ||
            (p.category && p.category.toLowerCase() === categoryParam.toLowerCase()) ||
            (p.categorySlug && p.categorySlug.toLowerCase() === categoryParam.toLowerCase())
          );
        });
      }

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          (p.sku && p.sku.toLowerCase().includes(s))
        );
      }

      if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));
      if (isStockOnly) filtered = filtered.filter(p => (p.stock || 0) > 0);
      if (lowStock === 'true') filtered = filtered.filter(p => (p.stock || 0) <= (p.lowStockThreshold || 5));
      if (!isNaN(minRating) && minRating > 0) filtered = filtered.filter(p => (p.rating || 0) >= minRating);

      if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
      else if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
      else if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
      else if (sort === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));

      return res.json(filtered);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    let product = null;

    if (getDbStatus()) {
      product = await ProductModel.findOne({
        $or: [{ productId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
    } else {
      product = memoryProducts.find(p => p.productId === id);
    }

    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product details" });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      stock = 25,
      lowStockThreshold = 5,
      description,
      image,
      secondaryImage,
      mediaGallery = [],
      features = [],
      colors = [],
      sizes = [],
      isNewItem = false,
      isBestSeller = false,
      sku
    } = req.body;

    if (!name || !category || price === undefined || !description || !image) {
      return res.status(400).json({ error: "Required fields: name, category, price, description, image" });
    }

    const productId = `prod-${Date.now()}`;
    const generatedSku = sku?.trim() || `AURA-${slugify(category).slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProductData = {
      productId,
      sku: generatedSku,
      name: name.trim(),
      category: category.trim(),
      categorySlug: slugify(category),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      rating: 5.0,
      reviewCount: 0,
      image: image.trim(),
      secondaryImage: secondaryImage?.trim() || image.trim(),
      mediaGallery: mediaGallery.length > 0 ? mediaGallery : [image.trim()],
      description: description.trim(),
      features: Array.isArray(features) ? features : [],
      colors: Array.isArray(colors) && colors.length > 0 ? colors : ['Standard'],
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['One Size'],
      inStock: Number(stock) > 0,
      isNewItem: Boolean(isNewItem),
      isBestSeller: Boolean(isBestSeller),
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (getDbStatus()) {
      const created = await ProductModel.create(newProductData);
      await CategoryModel.updateOne({ name: category }, { $inc: { itemCount: 1 } });

      await StockMovementModel.create({
        movementId: `mov-${Date.now()}`,
        productId,
        productName: newProductData.name,
        change: Number(stock),
        previousStock: 0,
        newStock: Number(stock),
        reason: 'RESTOCK',
        referenceId: 'INITIAL_CREATION',
        actor: req.user.email,
        timestamp: new Date()
      });

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'CREATE_PRODUCT',
        targetResource: 'PRODUCT',
        targetId: productId,
        correlationId: req.correlationId,
        details: { name: newProductData.name, price: newProductData.price, stock: newProductData.stock }
      });

      return res.status(201).json(created);
    } else {
      memoryProducts.unshift(newProductData);
      const cat = memoryCategories.find(c => c.name.toLowerCase() === category.toLowerCase());
      if (cat) cat.itemCount = (cat.itemCount || 0) + 1;

      memoryStockMovements.unshift({
        movementId: `mov-${Date.now()}`,
        productId,
        productName: newProductData.name,
        change: Number(stock),
        previousStock: 0,
        newStock: Number(stock),
        reason: 'RESTOCK',
        referenceId: 'INITIAL_CREATION',
        actor: req.user.email,
        timestamp: new Date()
      });

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'CREATE_PRODUCT',
        targetResource: 'PRODUCT',
        targetId: productId,
        correlationId: req.correlationId,
        details: { name: newProductData.name, price: newProductData.price, stock: newProductData.stock }
      });

      return res.status(201).json(newProductData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create product" });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    updates.updatedAt = new Date();

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.originalPrice !== undefined) updates.originalPrice = updates.originalPrice ? Number(updates.originalPrice) : null;
    if (updates.stock !== undefined) {
      updates.stock = Number(updates.stock);
      updates.inStock = updates.stock > 0;
    }
    if (updates.category) {
      updates.categorySlug = slugify(updates.category);
    }

    if (getDbStatus()) {
      const existing = await ProductModel.findOne({
        $or: [{ productId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (!existing) return res.status(404).json({ error: "Product not found" });

      const prevStock = existing.stock;
      const updated = await ProductModel.findOneAndUpdate(
        { _id: existing._id },
        updates,
        { new: true }
      );

      if (updates.stock !== undefined && updates.stock !== prevStock) {
        const diff = updates.stock - prevStock;
        await StockMovementModel.create({
          movementId: `mov-${Date.now()}`,
          productId: id,
          productName: updated.name,
          change: diff,
          previousStock: prevStock,
          newStock: updates.stock,
          reason: 'MANUAL_ADJUST',
          actor: req.user.email,
          timestamp: new Date()
        });

        if (updates.stock <= (updated.lowStockThreshold || 5)) {
          const alert = {
            notificationId: `notif-low-${id}-${Date.now()}`,
            recipientEmail: 'admin@auraboutique.com',
            title: `Low Stock Alert: ${updated.name}`,
            message: `Inventory reached ${updates.stock} units (Threshold: ${updated.lowStockThreshold || 5})`,
            type: 'INVENTORY_ALERT',
            isRead: false,
            createdAt: new Date()
          };
          await NotificationModel.create(alert);
          emitNotification(alert);
        }
      }

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'UPDATE_PRODUCT',
        targetResource: 'PRODUCT',
        targetId: id,
        correlationId: req.correlationId,
        details: updates
      });

      return res.json(updated);
    } else {
      const idx = memoryProducts.findIndex(p => p.productId === id);
      if (idx === -1) return res.status(404).json({ error: "Product not found" });

      const prevStock = memoryProducts[idx].stock;
      memoryProducts[idx] = { ...memoryProducts[idx], ...updates };

      if (updates.stock !== undefined && updates.stock !== prevStock) {
        const diff = updates.stock - prevStock;
        memoryStockMovements.unshift({
          movementId: `mov-${Date.now()}`,
          productId: id,
          productName: memoryProducts[idx].name,
          change: diff,
          previousStock: prevStock,
          newStock: updates.stock,
          reason: 'MANUAL_ADJUST',
          actor: req.user.email,
          timestamp: new Date()
        });

        if (updates.stock <= (memoryProducts[idx].lowStockThreshold || 5)) {
          const alert = {
            notificationId: `notif-low-${id}-${Date.now()}`,
            recipientEmail: 'admin@auraboutique.com',
            title: `Low Stock Alert: ${memoryProducts[idx].name}`,
            message: `Inventory reached ${updates.stock} units (Threshold: ${memoryProducts[idx].lowStockThreshold || 5})`,
            type: 'INVENTORY_ALERT',
            isRead: false,
            createdAt: new Date()
          };
          memoryNotifications.unshift(alert);
          emitNotification(alert);
        }
      }

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'UPDATE_PRODUCT',
        targetResource: 'PRODUCT',
        targetId: id,
        correlationId: req.correlationId,
        details: updates
      });

      return res.json(memoryProducts[idx]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update product" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const product = await ProductModel.findOne({
        $or: [{ productId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (!product) return res.status(404).json({ error: "Product not found" });

      await ProductModel.deleteOne({ _id: product._id });
      await CategoryModel.updateOne({ name: product.category }, { $inc: { itemCount: -1 } });

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'DELETE_PRODUCT',
        targetResource: 'PRODUCT',
        targetId: id,
        correlationId: req.correlationId,
        details: { productName: product.name, sku: product.sku }
      });

      return res.json({ message: "Product deleted successfully", id });
    } else {
      const idx = memoryProducts.findIndex(p => p.productId === id);
      if (idx === -1) return res.status(404).json({ error: "Product not found" });

      const prod = memoryProducts[idx];
      const cat = memoryCategories.find(c => c.name.toLowerCase() === prod.category?.toLowerCase());
      if (cat && cat.itemCount > 0) cat.itemCount -= 1;

      memoryProducts.splice(idx, 1);

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'DELETE_PRODUCT',
        targetResource: 'PRODUCT',
        targetId: id,
        correlationId: req.correlationId,
        details: { productName: prod.name, sku: prod.sku }
      });

      return res.json({ message: "Product deleted successfully", id });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete product" });
  }
}

export async function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    let product = null;

    if (getDbStatus()) {
      product = await ProductModel.findOne({
        $or: [{ productId }, { _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null }]
      });
    } else {
      product = memoryProducts.find(p => p.productId === productId);
    }

    if (!product) return res.status(404).json({ error: "Product not found" });
    const reviews = (product.reviews || []).filter(r => r.isApproved !== false);
    return res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

export async function addProductReview(req, res) {
  try {
    const { productId } = req.params;
    const { rating, comment, author, email } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating and review comment are required." });
    }

    const reviewAuthor = req.user?.name || author?.trim() || "Verified Buyer";
    const reviewEmail = req.user?.email || email?.trim() || "customer@example.com";
    const newReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor,
      email: reviewEmail,
      rating: Number(rating),
      date: 'Just now',
      comment: comment.trim(),
      isVerifiedPurchase: Boolean(req.user),
      isApproved: true,
      createdAt: new Date()
    };

    if (getDbStatus()) {
      const product = await ProductModel.findOne({
        $or: [{ productId }, { _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null }]
      });
      if (!product) return res.status(404).json({ error: "Product not found" });

      if (!product.reviews) product.reviews = [];
      product.reviews.unshift(newReview);

      const approvedReviews = product.reviews.filter(r => r.isApproved !== false);
      const totalStars = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
      product.reviewCount = approvedReviews.length;
      product.rating = Number((totalStars / approvedReviews.length).toFixed(1));

      await product.save();

      await recordAuditLog({
        actorEmail: reviewEmail,
        action: 'SUBMIT_REVIEW',
        targetResource: 'REVIEW',
        targetId: newReview.id,
        correlationId: req.correlationId,
        details: { productId, rating: newReview.rating }
      });

      return res.status(201).json({ review: newReview, productRating: product.rating, reviewCount: product.reviewCount });
    } else {
      const idx = memoryProducts.findIndex(p => p.productId === productId);
      if (idx === -1) return res.status(404).json({ error: "Product not found" });

      if (!memoryProducts[idx].reviews) memoryProducts[idx].reviews = [];
      memoryProducts[idx].reviews.unshift(newReview);

      const approvedReviews = memoryProducts[idx].reviews.filter(r => r.isApproved !== false);
      const totalStars = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
      memoryProducts[idx].reviewCount = approvedReviews.length;
      memoryProducts[idx].rating = Number((totalStars / approvedReviews.length).toFixed(1));

      await recordAuditLog({
        actorEmail: reviewEmail,
        action: 'SUBMIT_REVIEW',
        targetResource: 'REVIEW',
        targetId: newReview.id,
        correlationId: req.correlationId,
        details: { productId, rating: newReview.rating }
      });

      return res.status(201).json({
        review: newReview,
        productRating: memoryProducts[idx].rating,
        reviewCount: memoryProducts[idx].reviewCount
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to submit review" });
  }
}

export async function moderateReview(req, res) {
  try {
    const { productId, reviewId } = req.params;
    const { isApproved } = req.body;

    if (getDbStatus()) {
      const product = await ProductModel.findOne({ productId });
      if (!product) return res.status(404).json({ error: "Product not found" });

      const rev = (product.reviews || []).find(r => r.id === reviewId);
      if (!rev) return res.status(404).json({ error: "Review not found" });

      rev.isApproved = Boolean(isApproved);
      await product.save();

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'MODERATE_REVIEW',
        targetResource: 'REVIEW',
        targetId: reviewId,
        correlationId: req.correlationId,
        details: { productId, isApproved }
      });

      return res.json({ message: "Review moderation status updated", review: rev });
    } else {
      const prod = memoryProducts.find(p => p.productId === productId);
      if (!prod) return res.status(404).json({ error: "Product not found" });

      const rev = (prod.reviews || []).find(r => r.id === reviewId);
      if (!rev) return res.status(404).json({ error: "Review not found" });

      rev.isApproved = Boolean(isApproved);

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'MODERATE_REVIEW',
        targetResource: 'REVIEW',
        targetId: reviewId,
        correlationId: req.correlationId,
        details: { productId, isApproved }
      });

      return res.json({ message: "Review moderation status updated", review: rev });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to moderate review" });
  }
}
