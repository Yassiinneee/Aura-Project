import { WishlistModel, ProductModel, memoryWishlists, memoryProducts } from "../models/index.js";
import { getDbStatus } from "../config/db.js";

async function populateWishlistProducts(productIds) {
  if (!productIds || productIds.length === 0) return [];
  if (getDbStatus()) {
    const products = await ProductModel.find({
      $or: [
        { productId: { $in: productIds } },
        { id: { $in: productIds } },
        { _id: { $in: productIds.filter(id => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) } }
      ]
    });
    return products.map(p => ({
      id: p.productId || p._id.toString(),
      productId: p.productId || p._id.toString(),
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      secondaryImage: p.secondaryImage,
      category: p.category,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      inStock: p.inStock
    }));
  } else {
    return memoryProducts
      .filter(p => productIds.includes(p.productId) || productIds.includes(p.id))
      .map(p => ({
        id: p.productId || p.id,
        productId: p.productId || p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        secondaryImage: p.secondaryImage,
        category: p.category,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        inStock: p.inStock
      }));
  }
}

export async function getWishlist(req, res) {
  try {
    const userEmail = req.user?.email || req.query.email;
    if (!userEmail) return res.json({ productIds: [], products: [] });

    const normalized = userEmail.toLowerCase().trim();

    if (getDbStatus()) {
      let wl = await WishlistModel.findOne({ userEmail: normalized });
      const productIds = wl ? (wl.productIds || []) : [];
      const products = await populateWishlistProducts(productIds);
      return res.json({ productIds, products });
    } else {
      let wl = memoryWishlists.find(w => w.userEmail.toLowerCase() === normalized);
      const productIds = wl ? (wl.productIds || []) : [];
      const products = await populateWishlistProducts(productIds);
      return res.json({ productIds, products });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
}

export async function addToWishlist(req, res) {
  try {
    const productId = req.params.productId || req.body.productId;
    const userEmail = req.user?.email || req.body.email || req.query.email;

    if (!userEmail || !productId) {
      return res.status(400).json({ error: "Product ID and user email required" });
    }

    const normalized = userEmail.toLowerCase().trim();

    if (getDbStatus()) {
      let wl = await WishlistModel.findOne({ userEmail: normalized });
      if (!wl) {
        wl = await WishlistModel.create({ userEmail: normalized, productIds: [productId] });
      } else {
        if (!wl.productIds.includes(productId)) {
          wl.productIds.push(productId);
          wl.updatedAt = new Date();
          await wl.save();
        }
      }
      const products = await populateWishlistProducts(wl.productIds);
      return res.json({ productIds: wl.productIds, products });
    } else {
      let wl = memoryWishlists.find(w => w.userEmail.toLowerCase() === normalized);
      if (!wl) {
        wl = { userEmail: normalized, productIds: [productId], updatedAt: new Date() };
        memoryWishlists.push(wl);
      } else {
        if (!wl.productIds.includes(productId)) {
          wl.productIds.push(productId);
          wl.updatedAt = new Date();
        }
      }
      const products = await populateWishlistProducts(wl.productIds);
      return res.json({ productIds: wl.productIds, products });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const productId = req.params.productId || req.body.productId;
    const userEmail = req.user?.email || req.body.email || req.query.email;

    if (!userEmail || !productId) {
      return res.status(400).json({ error: "User email and product ID required" });
    }
    const normalized = userEmail.toLowerCase().trim();

    if (getDbStatus()) {
      let wl = await WishlistModel.findOne({ userEmail: normalized });
      if (wl) {
        wl.productIds = wl.productIds.filter(id => id !== productId);
        wl.updatedAt = new Date();
        await wl.save();
        const products = await populateWishlistProducts(wl.productIds);
        return res.json({ productIds: wl.productIds, products });
      }
      return res.json({ productIds: [], products: [] });
    } else {
      let wl = memoryWishlists.find(w => w.userEmail.toLowerCase() === normalized);
      if (wl) {
        wl.productIds = wl.productIds.filter(id => id !== productId);
        wl.updatedAt = new Date();
        const products = await populateWishlistProducts(wl.productIds);
        return res.json({ productIds: wl.productIds, products });
      }
      return res.json({ productIds: [], products: [] });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
}
