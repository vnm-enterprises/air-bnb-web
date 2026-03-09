import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyWishlist, addToWishlist, removeFromWishlist } from "@/lib/wishlistApi";

export function useWishlist() {
  const { isAuthenticated, isTraveler } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  // Load wishlist on mount
  useEffect(() => {
    if (!isAuthenticated || !isTraveler()) {
      setWishlistIds(new Set());
      setLoading(false);
      return;
    }

    let active = true;

    const fetchWishlist = async () => {
      try {
        const response = await getMyWishlist();
        if (active) {
          const ids = response.data.properties.map((p) => p.id);
          setWishlistIds(new Set(ids));
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        if (active) {
          setWishlistIds(new Set());
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchWishlist();

    return () => {
      active = false;
    };
  }, [isAuthenticated, isTraveler]);

  const isInWishlist = useCallback(
    (propertyId: number): boolean => {
      return wishlistIds.has(propertyId);
    },
    [wishlistIds]
  );

  const isProcessing = useCallback(
    (propertyId: number): boolean => {
      return processingIds.has(propertyId);
    },
    [processingIds]
  );

  const toggleWishlist = useCallback(
    async (propertyId: number): Promise<boolean> => {
      if (!isAuthenticated || !isTraveler()) {
        return false;
      }

      if (processingIds.has(propertyId)) {
        return false;
      }

      setProcessingIds((prev) => new Set(prev).add(propertyId));

      try {
        const inWishlist = wishlistIds.has(propertyId);

        if (inWishlist) {
          await removeFromWishlist(propertyId);
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(propertyId);
            return next;
          });
        } else {
          await addToWishlist(propertyId);
          setWishlistIds((prev) => new Set(prev).add(propertyId));
        }

        return true;
      } catch (error) {
        console.error("Failed to toggle wishlist:", error);
        return false;
      } finally {
        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
      }
    },
    [isAuthenticated, isTraveler, wishlistIds, processingIds]
  );

  return {
    isInWishlist,
    isProcessing,
    toggleWishlist,
    loading,
    canUseWishlist: isAuthenticated && isTraveler(),
  };
}
