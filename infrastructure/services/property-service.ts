import {
  checkAvailability,
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  getUnavailableDates,
  updateProperty,
  uploadPropertyImages,
  type AvailabilityResponse,
  type DeletePropertyResponse,
  type GetPropertiesParams,
  type PropertiesResponse,
  type Property,
  type PropertyResponse,
  type UnavailableDateRange,
  type UnavailableDatesResponse,
  type UploadPropertyImagesResponse,
} from "@/lib/propertyApi";

export {
  getProperties,
  getPropertyById,
  checkAvailability,
  getUnavailableDates,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
};

export type {
  Property,
  PropertyResponse,
  PropertiesResponse,
  AvailabilityResponse,
  UnavailableDateRange,
  UnavailableDatesResponse,
  GetPropertiesParams,
  DeletePropertyResponse,
  UploadPropertyImagesResponse,
};

export const propertyService = {
  getProperties,
  getPropertyById,
  checkAvailability,
  getUnavailableDates,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
};
