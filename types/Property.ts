export interface Property {
  id: number;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  total?: number;
  superhost?: boolean;
  image: string;
  type: string;
  details: string;
  amenities?: string[];
  lat: number;
  lng: number;
}
