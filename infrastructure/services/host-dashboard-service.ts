import {
  getHostBookings,
  getBookingById,
  type Booking,
} from "@/infrastructure/services/booking-service";
import {
  getProperties,
  getPropertyById,
  type Property,
} from "@/infrastructure/services/property-service";

export type NormalizedHostBooking = {
  id: number;
  propertyId: number;
  travelerId: number;
  travelerName: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
};

type HostBookingsPayload =
  | Booking[]
  | {
      bookings?: Array<number | string | Booking>;
    };

function normalizeHostBooking(item: Booking): NormalizedHostBooking {
  return {
    id: Number(item.id),
    propertyId: Number(item.property_id),
    travelerId: Number(item.traveler_id ?? item.user_id ?? 0),
    travelerName: typeof item.traveler_name === "string" ? item.traveler_name.trim() : "",
    checkIn: String(item.check_in ?? ""),
    checkOut: String(item.check_out ?? ""),
    guestCount: Number(item.guest_count ?? item.guests ?? 0),
    totalPrice: Number(item.total_price ?? 0),
    status: String(item.status ?? "pending").toLowerCase(),
    paymentStatus: String(item.payment_status ?? "pending").toLowerCase(),
  };
}

export async function fetchHostBookingsDetailed(perPage = 50): Promise<NormalizedHostBooking[]> {
  const firstPage = await getHostBookings({ page: 1, per_page: perPage });
  const payload = firstPage?.data as HostBookingsPayload | undefined;

  let bookingIds: number[] = [];
  let bookingItems: Booking[] = [];

  if (Array.isArray(payload)) {
    bookingItems = payload;
  } else if (Array.isArray(payload?.bookings)) {
    const first = payload.bookings[0];

    if (typeof first === "number" || typeof first === "string") {
      bookingIds = payload.bookings
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0);
    } else {
      bookingItems = payload.bookings as Booking[];
    }
  }

  if (bookingIds.length > 0) {
    const details = await Promise.all(
      bookingIds.map(async (id) => {
        try {
          const response = await getBookingById(id);
          return response.data;
        } catch {
          return null;
        }
      })
    );

    bookingItems = details.filter((item): item is Booking => item !== null);
  }

  return bookingItems
    .map(normalizeHostBooking)
    .filter((booking) => booking.id > 0 && booking.propertyId > 0);
}

export async function fetchHostProperties(userId: number, perPage = 50): Promise<Property[]> {
  const firstPage = await getProperties({ page: 1, per_page: perPage });
  const allProperties = [...firstPage.data.properties];
  const pages = firstPage.data.pagination.pages || 1;

  if (pages > 1) {
    const requests: Array<Promise<Awaited<ReturnType<typeof getProperties>>>> = [];

    for (let page = 2; page <= pages; page += 1) {
      requests.push(getProperties({ page, per_page: perPage }));
    }

    const responses = await Promise.all(requests);
    responses.forEach((res) => {
      allProperties.push(...res.data.properties);
    });
  }

  return allProperties.filter((property) => Number(property.host_id) === Number(userId));
}

export async function fetchPropertyMap(propertyIds: number[]): Promise<Map<number, Property>> {
  const uniqueIds = Array.from(new Set(propertyIds.filter((id) => id > 0)));

  const propertyEntries = await Promise.all(
    uniqueIds.map(async (propertyId) => {
      try {
        const response = await getPropertyById(propertyId);
        return [propertyId, response.data] as const;
      } catch {
        return [propertyId, null] as const;
      }
    })
  );

  return new Map<number, Property>(
    propertyEntries.filter((entry): entry is readonly [number, Property] => entry[1] !== null)
  );
}
