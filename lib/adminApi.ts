import api from './axios';

/* ============================================================
   TYPES
============================================================ */

export interface AdminStats {
  properties: {
    total: number;
    active: number;
    pending: number;
    hidden: number;
  };
  bookings: {
    total: number;
    pending: number;
    approved: number;
    completed: number;
    cancelled: number;
  };
  reviews: {
    total: number;
    pending: number;
  };
  users: {
    total: number;
  };
}

export interface AdminProperty {
  id: number;
  title: string;
  description: string;
  host_id: number;
  host_name: string;
  price: number;
  location: string;
  status: string;
  images: string[];
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  rating_average: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminBooking {
  id: number;
  property_id: number;
  property_title: string;
  traveler_id: number;
  traveler_name: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  total_price: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  registered: string;
  property_count: number;
  booking_count: number;
}

export interface AdminReview {
  id: number;
  property_id: number;
  property_title: string;
  reviewer_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  status: string;
  host_reply: string;
  created_at: string;
}

export interface AdminPagination {
  total: number;
  pages: number;
  current: number;
}

interface AdminApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ============================================================
   STATS
============================================================ */

export async function getAdminStats(): Promise<AdminStats> {
  const res = await api.get<AdminApiResponse<AdminStats>>('/api/v1/admin/stats');
  return res.data.data;
}

/* ============================================================
   PROPERTIES
============================================================ */

export interface AdminPropertiesParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export async function getAdminProperties(params: AdminPropertiesParams = {}): Promise<{
  properties: AdminProperty[];
  pagination: AdminPagination;
}> {
  const res = await api.get<AdminApiResponse<{ properties: AdminProperty[]; pagination: AdminPagination }>>(
    '/api/v1/admin/properties',
    { params }
  );
  return res.data.data;
}

export async function updateAdminPropertyStatus(id: number, status: string): Promise<{ id: number; status: string }> {
  const res = await api.patch<AdminApiResponse<{ id: number; status: string }>>(
    `/api/v1/admin/properties/${id}/status`,
    { status }
  );
  return res.data.data;
}

export async function deleteAdminProperty(id: number): Promise<void> {
  await api.delete(`/api/v1/admin/properties/${id}`);
}

/* ============================================================
   BOOKINGS
============================================================ */

export interface AdminBookingsParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export async function getAdminBookings(params: AdminBookingsParams = {}): Promise<{
  bookings: AdminBooking[];
  pagination: AdminPagination;
}> {
  const res = await api.get<AdminApiResponse<{ bookings: AdminBooking[]; pagination: AdminPagination }>>(
    '/api/v1/admin/bookings',
    { params }
  );
  return res.data.data;
}

export async function getAdminBookingById(id: number): Promise<AdminBooking> {
  const res = await api.get<AdminApiResponse<AdminBooking>>(`/api/v1/admin/bookings/${id}`);
  return res.data.data;
}

export async function updateAdminBookingStatus(id: number, status: string): Promise<{ id: number; status: string }> {
  const res = await api.patch<AdminApiResponse<{ id: number; status: string }>>(
    `/api/v1/admin/bookings/${id}/status`,
    { status }
  );
  return res.data.data;
}

/* ============================================================
   USERS
============================================================ */

export interface AdminUsersParams {
  page?: number;
  per_page?: number;
  role?: string;
  search?: string;
}

export async function getAdminUsers(params: AdminUsersParams = {}): Promise<{
  users: AdminUser[];
  pagination: AdminPagination;
}> {
  const res = await api.get<AdminApiResponse<{ users: AdminUser[]; pagination: AdminPagination }>>(
    '/api/v1/admin/users',
    { params }
  );
  return res.data.data;
}

export async function updateAdminUserRole(id: number, role: string): Promise<{ id: number; role: string }> {
  const res = await api.patch<AdminApiResponse<{ id: number; role: string }>>(
    `/api/v1/admin/users/${id}/role`,
    { role }
  );
  return res.data.data;
}

export async function deleteAdminUser(id: number): Promise<void> {
  await api.delete(`/api/v1/admin/users/${id}`);
}

/* ============================================================
   REVIEWS
============================================================ */

export interface AdminReviewsParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export async function getAdminReviews(params: AdminReviewsParams = {}): Promise<{
  reviews: AdminReview[];
  pagination: AdminPagination;
}> {
  const res = await api.get<AdminApiResponse<{ reviews: AdminReview[]; pagination: AdminPagination }>>(
    '/api/v1/admin/reviews',
    { params }
  );
  return res.data.data;
}

export async function updateAdminReviewStatus(id: number, status: string): Promise<{ id: number; status: string }> {
  const res = await api.patch<AdminApiResponse<{ id: number; status: string }>>(
    `/api/v1/admin/reviews/${id}/status`,
    { status }
  );
  return res.data.data;
}
