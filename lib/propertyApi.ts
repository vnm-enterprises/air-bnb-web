import api from './axios';

export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  status: string;
  rating_average: number;
  rating_count: number;
  host_id: number;
  host_name?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertiesResponse {
  success: boolean;
  message: string;
  data: {
    properties: Property[];
    pagination: {
      total: number;
      pages: number;
      current: number;
    };
  };
}

export interface PropertyResponse {
  success: boolean;
  message: string;
  data: Property;
}

export interface UnavailableDateRange {
  from: string;
  to: string;
  reason: 'blocked' | 'booked';
}

export interface UnavailableDatesResponse {
  success: boolean;
  message: string;
  data: {
    unavailable_dates: UnavailableDateRange[];
  };
}

export interface AvailabilityResponse {
  success: boolean;
  message: string;
  data: {
    available: boolean;
  };
}

export interface DeletePropertyResponse {
  success: boolean;
  message: string;
  data: {
    deleted: boolean;
    property_id?: number;
    trashed?: boolean;
    permanent?: boolean;
  };
}

export interface UploadPropertyImagesResponse {
  success: boolean;
  message: string;
  data: {
    uploaded_images: number[];
    image_urls: string[];
  };
}

export interface GetPropertiesParams {
  page?: number;
  per_page?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  guests?: number;
  location?: string;
  check_in?: string;
  check_out?: string;
  sort?: 'created_desc' | 'price_asc' | 'price_desc';
  include_all_statuses?: boolean;
}

/**
 * Fetch all properties with optional filters and pagination
 */
export async function getProperties(params?: GetPropertiesParams): Promise<PropertiesResponse> {
  try {
    const response = await api.get<PropertiesResponse>('/api/v1/properties', {
      params: params || {},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
}

/**
 * Fetch a single property by ID
 */
export async function getPropertyById(id: number): Promise<PropertyResponse> {
  try {
    const response = await api.get<PropertyResponse>(`/api/v1/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    throw error;
  }
}

/**
 * Check property availability for specific dates
 */
export async function checkAvailability(
  id: number,
  checkIn: string,
  checkOut: string
): Promise<AvailabilityResponse> {
  try {
    const response = await api.get<AvailabilityResponse>(`/api/v1/properties/${id}/availability`, {
      params: { check_in: checkIn, check_out: checkOut },
    });
    return response.data;
  } catch (error) {
    console.error(`Error checking availability for property ${id}:`, error);
    throw error;
  }
}

/**
 * Get unavailable dates for a property (blocked + booked dates)
 */
export async function getUnavailableDates(id: number): Promise<UnavailableDatesResponse> {
  try {
    const response = await api.get<UnavailableDatesResponse>(
      `/api/v1/properties/${id}/unavailable-dates`,
      {
        // Prevent stale calendar state when navigating back to a property page.
        params: { _ts: Date.now() },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching unavailable dates for property ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new property (requires host authentication)
 */
export async function createProperty(data: Partial<Property>): Promise<PropertyResponse> {
  try {
    const response = await api.post<PropertyResponse>('/api/v1/properties', data);
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}

/**
 * Update a property (requires host authentication)
 */
export async function updateProperty(
  id: number,
  data: Partial<Property>
): Promise<PropertyResponse> {
  try {
    const response = await api.put<PropertyResponse>(`/api/v1/properties/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating property ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a property (requires host authentication)
 */
export async function deleteProperty(
  id: number,
  options?: { force?: boolean }
): Promise<DeletePropertyResponse> {
  try {
    const response = await api.delete<DeletePropertyResponse>(`/api/v1/hosts/properties/${id}`, {
      params: options?.force ? { force: true } : {},
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error);
    throw error;
  }
}

/**
 * Upload one or more images to a property using WordPress media library
 */
export async function uploadPropertyImages(
  id: number,
  files: File[]
): Promise<UploadPropertyImagesResponse> {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images[]", file);
    });

    const response = await api.post<UploadPropertyImagesResponse>(
      `/api/v1/properties/${id}/images`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error(`Error uploading images for property ${id}:`, error);
    throw error;
  }
}
