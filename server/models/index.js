import bcrypt from "bcryptjs";
import { UserModel } from "./User.js";
import { CategoryModel } from "./Category.js";
import { ProductModel } from "./Product.js";
import { OrderModel } from "./Order.js";
import { WishlistModel } from "./Wishlist.js";
import { CouponModel } from "./Coupon.js";
import { StockMovementModel } from "./StockMovement.js";
import { AuditLogModel } from "./AuditLog.js";
import { EmailRecordModel } from "./EmailRecord.js";
import { NotificationModel } from "./Notification.js";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_STOCK_MOVEMENTS,
  DELIVERY_OPTIONS,
  VALID_STATUS_TRANSITIONS
} from "../config/seedData.js";

export {
  UserModel,
  CategoryModel,
  ProductModel,
  OrderModel,
  WishlistModel,
  CouponModel,
  StockMovementModel,
  AuditLogModel,
  EmailRecordModel,
  NotificationModel
};

// In-Memory Fallback State Stores (used when MongoDB URI is absent or during tests)
export const memoryUsers = [
  {
    userId: 'admin-yassine',
    name: 'Yassine Kalthoum',
    email: 'yassinekalthoum94@gmail.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    status: 'active',
    createdAt: new Date(),
  },
  {
    userId: 'admin-1',
    name: 'Admin Aura',
    email: 'admin@auraboutique.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    status: 'active',
    createdAt: new Date(),
  },
  {
    userId: 'user-1',
    name: 'Elena Rostova',
    email: 'elena@example.com',
    passwordHash: bcrypt.hashSync('customer123', 10),
    role: 'customer',
    status: 'active',
    createdAt: new Date(),
  }
];

export const memoryCategories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
export const memoryProducts = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
export const memoryCoupons = JSON.parse(JSON.stringify(INITIAL_COUPONS));
export const memoryStockMovements = JSON.parse(JSON.stringify(INITIAL_STOCK_MOVEMENTS));
export const memoryWishlists = [
  {
    userEmail: 'elena@example.com',
    productIds: ['prod-1', 'prod-3'],
    updatedAt: new Date()
  }
];
export const memoryNotifications = [
  {
    notificationId: 'notif-seed-1',
    recipientEmail: 'admin@auraboutique.com',
    title: 'Low Stock Alert: Organic Cashmere Lounge Hoodie',
    message: 'Stock is currently 4 units (Threshold: 8 units)',
    type: 'INVENTORY_ALERT',
    isRead: false,
    createdAt: new Date()
  }
];

export const memoryOrders = [
  {
    orderId: 'AURA-849201',
    userEmail: 'elena@example.com',
    userId: 'user-1',
    customerName: 'Elena Rostova',
    items: [
      {
        productId: 'prod-1',
        name: 'Minimalist Ceramic Pour-Over Set',
        unitPrice: 68,
        price: 68,
        quantity: 1,
        selectedColor: 'Matte White',
        selectedSize: 'One Size',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        lineTotal: 68,
      },
      {
        productId: 'prod-3',
        name: 'Organic Cashmere Lounge Hoodie',
        unitPrice: 145,
        price: 145,
        quantity: 1,
        selectedColor: 'Oatmeal',
        selectedSize: 'M',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        lineTotal: 145,
      }
    ],
    subtotal: 213,
    discount: 21.3,
    promoCode: 'AURA10',
    deliveryOption: {
      id: 'standard',
      name: 'Standard Atelier Delivery',
      estimatedDays: '3-5 Business Days',
      price: 0
    },
    shippingFee: 0,
    total: 191.7,
    shippingAddress: {
      fullName: 'Elena Rostova',
      email: 'elena@example.com',
      address: '742 Evergreen Terrace',
      city: 'San Francisco',
      postalCode: '94107',
      country: 'United States',
    },
    payment: {
      status: 'Paid',
      method: 'Card (Visa •••• 4242)',
      last4: '4242',
      cardBrand: 'Visa',
      transactionRef: 'TXN-9023184',
    },
    status: 'Processing',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: '2026-08-20T10:15:00.000Z',
        note: 'Order created & payment authorized',
        updatedBy: 'System'
      },
      {
        status: 'Processing',
        timestamp: '2026-08-20T11:00:00.000Z',
        note: 'Sent to fulfillment atelier',
        updatedBy: 'Admin Aura'
      }
    ],
    correlationId: 'CORR-INIT-001',
    createdAt: 'Aug 20, 2026',
    updatedAt: 'Aug 20, 2026',
  }
];

export { DELIVERY_OPTIONS, VALID_STATUS_TRANSITIONS };
