import {
  cancelBooking,
  completeBooking,
  confirmBooking,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  getHostBookings,
  getUserBookings,
  updateBooking,
  type Booking,
  type BookingResponse,
  type BookingsPagination,
  type BookingsResponse,
  type CreateBookingResponse,
} from "@/lib/bookingApi";

export {
  getAllBookings,
  getUserBookings,
  getHostBookings,
  getBookingById,
  createBooking,
  updateBooking,
  confirmBooking,
  completeBooking,
  cancelBooking,
  deleteBooking,
};

export type {
  Booking,
  BookingResponse,
  BookingsPagination,
  BookingsResponse,
  CreateBookingResponse,
};

export const bookingService = {
  getAllBookings,
  getUserBookings,
  getHostBookings,
  getBookingById,
  createBooking,
  updateBooking,
  confirmBooking,
  completeBooking,
  cancelBooking,
  deleteBooking,
};
