import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware that extracts express-validator errors and returns a 400 Bad Request
 * with a standardized response format if validation fails.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    return res.status(400).json({
      error: errorArray[0].msg,
      errors: errorArray.map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      })),
      correlationId: req.correlationId,
    });
  }
  next();
};

/**
 * User Registration Validation
 */
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'customer']).withMessage('Role must be either admin or customer'),
  handleValidationErrors,
];

/**
 * User Login Validation
 */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

/**
 * Category Creation / Update Validation
 */
export const validateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 80 }).withMessage('Category name must be between 2 and 80 characters'),
  body('slug')
    .optional()
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('image')
    .optional()
    .trim(),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean value'),
  handleValidationErrors,
];

/**
 * Product Creation Validation
 */
export const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 150 }).withMessage('Product name must be between 2 and 150 characters'),
  body('category')
    .trim()
    .notEmpty().withMessage('Product category is required'),
  body('price')
    .notEmpty().withMessage('Product price is required')
    .isFloat({ min: 0.01 }).withMessage('Price must be a positive number greater than 0'),
  body('originalPrice')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0.01 }).withMessage('Original price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock quantity must be an integer >= 0'),
  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 }).withMessage('Low stock threshold must be an integer >= 0'),
  body('description')
    .trim()
    .notEmpty().withMessage('Product description is required')
    .isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
  body('image')
    .trim()
    .notEmpty().withMessage('Primary product image URL is required'),
  body('secondaryImage')
    .optional()
    .trim(),
  handleValidationErrors,
];

/**
 * Product Update Validation
 */
export const validateProductUpdate = [
  param('id')
    .trim()
    .notEmpty().withMessage('Product ID is required in URL path'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 }).withMessage('Product name must be between 2 and 150 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('originalPrice')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0.01 }).withMessage('Original price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be an integer >= 0'),
  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 }).withMessage('Low stock threshold must be an integer >= 0'),
  handleValidationErrors,
];

/**
 * Product Review Submission Validation
 */
export const validateReview = [
  param('productId')
    .trim()
    .notEmpty().withMessage('Product ID is required'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5 stars'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Review comment is required')
    .isLength({ min: 3, max: 2000 }).withMessage('Review comment must be between 3 and 2000 characters'),
  body('author')
    .optional()
    .trim(),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address'),
  handleValidationErrors,
];

/**
 * Order Placement Validation
 */
export const validateOrder = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('shippingAddress')
    .isObject().withMessage('Shipping address object is required'),
  body('shippingAddress.fullName')
    .trim()
    .notEmpty().withMessage('Full name is required for shipping address'),
  body('shippingAddress.email')
    .trim()
    .notEmpty().withMessage('Email address is required for shipping updates')
    .isEmail().withMessage('Please provide a valid shipping contact email'),
  body('shippingAddress.address')
    .trim()
    .notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode')
    .trim()
    .notEmpty().withMessage('Postal or ZIP code is required'),
  body('deliveryOptionId')
    .optional()
    .trim(),
  body('promoCode')
    .optional()
    .trim(),
  handleValidationErrors,
];

/**
 * Coupon Creation Validation
 */
export const validateCoupon = [
  body('code')
    .trim()
    .notEmpty().withMessage('Coupon promo code is required')
    .isLength({ min: 2, max: 30 }).withMessage('Coupon code must be between 2 and 30 characters'),
  body('discountValue')
    .notEmpty().withMessage('Discount value is required')
    .isFloat({ min: 0.01 }).withMessage('Discount value must be greater than 0'),
  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed']).withMessage('Discount type must be percentage or fixed'),
  body('minOrderValue')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum order value must be >= 0'),
  body('maxUses')
    .optional()
    .isInt({ min: 1 }).withMessage('Maximum uses must be an integer >= 1'),
  handleValidationErrors,
];

/**
 * Coupon Validation Request
 */
export const validateCouponCheck = [
  body('code')
    .trim()
    .notEmpty().withMessage('Promo code is required'),
  body('subtotal')
    .optional()
    .isFloat({ min: 0 }).withMessage('Subtotal must be a positive number >= 0'),
  handleValidationErrors,
];

/**
 * Inventory Adjustment Validation
 */
export const validateInventoryAdjust = [
  body('productId')
    .trim()
    .notEmpty().withMessage('Product ID is required'),
  body('change')
    .notEmpty().withMessage('Stock change amount is required')
    .isInt().withMessage('Stock change amount must be a valid integer'),
  body('reason')
    .optional()
    .trim(),
  handleValidationErrors,
];

/**
 * User Role Update Validation
 */
export const validateUserRole = [
  param('userId')
    .trim()
    .notEmpty().withMessage('User ID is required in URL path'),
  body('role')
    .trim()
    .notEmpty().withMessage('User role is required')
    .isIn(['admin', 'customer']).withMessage('Role must be either admin or customer'),
  handleValidationErrors,
];

/**
 * User Status Update Validation
 */
export const validateUserStatus = [
  param('userId')
    .trim()
    .notEmpty().withMessage('User ID is required in URL path'),
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['active', 'suspended', 'disabled']).withMessage('Status must be active, suspended, or disabled'),
  handleValidationErrors,
];

/**
 * Order Status Transition Validation
 */
export const validateOrderStatus = [
  param('orderId')
    .trim()
    .notEmpty().withMessage('Order ID is required in URL path'),
  body('status')
    .trim()
    .notEmpty().withMessage('New order status is required')
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).withMessage('Invalid order status specified'),
  body('note')
    .optional()
    .trim(),
  handleValidationErrors,
];

/**
 * AI Concierge Chat Validation
 */
export const validateAiChat = [
  body('message')
    .trim()
    .notEmpty().withMessage('A prompt message is required')
    .isLength({ max: 3000 }).withMessage('Message exceeds maximum 3000 characters limit'),
  body('contextProducts')
    .optional()
    .isArray().withMessage('contextProducts must be an array of products'),
  handleValidationErrors,
];

/**
 * Image Upload Validation
 */
export const validateUpload = [
  body('dataUrl')
    .trim()
    .notEmpty().withMessage('Image data URL is required'),
  body('filename')
    .optional()
    .trim(),
  body('mimeType')
    .optional()
    .trim(),
  handleValidationErrors,
];
