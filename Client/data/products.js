export const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Minimalist Ceramic Pour-Over Set',
    category: 'Home & Living',
    price: 68,
    originalPrice: 85,
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
      { id: 'rev-1', author: 'Elena Rostova', rating: 5, date: '2 days ago', comment: 'Absolute masterpiece on my kitchen counter. Brews the smoothest morning coffee.' },
      { id: 'rev-2', author: 'Marcus Chen', rating: 5, date: '1 week ago', comment: 'The walnut collar feels incredible and prevents any burns. Worth every penny.' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Acoustic Wood Wireless Speaker',
    category: 'Tech & Audio',
    price: 195,
    originalPrice: 220,
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
    isNew: true,
    reviews: [
      { id: 'rev-3', author: 'Sarah Jenkins', rating: 5, date: '3 days ago', comment: 'Sound quality is breathtaking and it looks like a piece of modern art.' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Organic Cashmere Lounge Hoodie',
    category: 'Apparel',
    price: 145,
    originalPrice: 180,
    rating: 4.9,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Spun from the finest Mongolian cashmere, this relaxed-fit hoodie offers unmatched softness, warmth, and effortless everyday luxury.',
    features: [
      '100% Grade-A Mongolian cashmere (2-ply)',
      'Relaxed drop-shoulder silhouette',
      'Ribbed cuffs and hem for shape retention',
      'Responsibly sourced and ethically certified'
    ],
    colors: ['Oatmeal', 'Midnight Heather', 'Dusty Rose'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    isBestSeller: true,
    reviews: [
      { id: 'rev-4', author: 'Liam Vance', rating: 5, date: 'Yesterday', comment: 'The softest fabric I have ever worn. I never want to take it off.' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Architectural Brass Desk Lamp',
    category: 'Home & Living',
    price: 120,
    originalPrice: 150,
    rating: 4.7,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534349762230-10cadf05cf8e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Inspired by mid-century industrial design, featuring brushed solid brass construction and an adjustable arm for precision task lighting.',
    features: [
      'Brushed solid brass with protective lacquer',
      'Dimmable touch sensor switch on base',
      'Energy-efficient integrated warm LED bulb',
      'Weighted base with felt scratch protection'
    ],
    colors: ['Brushed Brass', 'Matte Black', 'Polished Chrome'],
    sizes: ['Standard'],
    inStock: true,
    reviews: [
      { id: 'rev-5', author: 'David K.', rating: 4, date: '2 weeks ago', comment: 'Stunning accent light for my home office desk.' }
    ]
  },
  {
    id: 'prod-5',
    name: 'Hand-Stitched Tuscan Leather Folio',
    category: 'Lifestyle',
    price: 88,
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
      'Solid brass hardware and YKK Excella zippers',
      'Water-resistant canvas interior lining',
      'Includes detachable padded shoulder strap'
    ],
    colors: ['Cognac Brown', 'Espresso', 'Slate Black'],
    sizes: ['13-14 inch', '15-16 inch'],
    inStock: true,
    isBestSeller: true,
    reviews: [
      { id: 'rev-6', author: 'Claire Dupont', rating: 5, date: '3 weeks ago', comment: 'Took this on a 4-day trip to Paris. Received countless compliments.' }
    ]
  },
  {
    id: 'prod-6',
    name: 'Precision Mechanical Keyboard',
    category: 'Tech & Audio',
    price: 165,
    originalPrice: 190,
    rating: 4.9,
    reviewCount: 143,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Precision-engineered wireless mechanical keyboard with hot-swappable switches, CNC aluminum chassis, and sublime acoustics.',
    features: [
      'Gasket-mounted plate design for cushioned typing feel',
      'Custom linear mechanical switches (factory lubricated)',
      'Tri-mode connectivity: Bluetooth 5.1, 2.4GHz wireless, USB-C',
      'PBT dye-sublimated keycaps in minimalist grey'
    ],
    colors: ['Silver Aluminum', 'Space Grey', 'Sandstone'],
    sizes: ['75% Compact', '80% TKL'],
    inStock: true,
    isNew: true,
    reviews: [
      { id: 'rev-7', author: 'Alex Turner', rating: 5, date: '4 days ago', comment: 'Typing feels like typing on clouds. Sound profile is creamy and satisfying.' }
    ]
  },
  {
    id: 'prod-7',
    name: 'French Stoneware Serving Bowl',
    category: 'Home & Living',
    price: 52,
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
    id: 'prod-8',
    name: 'Botanical Linen Duvet Cover Set',
    category: 'Home & Living',
    price: 190,
    originalPrice: 230,
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
    reviews: [
      { id: 'rev-8', author: 'Jessica Miller', rating: 5, date: '1 month ago', comment: 'Transforms the bedroom into a luxury boutique hotel.' }
    ]
  },
  {
    id: 'prod-9',
    name: 'Matte Ceramic Plant Vessel',
    category: 'Home & Living',
    price: 45,
    rating: 4.6,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
    mediaGallery: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sculptural terracotta planter finished in a tactile matte white glaze with an integrated drainage dish for healthy houseplants.',
    features: [
      'High-fired durable terracotta clay',
      'Removable catch saucer protects tabletops',
      'Minimalist ribbed textural pattern',
      'Ideal for succulents, monsteras, and herbs'
    ],
    colors: ['Matte White', 'Terracotta Clay', 'Warm Stone'],
    sizes: ['Medium', 'Large'],
    inStock: true,
    reviews: [
      { id: 'rev-9', author: 'Tom Hardy', rating: 5, date: '2 weeks ago', comment: 'Clean lines and heavy quality.' }
    ]
  }
];
