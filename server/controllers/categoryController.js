import { CategoryModel, ProductModel, memoryCategories, memoryProducts } from "../models/index.js";
import { getDbStatus } from "../config/db.js";
import { recordAuditLog } from "../services/auditService.js";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
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

export async function getAllCategories(req, res) {
  try {
    if (getDbStatus()) {
      const rawCategories = await CategoryModel.find({}).sort({ createdAt: 1 });
      const products = await ProductModel.find({});
      
      const categories = rawCategories.map(cat => {
        const catObj = cat.toObject ? cat.toObject() : { ...cat };
        const normName = normalizeCategory(catObj.name);
        const normSlug = normalizeCategory(catObj.slug);
        const count = products.filter(p => {
          const pNormCat = normalizeCategory(p.category || '');
          const pNormSlug = normalizeCategory(p.categorySlug || '');
          return (
            pNormCat === normName ||
            pNormSlug === normSlug ||
            (p.category && p.category.toLowerCase() === catObj.name?.toLowerCase()) ||
            (p.categorySlug && p.categorySlug.toLowerCase() === catObj.slug?.toLowerCase())
          );
        }).length;
        return {
          ...catObj,
          itemCount: count > 0 ? count : (catObj.itemCount || 0)
        };
      });
      return res.json(categories);
    } else {
      const categories = memoryCategories.map(cat => {
        const normName = normalizeCategory(cat.name);
        const normSlug = normalizeCategory(cat.slug);
        const count = memoryProducts.filter(p => {
          const pNormCat = normalizeCategory(p.category || '');
          const pNormSlug = normalizeCategory(p.categorySlug || '');
          return (
            pNormCat === normName ||
            pNormSlug === normSlug ||
            (p.category && p.category.toLowerCase() === cat.name?.toLowerCase()) ||
            (p.categorySlug && p.categorySlug.toLowerCase() === cat.slug?.toLowerCase())
          );
        }).length;
        return {
          ...cat,
          itemCount: count > 0 ? count : (cat.itemCount || 0)
        };
      });
      return res.json(categories);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

export async function getCategoryBySlugOrId(req, res) {
  try {
    const { slugOrId } = req.params;
    let category = null;

    if (getDbStatus()) {
      category = await CategoryModel.findOne({
        $or: [{ slug: slugOrId }, { categoryId: slugOrId }]
      });
    } else {
      category = memoryCategories.find(c => c.slug === slugOrId || c.categoryId === slugOrId);
    }

    if (!category) return res.status(404).json({ error: "Category not found" });
    return res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, slug: providedSlug, description, image, isActive } = req.body;
    if (!name || name.trim().length < 2) return res.status(400).json({ error: "Category name is required" });

    const finalSlug = (providedSlug && providedSlug.trim().length > 0) ? slugify(providedSlug) : slugify(name);
    const categoryId = `cat-${Date.now()}`;

    const newCategoryData = {
      categoryId,
      name: name.trim(),
      slug: finalSlug,
      description: description || "",
      image: image || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      isActive: isActive !== undefined ? isActive : true,
      itemCount: 0,
      createdAt: new Date(),
    };

    if (getDbStatus()) {
      const existing = await CategoryModel.findOne({
        $or: [{ name: newCategoryData.name }, { slug: newCategoryData.slug }]
      });
      if (existing) {
        return res.status(400).json({ error: "A category with this name or slug already exists." });
      }
      const created = await CategoryModel.create(newCategoryData);
      
      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'CREATE_CATEGORY',
        targetResource: 'CATEGORY',
        targetId: categoryId,
        correlationId: req.correlationId,
        details: { name: newCategoryData.name, slug: newCategoryData.slug }
      });

      return res.status(201).json(created);
    } else {
      const existing = memoryCategories.find(c => c.name.toLowerCase() === newCategoryData.name.toLowerCase() || c.slug === newCategoryData.slug);
      if (existing) {
        return res.status(400).json({ error: "A category with this name or slug already exists." });
      }
      memoryCategories.push(newCategoryData);

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'CREATE_CATEGORY',
        targetResource: 'CATEGORY',
        targetId: categoryId,
        correlationId: req.correlationId,
        details: { name: newCategoryData.name, slug: newCategoryData.slug }
      });

      return res.status(201).json(newCategoryData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create category" });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, slug: providedSlug, description, image, isActive } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (providedSlug) updates.slug = slugify(providedSlug);
    else if (name) updates.slug = slugify(name);
    if (description !== undefined) updates.description = description;
    if (image !== undefined) updates.image = image;
    if (isActive !== undefined) updates.isActive = isActive;

    if (getDbStatus()) {
      const updated = await CategoryModel.findOneAndUpdate(
        { $or: [{ categoryId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        updates,
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: "Category not found" });

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'UPDATE_CATEGORY',
        targetResource: 'CATEGORY',
        targetId: id,
        correlationId: req.correlationId,
        details: updates
      });

      return res.json(updated);
    } else {
      const idx = memoryCategories.findIndex(c => c.categoryId === id);
      if (idx === -1) return res.status(404).json({ error: "Category not found" });

      memoryCategories[idx] = { ...memoryCategories[idx], ...updates };

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'UPDATE_CATEGORY',
        targetResource: 'CATEGORY',
        targetId: id,
        correlationId: req.correlationId,
        details: updates
      });

      return res.json(memoryCategories[idx]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update category" });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const category = await CategoryModel.findOne({
        $or: [{ categoryId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (!category) return res.status(404).json({ error: "Category not found" });

      const assignedProducts = await ProductModel.countDocuments({
        $or: [{ category: category.name }, { categorySlug: category.slug }]
      });

      if (assignedProducts > 0) {
        return res.status(400).json({
          error: `Cannot delete category: ${assignedProducts} product(s) are currently assigned to it. Reassign or delete products first.`
        });
      }

      await CategoryModel.deleteOne({ _id: category._id });

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'DELETE_CATEGORY',
        targetResource: 'CATEGORY',
        targetId: id,
        correlationId: req.correlationId,
        details: { categoryName: category.name }
      });

      return res.json({ message: "Category deleted successfully", id });
    } else {
      const category = memoryCategories.find(c => c.categoryId === id);
      if (!category) return res.status(404).json({ error: "Category not found" });

      const assigned = memoryProducts.filter(p => p.category === category.name || p.categorySlug === category.slug);
      if (assigned.length > 0) {
        return res.status(400).json({
          error: `Cannot delete category: ${assigned.length} product(s) are assigned to it.`
        });
      }

      const idx = memoryCategories.findIndex(c => c.categoryId === id);
      memoryCategories.splice(idx, 1);

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'DELETE_CATEGORY',
        targetResource: 'CATEGORY',
        targetId: id,
        correlationId: req.correlationId,
        details: { categoryName: category.name }
      });

      return res.json({ message: "Category deleted successfully", id });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete category" });
  }
}
