export const INITIAL_CATEGORIES = [
  {
    categoryId: 'cat-1',
    name: 'Home & Living',
    slug: 'home-and-living',
    description: 'Handcrafted porcelain, stoneware, French flax textiles, and sculptural decor essentials.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    itemCount: 5,
  },
  {
    categoryId: 'cat-2',
    name: 'Tech & Audio',
    slug: 'tech-and-audio',
    description: 'Acoustic engineering encased in sustainable timber, mechanical tactile switches, and brushed alloy.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    itemCount: 2,
  },
  {
    categoryId: 'cat-3',
    name: 'Apparel',
    slug: 'apparel',
    description: 'Mongolian cashmere, organic ringspun cotton, and relaxed timeless silhouettes.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    itemCount: 1,
  },
  {
    categoryId: 'cat-4',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Full-grain Tuscan leather goods, heirloom accessories, and everyday carry essentials.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    itemCount: 1,
  },
];

export const INITIAL_PRODUCTS = [
  {
    productId: 'prod-1',
    sku: 'AURA-HL-001',
    name: 'Minimalist Ceramic Pour-Over Set',
    category: 'Home & Living',
    categorySlug: 'home-and-living',
    price: 68,
    originalPrice: 85,
    stock: 45,
    lowStockThreshold: 10,
    rating: 4.9,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted from matte porcelain with a natural walnut wood collar, this pour-over set delivers a clean, sediment-free brew while elevating your kitchen aesthetic.',
    features: [
      'Heat-resistant borosilicate glass carafe',
      'Reusable stainless steel mesh micro-filter',
      'Ergonomic, heat-insulated walnut wood grip',
      'Dishwasher safe (carafe and dripper)'
    ],
    colors: ['Matte White', 'Charcoal Black', 'Sage Green'],
    sizes: ['One Size'],
    inStock: true,
    isBestSeller: true,
    reviews: [
      { id: 'rev-1', author: 'Elena Rostova', email: 'elena.r@example.com', rating: 5, date: '2 days ago', comment: 'Absolute masterpiece on my kitchen counter. Brews the smoothest morning coffee.', isVerifiedPurchase: true, isApproved: true },
      { id: 'rev-2', author: 'Marcus Chen', email: 'marcus.c@example.com', rating: 5, date: '1 week ago', comment: 'The walnut collar feels incredible and prevents any burns. Worth every penny.', isVerifiedPurchase: true, isApproved: true }
    ]
  },
  {
    productId: 'prod-2',
    sku: 'AURA-TA-002',
    name: 'Acoustic Wood Wireless Speaker',
    category: 'Tech & Audio',
    categorySlug: 'tech-and-audio',
    price: 195,
    originalPrice: 220,
    stock: 18,
    lowStockThreshold: 5,
    rating: 4.8,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A harmonious blend of acoustic engineering and sustainable timber. Delivers rich, room-filling sound with deep bass and crystal-clear highs.',
    features: [
      'Hand-crafted solid walnut and ash casing',
      'Bluetooth 5.3 with lossless aptX audio codec',
      '24-hour battery life on a single charge',
      'USB-C fast charging and auxiliary input'
    ],
    colors: ['Natural Walnut', 'Light Ash', 'Ebonized Oak'],
    sizes: ['Standard'],
    inStock: true,
    isNewItem: true,
    reviews: [
      { id: 'rev-3', author: 'Sarah Jenkins', email: 'sarah.j@example.com', rating: 5, date: '3 days ago', comment: 'Sound quality is breathtaking and it looks like a piece of modern art.', isVerifiedPurchase: true, isApproved: true }
    ]
  },
  {
    productId: 'prod-3',
    sku: 'AURA-AP-003',
    name: 'Organic Cashmere Lounge Hoodie',
    category: 'Apparel',
    categorySlug: 'apparel',
    price: 145,
    originalPrice: 180,
    stock: 4,
    lowStockThreshold: 8,
    rating: 4.9,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Spun from 100% Grade-A Mongolian cashmere. Lightweight yet exceptionally warm, designed with a relaxed tailored drape for everyday comfort.',
    features: [
      '100% sustainably sourced pure Mongolian cashmere',
      'Double-layered hood with seamless drawstring',
      'Ribbed cuffs and hem for shape retention',
      'Breathable, temperature-regulating fiber'
    ],
    colors: ['Oatmeal', 'Midnight Heather', 'Dusty Rose'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    isBestSeller: true,
    reviews: [
      { id: 'rev-4', author: 'David K.', email: 'david.k@example.com', rating: 5, date: '5 days ago', comment: 'Hands down the softest garment I own. Will order another color.', isVerifiedPurchase: true, isApproved: true }
    ]
  },
  {
    productId: 'prod-4',
    sku: 'AURA-HL-004',
    name: 'Architectural Brass Desk Lamp',
    category: 'Home & Living',
    categorySlug: 'home-and-living',
    price: 120,
    originalPrice: 150,
    stock: 30,
    lowStockThreshold: 5,
    rating: 4.7,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534349762230-10cadf05cf8e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Precision-machined brushed solid brass featuring seamless dual-axis rotation and warm 2700K integrated dimmable LED ambiance.',
    features: [
      'Solid spun brass and cast iron weighted base',
      'Stepless touch-sensitive dimmer control',
      '90+ CRI LED for accurate natural color rendering',
      'Integrated braided fabric power cord'
    ],
    colors: ['Brushed Brass', 'Matte Black Alloy', 'Aged Bronze'],
    sizes: ['Standard'],
    inStock: true,
    reviews: [
      { id: 'rev-5', author: 'Chloe Martin', email: 'chloe.m@example.com', rating: 4, date: '2 weeks ago', comment: 'Stunning design and the warm dimmer is great for late night reading.', isVerifiedPurchase: true, isApproved: true }
    ]
  },
  {
    productId: 'prod-5',
    sku: 'AURA-LS-005',
    name: 'Hand-Stitched Tuscan Leather Folio',
    category: 'Lifestyle',
    categorySlug: 'lifestyle',
    price: 88,
    stock: 22,
    lowStockThreshold: 6,
    rating: 5.0,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Vegetable-tanned full-grain leather that patinas beautifully over time. Holds laptops up to 14 inches, notebooks, and writing instruments.',
    features: [
      'Full-grain Italian vegetable-tanned leather',
      'Hand-saddle stitched with waxed linen thread',
      'Includes dedicated passport & pen slots',
      'Solid brass snap closure'
    ],
    colors: ['Caramel Tan', 'Espresso Brown', 'Forest Green'],
    sizes: ['13-14 inch', '15-16 inch'],
    inStock: true,
    reviews: [
      { id: 'rev-6', author: 'Julian Ray', email: 'julian.r@example.com', rating: 5, date: '3 weeks ago', comment: 'Smells like high grade Italian leather and fits my MacBook Pro like a glove.', isVerifiedPurchase: true, isApproved: true }
    ]
  },
  {
    productId: 'prod-6',
    sku: 'AURA-TA-006',
    name: 'Precision Mechanical Keyboard',
    category: 'Tech & Audio',
    categorySlug: 'tech-and-audio',
    price: 165,
    originalPrice: 190,
    stock: 12,
    lowStockThreshold: 4,
    rating: 4.9,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Custom lubed linear tactile switches enclosed in CNC-milled aluminum chassis with dye-sublimated PBT keycaps.',
    features: [
      'CNC anodized aluminum body with gasket mount',
      'Hot-swappable PCB supporting 3-pin and 5-pin switches',
      'Tri-mode connectivity: Bluetooth 5.1, 2.4GHz, USB-C',
      'Custom sound-dampening silicone foam'
    ],
    colors: ['Lunar White', 'Space Grey', 'Sandstone'],
    sizes: ['75% Compact', '80% TKL'],
    inStock: true,
    reviews: []
  },
  {
    productId: 'prod-7',
    sku: 'AURA-HL-007',
    name: 'French Stoneware Serving Bowl',
    category: 'Home & Living',
    categorySlug: 'home-and-living',
    price: 52,
    stock: 19,
    lowStockThreshold: 5,
    rating: 4.8,
    reviewCount: 37,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hand-thrown durable stoneware with a reactive organic glaze. Each piece is entirely unique in finish and texture.',
    features: [
      'High-fired organic natural clay stoneware',
      'Scratch-resistant matte mineral glaze',
      'Microwave, oven, and dishwasher safe',
      'Generous 2.5-quart serving capacity'
    ],
    colors: ['Terracotta', 'Sand Dunes', 'Earthy Ochre'],
    sizes: ['Large (10.5")', 'Medium (8.5")'],
    inStock: true,
    reviews: []
  },
  {
    productId: 'prod-8',
    sku: 'AURA-HL-008',
    name: 'Botanical Linen Duvet Cover Set',
    category: 'Home & Living',
    categorySlug: 'home-and-living',
    price: 190,
    originalPrice: 230,
    stock: 15,
    lowStockThreshold: 4,
    rating: 4.9,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Woven from 100% French flax linen, stonewashed for supreme softness. Naturally breathable to keep you cool in summer and cozy in winter.',
    features: [
      '100% French flax linen grown without artificial irrigation',
      'Stonewashed for lived-in softness from night one',
      'Internal corner ties and concealed coconut shell buttons',
      'Includes duvet cover and two matching pillow shams'
    ],
    colors: ['Flax Natural', 'Olive Branch', 'Charcoal', 'Washed White'],
    sizes: ['Full / Queen', 'King / California King'],
    inStock: true,
    reviews: []
  },
  {
    productId: 'prod-9',
    sku: 'AURA-HL-009',
    name: 'Matte Ceramic Plant Vessel',
    category: 'Home & Living',
    categorySlug: 'home-and-living',
    price: 45,
    stock: 28,
    lowStockThreshold: 5,
    rating: 4.6,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sculptural terracotta planter finished in a tactile matte glaze with an integrated drainage dish for healthy houseplants.',
    features: [
      'High-fired durable terracotta clay',
      'Removable catch saucer protects tabletops',
      'Minimalist ribbed textural pattern',
      'Ideal for succulents, monsteras, and herbs'
    ],
    colors: ['Matte White', 'Terracotta Clay', 'Warm Stone'],
    sizes: ['Medium', 'Large'],
    inStock: true,
    reviews: []
  }
];

export const INITIAL_COUPONS = [
  {
    couponId: 'coup-1',
    code: 'AURA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 50,
    maxUses: 500,
    usedCount: 38,
    expiresAt: '2027-12-31',
    isActive: true
  },
  {
    couponId: 'coup-2',
    code: 'WELCOME25',
    discountType: 'percentage',
    discountValue: 25,
    minOrderValue: 100,
    maxUses: 100,
    usedCount: 14,
    expiresAt: '2027-12-31',
    isActive: true
  },
  {
    couponId: 'coup-3',
    code: 'LUXE50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 200,
    maxUses: 50,
    usedCount: 9,
    expiresAt: '2027-12-31',
    isActive: true
  }
];

export const INITIAL_STOCK_MOVEMENTS = [
  {
    movementId: 'mov-1',
    productId: 'prod-1',
    productName: 'Minimalist Ceramic Pour-Over Set',
    change: 50,
    previousStock: 0,
    newStock: 50,
    reason: 'RESTOCK',
    referenceId: 'PO-2026-001',
    actor: 'Admin Aura',
    timestamp: new Date(Date.now() - 86400000 * 5)
  },
  {
    movementId: 'mov-2',
    productId: 'prod-3',
    productName: 'Organic Cashmere Lounge Hoodie',
    change: -1,
    previousStock: 5,
    newStock: 4,
    reason: 'ORDER_DEDUCT',
    referenceId: 'AURA-849201',
    actor: 'Order Checkout',
    timestamp: new Date(Date.now() - 86400000 * 2)
  }
];

export const DELIVERY_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Atelier Delivery',
    estimatedDays: '3-5 Business Days',
    price: 0,
    threshold: 100
  },
  {
    id: 'express',
    name: 'Express Courier Air',
    estimatedDays: '2 Business Days',
    price: 25,
    threshold: 0
  },
  {
    id: 'priority',
    name: 'White Glove Signature Delivery',
    estimatedDays: 'Next Business Day',
    price: 45,
    threshold: 0
  }
];

export const VALID_STATUS_TRANSITIONS = {
  'Pending': ['Processing', 'Cancelled'],
  'Processing': ['Shipped', 'Cancelled'],
  'Shipped': ['Delivered'],
  'Delivered': [],
  'Cancelled': []
};
