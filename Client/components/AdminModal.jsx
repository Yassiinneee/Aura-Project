import React, { useState } from 'react';
import {
  X,
  Layers,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Info,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Tag,
  ShieldCheck,
  Mail,
  RefreshCw,
  UploadCloud,
  Sliders,
  Sparkles,
  BarChart3
} from 'lucide-react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetStockMovementsQuery,
  useGetLowStockQuery,
  useAdjustInventoryMutation,
  useGetAdminAnalyticsQuery,
  useGetAuditLogsQuery,
  useGetEmailLogsQuery,
  useRetryEmailMutation,
  useUploadImageMutation,
} from '../store/apiSlice.js';
import { handleImageError } from '../utils/imageFallback.js';

const STATUS_CONFIG = {
  Pending: { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock },
  Processing: { bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: Layers },
  Shipped: { bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: Truck },
  Delivered: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: PackageCheck },
  Cancelled: { bg: 'bg-rose-50 text-rose-800 border-rose-200', icon: XCircle },
};

const ALLOWED_TRANSITIONS = {
  Pending: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
}

export const AdminModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  // 'analytics' | 'products' | 'categories' | 'orders' | 'users' | 'inventory' | 'coupons' | 'audit' | 'emails'

  // 1. Analytics State (FEATURE-017)
  const [analyticsRange, setAnalyticsRange] = useState('30d');
  const { data: analytics } = useGetAdminAnalyticsQuery(analyticsRange, { skip: !isOpen });

  // 2. Categories State (FEATURE-003)
  const { data: categories = [], isLoading: loadingCategories } = useGetCategoriesQuery({ all: true }, { skip: !isOpen });
  const [createCategory, { isLoading: creatingCategory }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updatingCategory }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deletingCategory }] = useDeleteCategoryMutation();

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catFormData, setCatFormData] = useState({ name: '', slug: '', description: '', image: '', isActive: true });
  const [catFormError, setCatFormError] = useState('');

  // 3. Products State (FEATURE-006, FEATURE-018)
  const { data: products = [], isLoading: loadingProducts } = useGetProductsQuery({}, { skip: !isOpen });
  const [createProduct, { isLoading: creatingProduct }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updatingProduct }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deletingProduct }] = useDeleteProductMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodFormData, setProdFormData] = useState({
    name: '',
    category: 'Home & Living',
    price: 65,
    originalPrice: 80,
    stock: 25,
    lowStockThreshold: 5,
    sku: '',
    image: '',
    secondaryImage: '',
    description: '',
    features: '',
    colors: '',
    sizes: '',
  });
  const [prodFormError, setProdFormError] = useState('');

  // 4. Orders State (FEATURE-005, FEATURE-012)
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const { data: orders = [], isLoading: loadingOrders } = useGetAllOrdersQuery({
    status: orderStatusFilter,
    search: orderSearch,
  }, { skip: !isOpen });
  const [updateOrderStatus, { isLoading: updatingOrderStatus }] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [transitionNote, setTransitionNote] = useState('');
  const [statusActionError, setStatusActionError] = useState('');

  // 5. Users State (FEATURE-007)
  const { data: users = [], isLoading: loadingUsers } = useGetUsersQuery(undefined, { skip: !isOpen });
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();

  // 6. Inventory State (FEATURE-015)
  const { data: stockMovements = [] } = useGetStockMovementsQuery(undefined, { skip: !isOpen });
  const { data: lowStockItems = [] } = useGetLowStockQuery(undefined, { skip: !isOpen });
  const [adjustInventory, { isLoading: adjustingStock }] = useAdjustInventoryMutation();
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustChange, setAdjustChange] = useState(5);
  const [adjustReason, setAdjustReason] = useState('RESTOCK');

  // 7. Coupons State (FEATURE-016)
  const { data: coupons = [] } = useGetCouponsQuery(undefined, { skip: !isOpen });
  const [createCoupon, { isLoading: creatingCoupon }] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 50,
    maxUses: 100,
    expiresAt: '2027-12-31'
  });
  const [couponFormError, setCouponFormError] = useState('');

  // 8. Audit Logs (FEATURE-020)
  const { data: auditLogs = [] } = useGetAuditLogsQuery(undefined, { skip: !isOpen });

  // 9. Emails (FEATURE-019)
  const { data: emailLogs = [] } = useGetEmailLogsQuery(undefined, { skip: !isOpen });
  const [retryEmail, { isLoading: retryingEmail }] = useRetryEmailMutation();

  if (!isOpen) return null;

  // --- Handlers: Categories ---
  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setCatFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    });
    setCatFormError('');
    setIsCategoryFormOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCatFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive !== false,
    });
    setCatFormError('');
    setIsCategoryFormOpen(true);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setCatFormError('');
    if (!catFormData.name || catFormData.name.trim().length < 2) {
      setCatFormError('Category name must be at least 2 characters.');
      return;
    }
    const finalSlug = catFormData.slug.trim() ? slugify(catFormData.slug) : slugify(catFormData.name);

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.categoryId || editingCategory.id || editingCategory._id,
          name: catFormData.name.trim(),
          slug: finalSlug,
          description: catFormData.description.trim(),
          image: catFormData.image.trim(),
          isActive: catFormData.isActive,
        }).unwrap();
      } else {
        await createCategory({
          name: catFormData.name.trim(),
          slug: finalSlug,
          description: catFormData.description.trim(),
          image: catFormData.image.trim(),
          isActive: catFormData.isActive,
        }).unwrap();
      }
      setIsCategoryFormOpen(false);
    } catch (err) {
      setCatFormError(err?.data?.error || 'Failed to save category');
    }
  };

  // --- Handlers: Products (FEATURE-006 & FEATURE-018) ---
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProdFormData({
      name: '',
      category: categories[0]?.name || 'Home & Living',
      price: 95,
      originalPrice: '',
      stock: 20,
      lowStockThreshold: 5,
      sku: '',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      description: '',
      features: 'Handcrafted materials\nSeamless finish\nLimited production batch',
      colors: 'Charcoal, Matte White, Natural Walnut',
      sizes: 'Standard, Large',
    });
    setProdFormError('');
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      stock: prod.stock !== undefined ? prod.stock : 25,
      lowStockThreshold: prod.lowStockThreshold || 5,
      sku: prod.sku || '',
      image: prod.image,
      secondaryImage: prod.secondaryImage || '',
      description: prod.description,
      features: Array.isArray(prod.features) ? prod.features.join('\n') : (prod.features || ''),
      colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : (prod.colors || ''),
      sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : (prod.sizes || ''),
    });
    setProdFormError('');
    setIsProductFormOpen(true);
  };

  const handleImageFileChange = async (e, field = 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const uploadRes = await uploadImage({
          dataUrl: reader.result,
          filename: file.name,
          mimeType: file.type
        }).unwrap();

        setProdFormData(prev => ({ ...prev, [field]: uploadRes.url }));
      } catch (err) {
        setProdFormError(err?.data?.error || 'Failed to upload image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setProdFormError('');
    if (!prodFormData.name || !prodFormData.description || !prodFormData.image) {
      setProdFormError('Name, description, and primary image are required.');
      return;
    }

    try {
      const payload = {
        name: prodFormData.name.trim(),
        category: prodFormData.category,
        price: Number(prodFormData.price),
        originalPrice: prodFormData.originalPrice ? Number(prodFormData.originalPrice) : undefined,
        stock: Number(prodFormData.stock),
        lowStockThreshold: Number(prodFormData.lowStockThreshold),
        sku: prodFormData.sku.trim(),
        image: prodFormData.image.trim(),
        secondaryImage: prodFormData.secondaryImage.trim(),
        description: prodFormData.description.trim(),
        features: prodFormData.features.split('\n').filter(Boolean),
        colors: prodFormData.colors.split(',').map(s => s.trim()).filter(Boolean),
        sizes: prodFormData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingProduct) {
        await updateProduct({ id: editingProduct.id || editingProduct.productId, ...payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      setIsProductFormOpen(false);
    } catch (err) {
      setProdFormError(err?.data?.error || 'Failed to save product');
    }
  };

  // --- Handlers: Status Transitions (FEATURE-005, FEATURE-012) ---
  const handleTransitionStatus = async (nextStatus) => {
    if (!selectedOrder) return;
    setStatusActionError('');
    try {
      const updated = await updateOrderStatus({
        orderId: selectedOrder.orderId,
        status: nextStatus,
        note: transitionNote.trim() || undefined,
      }).unwrap();
      setSelectedOrder(updated);
      setTransitionNote('');
    } catch (err) {
      setStatusActionError(err?.data?.error || 'Failed to update order status');
    }
  };

  // --- Handlers: Coupons (FEATURE-016) ---
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponFormError('');
    try {
      await createCoupon(couponFormData).unwrap();
      setIsCouponFormOpen(false);
      setCouponFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 15,
        minOrderValue: 50,
        maxUses: 100,
        expiresAt: '2027-12-31'
      });
    } catch (err) {
      setCouponFormError(err?.data?.error || 'Failed to create coupon code');
    }
  };

  // --- Handlers: Inventory Adjustment (FEATURE-015) ---
  const handleAdjustInventorySubmit = async (e) => {
    e.preventDefault();
    if (!adjustTarget) return;
    try {
      await adjustInventory({
        productId: adjustTarget.id || adjustTarget.productId,
        change: Number(adjustChange),
        reason: adjustReason,
        referenceId: 'MANUAL_INVENTORY_ADJUST'
      }).unwrap();
      setIsAdjustModalOpen(false);
    } catch (err) {
      alert('Failed to adjust stock');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-7xl w-full h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-600 rounded-lg text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold">Aura Operations Console</h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-400/30">
                  ADMIN RBAC
                </span>
              </div>
              <p className="text-xs text-stone-400">Complete e-commerce & inventory lifecycle control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-stone-100/80 border-b border-stone-200 flex space-x-1 overflow-x-auto shrink-0 py-1">
          {[
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: ShoppingBag },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'inventory', label: 'Inventory', icon: Sliders },
            { id: 'coupons', label: 'Coupons', icon: Tag },
            { id: 'audit', label: 'Audit Logs', icon: ShieldAlert },
            { id: 'emails', label: 'Emails', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
                  active
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-800' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">

          {/* TAB 1: ANALYTICS (FEATURE-017) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Performance Metrics</h3>
                  <p className="text-xs text-stone-500">Authoritative revenue, order volume, and catalog statistics</p>
                </div>
                <div className="flex bg-white rounded-lg border border-stone-200 p-1 space-x-1 text-xs">
                  {['7d', '30d', 'ytd', 'all'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setAnalyticsRange(r)}
                      className={`px-3 py-1 rounded font-semibold uppercase ${
                        analyticsRange === r ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-stone-900">
                    ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">Settled card transactions</span>
                </div>

                <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-stone-900">{analytics?.totalOrders || 0}</div>
                  <span className="text-[11px] text-stone-500 font-medium">Recorded fulfillment requests</span>
                </div>

                <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Average Order Value</span>
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-stone-900">
                    ${analytics?.averageOrderValue?.toFixed(2) || '0.00'}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">Per checkout conversion</span>
                </div>

                <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Alerts</span>
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-2xl font-bold text-rose-700">{analytics?.lowStockCount || 0}</div>
                  <span className="text-[11px] text-rose-600 font-medium">Under restock threshold</span>
                </div>
              </div>

              {/* Order Status Distribution & Top Selling Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-4">
                    Orders by Fulfillment State
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(analytics?.ordersByStatus || {}).map(([st, cnt]) => (
                      <div key={st} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800">{st}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 font-mono font-bold text-stone-700">
                          {cnt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-4">
                    Top Selling Artisanal Pieces
                  </h4>
                  <div className="space-y-3">
                    {(analytics?.topProducts || []).map((tp, idx) => (
                      <div key={tp.id || tp.productId || tp.name || `tp-${idx}`} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-stone-800 truncate max-w-[240px]">{tp.name}</span>
                        <span className="font-bold text-amber-800">{tp.count} sold</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS (FEATURE-006 & FEATURE-018) */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Store Product Catalog</h3>
                  <p className="text-xs text-stone-500">Manage stock quantities, specifications, and imagery</p>
                </div>
                <button
                  onClick={handleOpenNewProduct}
                  className="px-4 py-2 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              {/* Product Form Modal / Section */}
              {isProductFormOpen && (
                <div className="p-6 bg-white rounded-xl border border-stone-300 shadow-lg space-y-4 mb-6">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {editingProduct ? 'Edit Catalog Product' : 'Create New Product'}
                    </h4>
                    <button onClick={() => setIsProductFormOpen(false)} className="text-stone-400 hover:text-stone-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {prodFormError && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                      {prodFormError}
                    </div>
                  )}

                  <form onSubmit={handleSubmitProduct} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Product Title</label>
                        <input
                          type="text"
                          value={prodFormData.name}
                          onChange={(e) => setProdFormData({ ...prodFormData, name: e.target.value })}
                          placeholder="e.g. Sculptural Ceramic Vase"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                        <select
                          value={prodFormData.category}
                          onChange={(e) => setProdFormData({ ...prodFormData, category: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        >
                          {categories.map((c, idx) => (
                            <option key={c.categoryId || c.id || c.slug || c._id || `cat-opt-${idx}`} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={prodFormData.price}
                          onChange={(e) => setProdFormData({ ...prodFormData, price: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Original Price ($)</label>
                        <input
                          type="number"
                          value={prodFormData.originalPrice}
                          onChange={(e) => setProdFormData({ ...prodFormData, originalPrice: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          value={prodFormData.stock}
                          onChange={(e) => setProdFormData({ ...prodFormData, stock: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Low Stock Limit</label>
                        <input
                          type="number"
                          value={prodFormData.lowStockThreshold}
                          onChange={(e) => setProdFormData({ ...prodFormData, lowStockThreshold: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* Image URL & Upload (FEATURE-018) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={prodFormData.image}
                            onChange={(e) => setProdFormData({ ...prodFormData, image: e.target.value })}
                            placeholder="Image URL or upload below"
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                            required
                          />
                          <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1 border border-stone-300">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFileChange(e, 'image')} />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Secondary Angle Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={prodFormData.secondaryImage}
                            onChange={(e) => setProdFormData({ ...prodFormData, secondaryImage: e.target.value })}
                            placeholder="Secondary Image URL"
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                          />
                          <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1 border border-stone-300">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFileChange(e, 'secondaryImage')} />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={prodFormData.description}
                        onChange={(e) => setProdFormData({ ...prodFormData, description: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Features (One per line)</label>
                        <textarea
                          rows={2}
                          value={prodFormData.features}
                          onChange={(e) => setProdFormData({ ...prodFormData, features: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Colors (Comma separated)</label>
                        <input
                          type="text"
                          value={prodFormData.colors}
                          onChange={(e) => setProdFormData({ ...prodFormData, colors: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Sizes (Comma separated)</label>
                        <input
                          type="text"
                          value={prodFormData.sizes}
                          onChange={(e) => setProdFormData({ ...prodFormData, sizes: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setIsProductFormOpen(false)}
                        className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={creatingProduct || updatingProduct}
                        className="px-6 py-2 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                      >
                        {creatingProduct || updatingProduct ? 'Saving...' : 'Save Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Rating</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {products.map((prod, idx) => (
                      <tr key={prod.productId || prod.id || prod._id || prod.sku || `prod-${idx}`} className="hover:bg-stone-50/70">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            onError={handleImageError}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                          />
                          <div>
                            <div className="font-bold text-stone-900">{prod.name}</div>
                            <div className="text-[11px] text-stone-400 font-mono">{prod.sku}</div>
                          </div>
                        </td>
                        <td className="p-3.5 text-stone-600">{prod.category}</td>
                        <td className="p-3.5 font-bold text-stone-900">${prod.price}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              (prod.stock || 0) <= (prod.lowStockThreshold || 5)
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {prod.stock || 0} units
                          </span>
                        </td>
                        <td className="p-3.5 text-amber-600 font-semibold">★ {prod.rating}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${prod.name}?`)) deleteProduct(prod.id || prod.productId);
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES (FEATURE-003) */}
          {activeTab === 'categories' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Category Catalog</h3>
                  <p className="text-xs text-stone-500">Define classification hierarchies and slugs</p>
                </div>
                <button
                  onClick={handleOpenNewCategory}
                  className="px-4 py-2 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>

              {isCategoryFormOpen && (
                <form onSubmit={handleSubmitCategory} className="p-5 bg-white rounded-xl border border-stone-300 shadow-md space-y-3">
                  <h4 className="font-bold text-sm text-stone-900">{editingCategory ? 'Edit Category' : 'New Category'}</h4>
                  {catFormError && <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded">{catFormError}</div>}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={catFormData.name}
                      onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={catFormData.image}
                      onChange={(e) => setCatFormData({ ...catFormData, image: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={catFormData.description}
                    onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsCategoryFormOpen(false)} className="px-3 py-1.5 text-xs text-stone-600">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold">Save</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat, idx) => (
                  <div key={cat.categoryId || cat.id || cat.slug || cat._id || `cat-card-${idx}`} className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs flex flex-col justify-between">
                    <div>
                      <img
                        src={cat.image}
                        alt={cat.name}
                        onError={handleImageError}
                        referrerPolicy="no-referrer"
                        className="w-full h-28 rounded-lg object-cover mb-3"
                      />
                      <h4 className="font-bold text-stone-900 text-sm">{cat.name}</h4>
                      <p className="text-[11px] text-stone-500 font-mono">{cat.slug}</p>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">{cat.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700">{cat.itemCount || 0} items</span>
                      <div className="space-x-1">
                        <button onClick={() => handleOpenEditCategory(cat)} className="p-1 text-stone-500 hover:text-stone-900"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteCategory(cat.categoryId || cat.id || cat._id)} className="p-1 text-stone-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & FULFILLMENT (FEATURE-005, FEATURE-012) */}
          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search order ID, email, or customer..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {orders.map((ord, idx) => {
                    const cfg = STATUS_CONFIG[ord.status] || STATUS_CONFIG.Pending;
                    const isSelected = selectedOrder?.orderId === ord.orderId;
                    return (
                      <div
                        key={ord.orderId || ord.id || ord._id || `ord-${idx}`}
                        onClick={() => setSelectedOrder(ord)}
                        className={`p-4 bg-white rounded-xl border cursor-pointer transition-all ${
                          isSelected ? 'border-stone-900 shadow-md ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-stone-900 text-sm">{ord.orderId}</span>
                            <p className="text-xs text-stone-500">{ord.userEmail}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.bg}`}>
                            {ord.status}
                          </span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-stone-100 flex justify-between text-xs">
                          <span className="text-stone-500">{ord.items?.length || 0} items</span>
                          <span className="font-bold text-stone-900">${ord.total?.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Detail & Transition Inspector */}
              <div className="lg:col-span-5">
                {selectedOrder ? (
                  <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                      <div>
                        <h4 className="font-bold text-stone-900 text-base">{selectedOrder.orderId}</h4>
                        <p className="text-xs text-stone-500">{selectedOrder.customerName}</p>
                      </div>
                      <span className="text-sm font-bold text-stone-900">${selectedOrder.total?.toFixed(2)}</span>
                    </div>

                    {statusActionError && (
                      <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
                        {statusActionError}
                      </div>
                    )}

                    {/* Status Transitions */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Advance Fulfillment Transition
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(ALLOWED_TRANSITIONS[selectedOrder.status] || []).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleTransitionStatus(st)}
                            disabled={updatingOrderStatus}
                            className="px-3 py-1.5 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                          >
                            Mark as {st}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Optional transition note..."
                        value={transitionNote}
                        onChange={(e) => setTransitionNote(e.target.value)}
                        className="mt-2 w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>

                    {/* Timeline History */}
                    <div>
                      <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        Audit Trail Timeline
                      </h5>
                      <div className="space-y-2">
                        {(selectedOrder.statusHistory || []).map((h, i) => (
                          <div key={h._id || h.id || `${h.status}-${h.timestamp || i}-${i}`} className="text-xs p-2 bg-stone-50 rounded-lg border border-stone-200">
                            <div className="flex justify-between font-bold text-stone-800">
                              <span>{h.status}</span>
                              <span className="text-[10px] text-stone-400">{new Date(h.timestamp).toLocaleString()}</span>
                            </div>
                            {h.note && <p className="text-stone-600 mt-0.5">{h.note}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center border border-dashed rounded-xl text-stone-400 text-xs">
                    Select an order to inspect and transition status
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: USERS & ROLES (FEATURE-007) */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">User Management</h3>
                <p className="text-xs text-stone-500">Manage account access, administrative roles, and account statuses</p>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Account Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {users.map((u, idx) => (
                      <tr key={u.userId || u.id || u._id || u.email || `usr-${idx}`} className="hover:bg-stone-50/70">
                        <td className="p-3.5 font-bold text-stone-900">{u.name}</td>
                        <td className="p-3.5 text-stone-600">{u.email}</td>
                        <td className="p-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole({ userId: u.userId || u.email, role: e.target.value })}
                            className="px-2 py-1 bg-stone-50 border border-stone-300 rounded text-xs font-bold"
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={u.status || 'active'}
                            onChange={(e) => updateUserStatus({ userId: u.userId || u.email, status: e.target.value })}
                            className={`px-2 py-1 border rounded text-xs font-bold ${
                              u.status === 'suspended' ? 'bg-amber-50 text-amber-800' :
                              u.status === 'disabled' ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="disabled">Disabled</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right text-stone-400 font-mono text-[11px]">
                          {u.userId || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: INVENTORY & STOCK MOVEMENTS (FEATURE-015) */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Inventory & Stock Movements</h3>
                  <p className="text-xs text-stone-500">Audit trail of stock deductions, restocks, and adjustments</p>
                </div>
              </div>

              {/* Low stock alerts banner */}
              {lowStockItems.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>Low Stock Warning: {lowStockItems.length} items need restock</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lowStockItems.map((item, idx) => (
                      <button
                        key={item.productId || item.id || item._id || item.sku || `low-${idx}`}
                        onClick={() => {
                          setAdjustTarget(item);
                          setAdjustChange(10);
                          setIsAdjustModalOpen(true);
                        }}
                        className="px-3 py-1 bg-white border border-rose-300 text-rose-800 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
                      >
                        Restock {item.name} ({item.stock} left)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Adjustment Modal */}
              {isAdjustModalOpen && adjustTarget && (
                <form onSubmit={handleAdjustInventorySubmit} className="p-5 bg-white rounded-xl border border-stone-300 shadow-md space-y-3">
                  <h4 className="font-bold text-sm text-stone-900">Adjust Inventory for {adjustTarget.name}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Stock Change (+ / -)</label>
                      <input
                        type="number"
                        value={adjustChange}
                        onChange={(e) => setAdjustChange(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Reason</label>
                      <select
                        value={adjustReason}
                        onChange={(e) => setAdjustReason(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      >
                        <option value="RESTOCK">RESTOCK</option>
                        <option value="MANUAL_ADJUST">MANUAL ADJUST</option>
                        <option value="RETURN">RETURN</option>
                        <option value="AUDIT_CORRECTION">AUDIT CORRECTION</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="px-3 py-1 text-xs">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold">Apply Adjustment</button>
                  </div>
                </form>
              )}

              {/* Stock Movements Log */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Change</th>
                      <th className="p-3.5">Reason</th>
                      <th className="p-3.5">Actor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {stockMovements.map((mov, idx) => (
                      <tr key={mov.movementId || mov._id || mov.id || `mov-${idx}`} className="hover:bg-stone-50/70">
                        <td className="p-3.5 text-stone-500">{new Date(mov.timestamp).toLocaleString()}</td>
                        <td className="p-3.5 font-bold text-stone-900">{mov.productName || mov.productId}</td>
                        <td className="p-3.5">
                          <span className={`font-bold ${mov.change > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {mov.change > 0 ? `+${mov.change}` : mov.change}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-stone-600">{mov.reason}</td>
                        <td className="p-3.5 text-stone-500">{mov.actor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: COUPONS (FEATURE-016) */}
          {activeTab === 'coupons' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Promotions & Coupons</h3>
                  <p className="text-xs text-stone-500">Manage promotional discount codes and usage limits</p>
                </div>
                <button
                  onClick={() => setIsCouponFormOpen(true)}
                  className="px-4 py-2 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Create Coupon
                </button>
              </div>

              {isCouponFormOpen && (
                <form onSubmit={handleCreateCoupon} className="p-5 bg-white rounded-xl border border-stone-300 shadow-md space-y-3">
                  <h4 className="font-bold text-sm text-stone-900">New Coupon Code</h4>
                  {couponFormError && <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded">{couponFormError}</div>}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. VIP20)"
                      value={couponFormData.code}
                      onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })}
                      className="px-3 py-2 border rounded-lg text-xs font-mono font-bold"
                      required
                    />
                    <select
                      value={couponFormData.discountType}
                      onChange={(e) => setCouponFormData({ ...couponFormData, discountType: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-xs font-bold"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Dollar ($)</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Discount Value"
                      value={couponFormData.discountValue}
                      onChange={(e) => setCouponFormData({ ...couponFormData, discountValue: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsCouponFormOpen(false)} className="px-3 py-1 text-xs">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold">Create</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((c, idx) => (
                  <div key={c.couponId || c.code || c._id || c.id || `coup-${idx}`} className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono font-bold text-sm bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                          {c.code}
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">Min spend: ${c.minOrderValue || 0}</p>
                      <p className="text-xs text-stone-500">Used: {c.usedCount} / {c.maxUses}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-100 flex justify-end">
                      <button onClick={() => deleteCoupon(c.couponId || c.code)} className="text-xs text-rose-600 hover:underline">
                        Deactivate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT LOGS (FEATURE-020) */}
          {activeTab === 'audit' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">Security & Privileged Audit Trail</h3>
                <p className="text-xs text-stone-500">Cryptographically correlated logs of all administrative mutations</p>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Actor</th>
                      <th className="p-3.5">Action</th>
                      <th className="p-3.5">Resource</th>
                      <th className="p-3.5">Correlation ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-mono text-[11px]">
                    {auditLogs.map((log, idx) => (
                      <tr key={log.logId || log._id || log.id || `log-${idx}`} className="hover:bg-stone-50/70">
                        <td className="p-3.5 text-stone-500">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-3.5 text-stone-900 font-sans font-medium">{log.actorEmail}</td>
                        <td className="p-3.5 font-bold text-amber-800">{log.action}</td>
                        <td className="p-3.5 text-stone-600">{log.targetResource} ({log.targetId || '-'})</td>
                        <td className="p-3.5 text-stone-400 truncate max-w-[140px]">{log.correlationId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: EMAILS (FEATURE-019) */}
          {activeTab === 'emails' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">Email Notification Records</h3>
                <p className="text-xs text-stone-500">Retryable delivery records for order confirmations and dispatch updates</p>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Sent At</th>
                      <th className="p-3.5">Recipient</th>
                      <th className="p-3.5">Subject / Template</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {emailLogs.map((em, idx) => (
                      <tr key={em.emailId || em._id || em.id || `em-${idx}`} className="hover:bg-stone-50/70">
                        <td className="p-3.5 text-stone-500">{new Date(em.sentAt).toLocaleString()}</td>
                        <td className="p-3.5 font-bold text-stone-900">{em.to}</td>
                        <td className="p-3.5">
                          <div className="font-medium text-stone-800">{em.subject}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{em.template}</div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            em.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {em.status} ({em.attempts} try)
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => retryEmail(em.emailId)}
                            className="text-xs font-bold text-amber-800 hover:underline"
                          >
                            Retry
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
