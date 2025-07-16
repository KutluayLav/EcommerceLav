'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Send } from 'lucide-react';
import { submitReviewStart, submitReviewSuccess, submitReviewFailure } from '@/features/reviews/reviewsSlice';
import { RootState } from '@/store';
import { Review } from '@/types';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isSubmitting, error } = useSelector((state: RootState) => state.reviews);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      return;
    }

    if (rating === 0) {
      dispatch(submitReviewFailure('Please select a rating'));
      return;
    }

    if (!title.trim() || !comment.trim()) {
      dispatch(submitReviewFailure('Please fill in all fields'));
      return;
    }

    dispatch(submitReviewStart());

    try {
      // Simulate API call
      setTimeout(() => {
        const newReview: Review = {
          id: `r_${Date.now()}`,
          productId,
          userId: user.id,
          userName: user.name,
          rating,
          title: title.trim(),
          comment: comment.trim(),
          date: new Date().toISOString().split('T')[0],
          verified: true, // Assume verified for demo
          helpful: 0,
          userMarkedHelpful: false,
        };

        dispatch(submitReviewSuccess(newReview));
        
        // Reset form
        setRating(0);
        setTitle('');
        setComment('');
        setShowForm(false);
        
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }, 1000);
    } catch (error) {
      dispatch(submitReviewFailure('Failed to submit review. Please try again.'));
    }
  };

  const renderStars = (interactive = false) => {
    const currentRating = interactive ? (hoveredRating || rating) : rating;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-6 w-6 ${
                star <= currentRating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
        {interactive && rating > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            {rating} out of 5 stars
          </span>
        )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">Sign in to write a review</p>
        <a 
          href="/auth/login"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign In
        </a>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Share Your Experience
        </h3>
        <p className="text-gray-600 mb-4">
          Help other customers by sharing your thoughts about this product.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Star className="h-4 w-4 mr-2" />
          Write a Review
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          {renderStars(true)}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={100}
            required
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {title.length}/100 characters
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you think about this product..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={500}
            required
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
              isSubmitting || rating === 0
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 