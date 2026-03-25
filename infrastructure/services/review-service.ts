import {
  createReview,
  getPropertyReviews,
  replyToReview,
  type CreateReviewResponse,
  type PropertyReview,
  type PropertyReviewsResponse,
  type ReplyToReviewResponse,
  type ReviewPagination,
} from "@/lib/reviewApi";

export { getPropertyReviews, createReview, replyToReview };

export type {
  PropertyReview,
  PropertyReviewsResponse,
  CreateReviewResponse,
  ReplyToReviewResponse,
  ReviewPagination,
};

export const reviewService = {
  getPropertyReviews,
  createReview,
  replyToReview,
};
