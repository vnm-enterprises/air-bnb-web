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

/**
 * Fetch all properties with optional filters and pagination
 */
export async function getProperties(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  guests?: number;
  location?: string;
  sort?: 'created_desc' | 'price_asc' | 'price_desc';
}): Promise<PropertiesResponse> {
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
): Promise<any> {
  try {
    const response = await api.get(`/api/v1/properties/${id}/availability`, {
      params: { check_in: checkIn, check_out: checkOut },
    });
    return response.data;
  } catch (error) {
    console.error(`Error checking availability for property ${id}:`, error);
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
export async function deleteProperty(id: number): Promise<any> {
  try {
    const response = await api.delete(`/api/v1/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error);
    throw error;
  }
}
