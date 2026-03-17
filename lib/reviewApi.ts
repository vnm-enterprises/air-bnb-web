import api from './axios';

export interface PropertyReview {
  id: number;
  booking_id: number;
  reviewer_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  host_reply?: string;
  created_at: string;
}

export interface ReviewPagination {
  total: number;
  pages: number;
  current: number;
}

export interface PropertyReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: PropertyReview[];
    pagination: ReviewPagination;
  };
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data: {
    review_id: number;
  };
}

export interface ReplyToReviewResponse {
  success: boolean;
  message: string;
  data: {
    reply_added: boolean;
  };
}

export async function getPropertyReviews(
  propertyId: number,
  params?: { page?: number; per_page?: number }
): Promise<PropertyReviewsResponse> {
  try {
    const response = await api.get<PropertyReviewsResponse>(`/api/v1/properties/${propertyId}/reviews`, {
      params: params || {},
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for property ${propertyId}:`, error);
    throw error;
  }
}

export async function createReview(data: {
  booking_id: number;
  rating: number;
  comment: string;
}): Promise<CreateReviewResponse> {
  try {
    const response = await api.post<CreateReviewResponse>('/api/v1/reviews', data);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

export async function replyToReview(
  reviewId: number,
  reply: string
): Promise<ReplyToReviewResponse> {
  try {
    const response = await api.post<ReplyToReviewResponse>(`/api/v1/reviews/${reviewId}/reply`, {
      reply,
    });

    return response.data;
  } catch (error) {
    console.error(`Error replying to review ${reviewId}:`, error);
    throw error;
  }
}
