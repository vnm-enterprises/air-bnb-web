import {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
  type WishlistListResponse,
  type WishlistMutationResponse,
} from "@/lib/wishlistApi";

export { getMyWishlist, addToWishlist, removeFromWishlist };

export type { WishlistListResponse, WishlistMutationResponse };

export const wishlistService = {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
};
