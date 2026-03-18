import { Property } from "@/types/Property"


// Real images from Unsplash
const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1502602898687-8c1294e18111?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-94886a07e8d7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1583608205775-b350260c36a9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1560518711-c119900c521b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1564013799946-6eeb9c8a8b5b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1560518711-c119900c521b?auto=format&fit=crop&w=600&q=80',
]

export async function getProperties(): Promise<Property[]> {
  // Simulate API call with realistic data
  await new Promise(resolve => setTimeout(resolve, 300))

  return [
    {
      id: 1,
      title: 'Sapporo Snow View Estate',
      image: PROPERTY_IMAGES[0],
      price: 78000000,
      rating: 4.5,
      reviews: 120,
      amenities: ['Garden', 'Self check-in', 'Air conditioning'],
      superhost: true,
      type: 'Estate',
      details: 'Chuo-ku, Sapporo • 4 guests • 4 bedrooms • 2 bathrooms',
      lat: 43.0618,
      lng: 141.3545,
    },
    {
      id: 2,
      title: 'Sapporo Snow View Estate',
      image: PROPERTY_IMAGES[1],
      price: 78000000,
      rating: 4.8,
      reviews: 85,
      amenities: ['Garden', 'Self check-in', 'Air conditioning'],
      superhost: false,
      type: 'Estate',
      details: 'Chuo-ku, Sapporo • 4 guests • 4 bedrooms • 2 bathrooms',
      lat: 43.0626,
      lng: 141.3542,
    },
    {
      id: 3,
      title: 'Sapporo Snow View Estate',
      image: PROPERTY_IMAGES[2],
      price: 78000000,
      rating: 4.9,
      reviews: 150,
      amenities: ['Garden', 'Self check-in', 'Air conditioning'],
      superhost: true,
      type: 'Estate',
      details: 'Chuo-ku, Sapporo • 4 guests • 4 bedrooms • 2 bathrooms',
      lat: 43.0606,
      lng: 141.3537,
    },
    {
      id: 4,
      title: 'Sapporo Snow View Estate',
      image: PROPERTY_IMAGES[3],
      price: 78000000,
      rating: 5.0,
      reviews: 200,
      amenities: ['Garden', 'Self check-in', 'Air conditioning'],
      superhost: true,
      type: 'Estate',
      details: 'Chuo-ku, Sapporo • 4 guests • 4 bedrooms • 2 bathrooms',
      lat: 43.0596,
      lng: 141.3529,
    },
    {
      id: 5,
      title: 'Sapporo Snow View Estate',
      image: PROPERTY_IMAGES[4],
      price: 78000000,
      rating: 4.7,
      reviews: 110,
      amenities: ['Garden', 'Self check-in', 'Air conditioning'],
      superhost: false,
      type: 'Estate',
      details: 'Chuo-ku, Sapporo • 4 guests • 4 bedrooms • 2 bathrooms',
      lat: 43.0587,
      lng: 141.3552,
    },
    {
      id: 6,
      title: 'Sapporo Snow View Estate',
      image: PROPERTY_IMAGES[5],
      price: 78000000,
      rating: 4.6,
      reviews: 95,
      amenities: ['Garden', 'Self check-in', 'Air conditioning'],
      superhost: false,
      type: 'Estate',
      details: 'Chuo-ku, Sapporo • 4 guests • 4 bedrooms • 2 bathrooms',
      lat: 43.0634,
      lng: 141.3564,
    },
  ]
}