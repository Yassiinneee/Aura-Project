import rateLimit from 'express-rate-limit';

// Standard rate limiter for general API routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1500, // Limit each IP to 1500 requests per 15-minute window
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* legacy headers
  validate: { xForwardedForHeader: false, forwardedHeader: false },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP. Please try again after 15 minutes.',
      retryAfter: '15m',
      correlationId: req.correlationId
    });
  }
});

// Stricter rate limiter for authentication routes (login / register) to prevent brute-force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Max 150 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, forwardedHeader: false },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts. For security reasons, please try again in 15 minutes.',
      retryAfter: '15m',
      correlationId: req.correlationId
    });
  }
});

// AI Concierge Chat rate limiter to protect Gemini model quotas
export const aiChatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 25, // 25 queries per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, forwardedHeader: false },
  handler: (req, res) => {
    res.status(429).json({
      error: 'AI concierge request limit reached. Please wait a moment before asking another question.',
      retryAfter: '1m',
      correlationId: req.correlationId
    });
  }
});

// Order placement rate limiter
export const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 orders per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, forwardedHeader: false },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Order checkout limit reached. Please wait a few moments before placing another order.',
      retryAfter: '15m',
      correlationId: req.correlationId
    });
  }
});

// Product review submission rate limiter
export const reviewLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 reviews per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, forwardedHeader: false },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Review submission limit reached. Please wait before submitting another review.',
      retryAfter: '10m',
      correlationId: req.correlationId
    });
  }
});

// Image upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 image uploads per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, forwardedHeader: false },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Image upload limit exceeded. Please try again after a few minutes.',
      retryAfter: '15m',
      correlationId: req.correlationId
    });
  }
});
