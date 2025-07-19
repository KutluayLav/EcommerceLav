'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Star, Filter } from 'lucide-react';
import { RootState } from '@/store';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { fetchReviewsStart, fetchReviewsSuccess, fetchReviewsFailure } from '@/features/reviews/reviewsSlice';
import api from '@/services/api';

interface ReviewListProps {
  productId: string;
  refreshKey?: number;
  onReviewSubmitted?: () => void;
}

export default function ReviewList({ productId, refreshKey }: ReviewListProps) {
  // Memoized selector to prevent unnecessary re-renders
  const selectReviews = useCallback(
    (state: RootState) => state.reviews.reviews[productId] || [],
    [productId]
  );
  
  const reviews = useSelector(selectReviews);
  const { isLoading } = useSelector((state: RootState) => state.reviews);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchReviews = async () => {
      dispatch(fetchReviewsStart());
      try {
        const res = await api.get(`/products/${productId}/reviews`);
        dispatch(fetchReviewsSuccess({ productId, reviews: res.data.reviews }));
      } catch (err: any) {
        dispatch(fetchReviewsFailure('Yorumlar getirilemedi.'));
      }
    };
    fetchReviews();
  }, [productId, refreshKey, dispatch]);

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');

  // Calculate review statistics
  const reviewStats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [0, 0, 0, 0, 0]
      };
    }

    const totalReviews = reviews.length;
    const sumRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = sumRating / totalReviews;
    
    const ratingDistribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      ratingDistribution[review.rating - 1]++;
    });

    return {
      averageRating,
      totalReviews,
      ratingDistribution
    };
  }, [reviews]);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // Filter by rating
    if (selectedRating !== null) {
      filtered = filtered.filter(review => review.rating === selectedRating);
    }

    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    return sorted;
  }, [reviews, selectedRating, sortBy]);

  const renderStars = (rating: number, size = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBar = (stars: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
      <div className="flex items-center space-x-3 text-sm">
        <button
          onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
          className={`flex items-center space-x-1 min-w-0 ${
            selectedRating === stars ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          } transition-colors`}
        >
          <span>{stars}</span>
          <Star className="h-3 w-3 fill-current text-yellow-400" />
        </button>
        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-0">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              selectedRating === stars ? 'bg-blue-500' : 'bg-yellow-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-gray-600 min-w-0">{count}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading reviews...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      {reviewStats.totalReviews > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {reviewStats.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    {renderStars(Math.round(reviewStats.averageRating), 'lg')}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars}>
                  {renderRatingBar(
                    stars, 
                    reviewStats.ratingDistribution[stars - 1], 
                    reviewStats.totalReviews
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      <ReviewForm productId={productId} />

      {/* Filters and Sorting */}
      {reviewStats.totalReviews > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            
            {selectedRating && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedRating} stars</span>
                <button
                  onClick={() => setSelectedRating(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="sort-reviews" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort-reviews"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
            <ReviewItem key={review.id || review._id} review={review} />
          ))
        ) : reviewStats.totalReviews > 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No reviews match your current filter.</p>
            <button
              onClick={() => setSelectedRating(null)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              Show all reviews
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-2">No reviews yet.</p>
            <p className="text-sm text-gray-500">Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {/* Show filtered count */}
      {selectedRating && filteredAndSortedReviews.length > 0 && (
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedReviews.length} of {reviewStats.totalReviews} review
            {reviewStats.totalReviews !== 1 ? 's' : ''}
            {selectedRating && ` with ${selectedRating} star${selectedRating !== 1 ? 's' : ''}`}
          </p>
        </div>
      )}
    </div>
  );
} 