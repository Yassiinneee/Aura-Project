import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  MessageSquarePlus,
  ShieldCheck
} from 'lucide-react';
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation
} from '../store/apiSlice.js';
import { handleImageError } from '../utils/imageFallback.js';

export const ReviewModal = ({ isOpen, onClose, product, user }) => {
  const productId = product?.id || product?.productId;
  const { data: reviewData, isLoading, refetch } = useGetProductReviewsQuery(productId, { skip: !isOpen || !productId });
  const [createReview, { isLoading: submitting }] = useCreateReviewMutation();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [authorEmail, setAuthorEmail] = useState(user?.email || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showWriteForm, setShowWriteForm] = useState(false);

  if (!isOpen || !product) return null;

  const reviews = reviewData?.reviews || [];
  const averageRating = reviewData?.averageRating || product.rating || 5.0;
  const reviewCount = reviewData?.reviewCount || reviews.length;
  const distribution = reviewData?.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMsg('Please write at least a few words describing your experience.');
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment: comment.trim(),
        author: authorName.trim() || user?.name || 'Verified Customer',
        email: authorEmail.trim() || user?.email || '',
      }).unwrap();

      setSuccessMsg('Thank you! Your verified review has been published.');
      setComment('');
      setShowWriteForm(false);
      refetch();
    } catch (err) {
      setErrorMsg(err?.data?.error || 'Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              onError={handleImageError}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200"
            />
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900 leading-snug">
                Reviews & Ratings
              </h2>
              <p className="text-xs text-stone-500 truncate max-w-md">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Rating Aggregates Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-stone-50 p-5 rounded-xl border border-stone-200/80 items-center">
            <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-stone-200 pb-4 md:pb-0 md:pr-4">
              <div className="text-4xl font-serif font-bold text-stone-900">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center items-center gap-1 my-1.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-stone-500">Based on {reviewCount} verified ratings</p>
            </div>

            <div className="md:col-span-8 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star] || 0;
                const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs text-stone-600">
                    <span className="w-12 flex items-center gap-1 font-medium">
                      {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium text-stone-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-base">Customer Feedback</h3>
            <button
              onClick={() => setShowWriteForm(!showWriteForm)}
              className="px-4 py-2 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              {showWriteForm ? 'Close Form' : 'Write a Review'}
            </button>
          </div>

          {/* Write Review Form */}
          {showWriteForm && (
            <form
              onSubmit={handleSubmit}
              className="p-5 bg-amber-50/40 rounded-xl border border-amber-200/80 space-y-4 animate-in fade-in duration-150"
            >
              <h4 className="text-sm font-bold text-stone-900">Share Your Artisanal Experience</h4>

              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg flex items-center gap-2 border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {successMsg}
                </div>
              )}

              {/* Star Picker */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">Rating Score</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-stone-600 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Marcus Chen"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="e.g. marcus@example.com"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Your Review</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Detail the craftsmanship, finish, tactile feel, and performance..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWriteForm(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-sm text-stone-400 py-6">
                Be the first to review this handcrafted piece.
              </p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id || rev._id}
                  className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{rev.author}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-400">{rev.date || 'Recent'}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= (rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
