import api from './axios';
import type { Property } from './propertyApi';

export interface WishlistListResponse {
  success: boolean;
  message: string;
  data: {
    properties: Property[];
    count: number;
  };
}

export interface WishlistMutationResponse {
  success: boolean;
  message: string;
  data: {
    property_id: number;
    saved: boolean;
    count: number;
  };
}

export async function getMyWishlist(): Promise<WishlistListResponse> {
  try {
    const response = await api.get<WishlistListResponse>('/api/v1/users/me/wishlist');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addToWishlist(propertyId: number): Promise<WishlistMutationResponse> {
  try {
    const response = await api.post<WishlistMutationResponse>('/api/v1/wishlist', {
      property_id: propertyId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function removeFromWishlist(propertyId: number): Promise<WishlistMutationResponse> {
  try {
    const response = await api.delete<WishlistMutationResponse>(`/api/v1/wishlist/${propertyId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
