import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review } from '@/types';

interface ReviewsState {
  reviews: Record<string, Review[]>; // productId -> reviews[]
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

const initialState: ReviewsState = {
  reviews: {},
  isLoading: false,
  error: null,
  isSubmitting: false,
};

// Mock initial reviews data - Product ID'ler products.ts ile eşleşiyor
const mockReviews: Record<string, Review[]> = {
  'fp1': [ // Wireless Headphones
    {
      id: 'r1',
      productId: 'fp1',
      userId: 'u1',
      userName: 'John Smith',
      rating: 5,
      title: 'Excellent sound quality!',
      comment: 'These headphones exceeded my expectations. The sound is crystal clear and the bass is amazing. Perfect for music and calls.',
      date: '2024-01-15',
      verified: true,
      helpful: 12,
      userMarkedHelpful: false,
    },
    {
      id: 'r2',
      productId: 'fp1',
      userId: 'u2',
      userName: 'Sarah Johnson',
      rating: 4,
      title: 'Great value for money',
      comment: 'Good headphones for the price. Comfortable to wear for long periods. Battery life could be better.',
      date: '2024-01-10',
      verified: true,
      helpful: 8,
      userMarkedHelpful: false,
    },
    {
      id: 'r3',
      productId: 'fp1',
      userId: 'u3',
      userName: 'Mike Chen',
      rating: 3,
      title: 'Decent but not perfect',
      comment: 'The headphones work well but the build quality feels a bit cheap. Good for casual listening.',
      date: '2024-01-05',
      verified: false,
      helpful: 3,
      userMarkedHelpful: false,
    },
    {
      id: 'r4',
      productId: 'fp1',
      userId: 'u4',
      userName: 'Emily Davis',
      rating: 5,
      title: 'Amazing wireless experience!',
      comment: 'I love these headphones! The wireless connection is stable and the noise cancellation works perfectly. Great for commuting.',
      date: '2024-01-20',
      verified: true,
      helpful: 15,
      userMarkedHelpful: false,
    },
    {
      id: 'r5',
      productId: 'fp1',
      userId: 'u5',
      userName: 'David Rodriguez',
      rating: 2,
      title: 'Not worth the price',
      comment: 'Disappointed with the quality. The sound is mediocre and they broke after 2 months. Expected better for this price point.',
      date: '2024-01-08',
      verified: true,
      helpful: 5,
      userMarkedHelpful: false,
    },
  ],
  'fp2': [ // Smartphone
    {
      id: 'r6',
      productId: 'fp2',
      userId: 'u6',
      userName: 'Lisa Park',
      rating: 5,
      title: 'Perfect smartphone!',
      comment: 'This phone has everything I need. Great camera, fast performance, and excellent battery life. Highly recommended!',
      date: '2024-01-18',
      verified: true,
      helpful: 20,
      userMarkedHelpful: false,
    },
    {
      id: 'r7',
      productId: 'fp2',
      userId: 'u7',
      userName: 'Tom Wilson',
      rating: 4,
      title: 'Good phone with minor issues',
      comment: 'Overall a solid phone. The camera is impressive and the display is beautiful. Only complaint is that it gets warm during gaming.',
      date: '2024-01-12',
      verified: true,
      helpful: 11,
      userMarkedHelpful: false,
    },
  ],
  'fp3': [ // Laptop
    {
      id: 'r8',
      productId: 'fp3',
      userId: 'u8',
      userName: 'Anna Thompson',
      rating: 5,
      title: 'Perfect for work and gaming!',
      comment: 'This laptop is fantastic! Fast performance, great display, and handles all my work and gaming needs perfectly.',
      date: '2024-01-16',
      verified: true,
      helpful: 18,
      userMarkedHelpful: false,
    },
    {
      id: 'r9',
      productId: 'fp3',
      userId: 'u9',
      userName: 'James Lee',
      rating: 4,
      title: 'Great performance laptop',
      comment: 'Excellent for productivity and light gaming. Build quality is solid and the keyboard feels premium. Battery life could be better.',
      date: '2024-01-11',
      verified: true,
      helpful: 7,
      userMarkedHelpful: false,
    },
    {
      id: 'r10',
      productId: 'fp3',
      userId: 'u10',
      userName: 'Maria Garcia',
      rating: 3,
      title: 'Good but expensive',
      comment: 'It does what it promises but the price is quite high. Performance is good but there are similar options for less money.',
      date: '2024-01-07',
      verified: false,
      helpful: 2,
      userMarkedHelpful: false,
    },
  ],
  'na2': [ // Fitness Tracker
    {
      id: 'r11',
      productId: 'na2',
      userId: 'u11',
      userName: 'Robert Kim',
      rating: 5,
      title: 'Love this fitness tracker!',
      comment: 'This fitness tracker is amazing! Tracks my workouts perfectly, great battery life, and the health insights are very helpful.',
      date: '2024-01-14',
      verified: true,
      helpful: 25,
      userMarkedHelpful: false,
    },
    {
      id: 'r12',
      productId: 'na2',
      userId: 'u12',
      userName: 'Jennifer Brown',
      rating: 4,
      title: 'Great for daily fitness tracking',
      comment: 'Perfect for everyday fitness monitoring. Heart rate accuracy is good and sleep tracking works well. Interface could be more intuitive.',
      date: '2024-01-09',
      verified: true,
      helpful: 13,
      userMarkedHelpful: false,
    },
  ],
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    ...initialState,
    reviews: mockReviews,
  },
  reducers: {
    fetchReviewsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchReviewsSuccess(state, action: PayloadAction<{ productId: string; reviews: Review[] }>) {
      state.isLoading = false;
      state.reviews[action.payload.productId] = action.payload.reviews;
      state.error = null;
    },
    fetchReviewsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    submitReviewStart(state) {
      state.isSubmitting = true;
      state.error = null;
    },
    submitReviewSuccess(state, action: PayloadAction<Review>) {
      state.isSubmitting = false;
      const { productId } = action.payload;
      if (!state.reviews[productId]) {
        state.reviews[productId] = [];
      }
      state.reviews[productId].unshift(action.payload); // Add new review at the beginning
      state.error = null;
    },
    submitReviewFailure(state, action: PayloadAction<string>) {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    markReviewHelpful(state, action: PayloadAction<{ productId: string; reviewId: string }>) {
      const { productId, reviewId } = action.payload;
      const reviews = state.reviews[productId];
      if (reviews) {
        const review = reviews.find(r => r.id === reviewId);
        if (review) {
          if (review.userMarkedHelpful) {
            review.helpful -= 1;
            review.userMarkedHelpful = false;
          } else {
            review.helpful += 1;
            review.userMarkedHelpful = true;
          }
        }
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchReviewsStart,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  submitReviewStart,
  submitReviewSuccess,
  submitReviewFailure,
  markReviewHelpful,
  clearError,
} = reviewsSlice.actions;

export default reviewsSlice.reducer; 