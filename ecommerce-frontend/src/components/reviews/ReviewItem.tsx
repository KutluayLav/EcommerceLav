'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { Review } from '@/types';
import { markReviewHelpful } from '@/features/reviews/reviewsSlice';
import { RootState } from '@/store';

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleMarkHelpful = () => {
    if (!isAuthenticated) {
      // Could show a login prompt here
      return;
    }
    
    dispatch(markReviewHelpful({
      productId: review.productId,
      reviewId: review.id
    }));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      {/* Reviewer Info */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
          {review.userAvatar ? (
            <img 
              src={review.userAvatar} 
              alt={review.userName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-gray-600">
              {review.userName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
            {review.verified && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Verified Purchase</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 mb-2">
            {renderStars(review.rating)}
            <span className="text-sm text-gray-600">{formatDate(review.date)}</span>
          </div>
          
          <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
          <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
          
          {/* Helpful Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleMarkHelpful}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 text-sm transition-colors ${
                review.userMarkedHelpful 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <ThumbsUp className={`h-4 w-4 ${review.userMarkedHelpful ? 'fill-current' : ''}`} />
              <span>Helpful ({review.helpful})</span>
            </button>
            
            {!isAuthenticated && (
              <span className="text-xs text-gray-500">
                Sign in to mark as helpful
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 