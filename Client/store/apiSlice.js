import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_ROOT = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') + '/api'
  : '/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROOT,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('aura_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Category',
    'Product',
    'Order',
    'User',
    'Wishlist',
    'Review',
    'Coupon',
    'Inventory',
    'Notification',
    'AuditLog',
    'EmailLog',
    'Analytics'
  ],
  endpoints: (builder) => ({
    // Categories (FEATURE-003)
    getCategories: builder.query({
      query: (params) => {
        const queryStr = params?.all ? '?all=true' : '';
        return `/categories${queryStr}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category', id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }, { type: 'Product', id: 'LIST' }, { type: 'AuditLog', id: 'LIST' }],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: categoryData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
        { type: 'Product', id: 'LIST' },
        { type: 'AuditLog', id: 'LIST' }
      ],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }, { type: 'Product', id: 'LIST' }, { type: 'AuditLog', id: 'LIST' }],
    }),

    // Products (FEATURE-006 & FEATURE-008)
    getProducts: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category && params.category !== 'All') {
          queryParams.set('category', params.category);
        }
        if (params?.categorySlug && params.categorySlug !== 'all') {
          queryParams.set('categorySlug', params.categorySlug);
        }
        if (params?.search) {
          queryParams.set('search', params.search);
        }
        if (params?.minPrice !== undefined && params?.minPrice !== '') {
          queryParams.set('minPrice', params.minPrice);
        }
        if (params?.maxPrice !== undefined && params?.maxPrice !== '') {
          queryParams.set('maxPrice', params.maxPrice);
        }
        if (params?.rating !== undefined && params?.rating !== '') {
          queryParams.set('rating', params.rating);
        }
        if (params?.inStockOnly) {
          queryParams.set('inStockOnly', 'true');
        }
        if (params?.sort) {
          queryParams.set('sort', params.sort);
        }
        const qs = queryParams.toString();
        return `/products${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: [
        { type: 'Product', id: 'LIST' },
        { type: 'Category', id: 'LIST' },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Analytics', id: 'LIST' },
        { type: 'AuditLog', id: 'LIST' }
      ],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Inventory', id: 'LIST' },
        { type: 'AuditLog', id: 'LIST' }
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Product', id: 'LIST' },
        { type: 'Category', id: 'LIST' },
        { type: 'AuditLog', id: 'LIST' }
      ],
    }),

    // User Management (FEATURE-007)
    getUsers: builder.query({
      query: () => '/users',
      providesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, { type: 'AuditLog', id: 'LIST' }],
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, { type: 'AuditLog', id: 'LIST' }],
    }),

    // Checkout & Orders (FEATURE-009, FEATURE-010, FEATURE-012)
    getDeliveryOptions: builder.query({
      query: () => '/delivery-options',
    }),
    getOrders: builder.query({
      query: (email) => {
        const queryStr = email ? `?email=${encodeURIComponent(email)}` : '';
        return `/orders${queryStr}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order', id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getAllOrders: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== 'All') {
          queryParams.set('status', params.status);
        }
        if (params?.search) {
          queryParams.set('search', params.search);
        }
        const qs = queryParams.toString();
        return `/orders/all${qs ? `?${qs}` : ''}`;
      },
      providesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [
        { type: 'Order', id: 'LIST' },
        { type: 'Product', id: 'LIST' },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Notification', id: 'LIST' },
        { type: 'Analytics', id: 'LIST' }
      ],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, note }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status, note },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
        { type: 'Notification', id: 'LIST' },
        { type: 'Analytics', id: 'LIST' },
        { type: 'AuditLog', id: 'LIST' }
      ],
    }),

    // Wishlist (FEATURE-013)
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),

    // Reviews & Ratings (FEATURE-014)
    getProductReviews: builder.query({
      query: (productId) => `/products/${productId}/reviews`,
      providesTags: (result, error, productId) => [{ type: 'Review', id: productId }],
    }),
    createReview: builder.mutation({
      query: ({ productId, ...reviewData }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: productId },
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' }
      ],
    }),

    // Discount / Coupons (FEATURE-016)
    getCoupons: builder.query({
      query: () => '/coupons',
      providesTags: [{ type: 'Coupon', id: 'LIST' }],
    }),
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: '/coupons',
        method: 'POST',
        body: couponData,
      }),
      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }, { type: 'AuditLog', id: 'LIST' }],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }, { type: 'AuditLog', id: 'LIST' }],
    }),
    validateCoupon: builder.mutation({
      query: ({ code, subtotal }) => ({
        url: '/coupons/validate',
        method: 'POST',
        body: { code, subtotal },
      }),
    }),

    // Inventory & Stock (FEATURE-015)
    getStockMovements: builder.query({
      query: () => '/inventory/stock-movements',
      providesTags: [{ type: 'Inventory', id: 'LIST' }],
    }),
    getLowStock: builder.query({
      query: () => '/inventory/low-stock',
      providesTags: [{ type: 'Inventory', id: 'LIST' }],
    }),
    adjustInventory: builder.mutation({
      query: (data) => ({
        url: '/inventory/adjust',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Inventory', id: 'LIST' },
        { type: 'Product', id: 'LIST' },
        { type: 'AuditLog', id: 'LIST' }
      ],
    }),

    // Analytics (FEATURE-017)
    getAdminAnalytics: builder.query({
      query: (range = '30d') => `/admin/analytics?range=${range}`,
      providesTags: [{ type: 'Analytics', id: 'LIST' }],
    }),

    // Image Upload (FEATURE-018)
    uploadImage: builder.mutation({
      query: (uploadData) => ({
        url: '/upload',
        method: 'POST',
        body: uploadData,
      }),
    }),

    // Real-Time Notifications (FEATURE-011)
    getNotifications: builder.query({
      query: (email) => {
        const q = email ? `?email=${encodeURIComponent(email)}` : '';
        return `/notifications${q}`;
      },
      providesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
    clearAllNotifications: builder.mutation({
      query: (email) => ({
        url: '/notifications/clear-all',
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    // Audit Logs (FEATURE-020)
    getAuditLogs: builder.query({
      query: () => '/admin/audit-logs',
      providesTags: [{ type: 'AuditLog', id: 'LIST' }],
    }),

    // Emails (FEATURE-019)
    getEmailLogs: builder.query({
      query: () => '/admin/emails',
      providesTags: [{ type: 'EmailLog', id: 'LIST' }],
    }),
    retryEmail: builder.mutation({
      query: (id) => ({
        url: `/admin/emails/${id}/retry`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'EmailLog', id: 'LIST' }],
    }),
  }),
});

export const {
  // Categories
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  // Products
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  // Users
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  // Checkout & Orders
  useGetDeliveryOptionsQuery,
  useGetOrdersQuery,
  useGetAllOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  // Wishlist
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  // Reviews
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  // Coupons
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
  // Inventory
  useGetStockMovementsQuery,
  useGetLowStockQuery,
  useAdjustInventoryMutation,
  // Analytics
  useGetAdminAnalyticsQuery,
  // Upload
  useUploadImageMutation,
  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useClearAllNotificationsMutation,
  // Audit Logs
  useGetAuditLogsQuery,
  // Emails
  useGetEmailLogsQuery,
  useRetryEmailMutation,
} = apiSlice;
