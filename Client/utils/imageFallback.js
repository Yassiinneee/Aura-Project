export const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80';

export const handleImageError = (e, fallback = FALLBACK_PRODUCT_IMAGE) => {
  if (e?.currentTarget && e.currentTarget.src !== fallback) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  }
};
