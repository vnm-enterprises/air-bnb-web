# Feature Updates – Booking Calendar & Property Filters

**Date:** March 11, 2026
**Summary:** Booking availability now visible to all users on the calendar, and real filter controls implemented on the properties listing page.

---

## 1. Booking Calendar – Unavailable Dates Visible to All Users

### Problem

Greyed-out (unavailable) dates on the property booking calendar were only visible to the traveler who made the booking. All other logged-in users saw every date as available, even if the property was already fully booked.

### Root Cause

`ownership-enforcement.php` attaches a WordPress `pre_get_posts` hook that silently appends a `traveler_id = current_user_id` meta condition to every `booking` post type query. This is correct for "My Bookings" style endpoints, but it was also applied to the public `/unavailable-dates` endpoint, making it return only the current user's own bookings.

### Solution

Introduced a sentinel query flag `skip_ownership_enforcement`. Internal/admin `WP_Query` calls that need to see all bookings for a property set this flag. The `pre_get_posts` callbacks early-return when the flag is present.

### Files Modified

#### Backend

**`air-bnb-api/wp-content/mu-plugins/ownership-enforcement.php`**
- Added `skip_ownership_enforcement` early-return guard to **both** `pre_get_posts` callback closures:
  ```php
  add_action('pre_get_posts', function ($query) {
      if ($query->get('skip_ownership_enforcement')) {
          return; // bypass ownership scoping for internal queries
      }
      // ... existing ownership logic
  });
  ```

**`air-bnb-api/wp-content/mu-plugins/property-api.php`**
- Added `skip_ownership_enforcement => true` to the `WP_Query` inside the `/properties/{id}/unavailable-dates` endpoint:
  ```php
  $bookings = new WP_Query([
      'post_type'                   => 'booking',
      'post_status'                 => 'publish',
      'posts_per_page'              => -1,
      'skip_ownership_enforcement'  => true,
      'meta_query'                  => [ ... ]
  ]);
  ```

**`air-bnb-api/wp-content/mu-plugins/booking-api.php`**
- Added the same flag to `booking_has_conflict()`. Without this, a traveler could book already-booked dates because the conflict check was scoped to only their own bookings:
  ```php
  function booking_has_conflict($property_id, $check_in, $check_out, $exclude_id = null) {
      $query = new WP_Query([
          'post_type'                  => 'booking',
          'posts_per_page'             => -1,
          'skip_ownership_enforcement' => true,
          'meta_query'                 => [ ... ]
      ]);
  ```

### Behaviour After Fix

| Scenario | Before | After |
|---|---|---|
| Traveler A views property calendar | Sees only own booked dates greyed out | Sees **all** booked dates greyed out |
| Traveler B tries to book an already-booked range | Conflict check passes (bug) | Conflict check correctly blocks the booking |
| Host views property calendar | Unaffected (host query path unchanged) | Same correct behaviour |

---

## 2. Properties Listing Page – Working Filters

### Problem

The `/properties` page had a filter bar UI, but it was entirely static. Clicking any filter did nothing — all filter inputs were uncontrolled, no state was managed, and results were always the full unfiltered property list.

### Solution

Fully refactored data flow: the page owns all filter state backed by URL search params, passes it down to the filter bar, and the results list is a purely presentational component. Filters persist across page refreshes via URL.

### Files Modified

#### Frontend

**`air-bnb-web/lib/propertyApi.ts`**
- Exported `GetPropertiesParams` as a shared interface (was previously internal):
  ```typescript
  export interface GetPropertiesParams {
    page?: number;
    per_page?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    guests?: number;
    location?: string;
    sort?: 'created_desc' | 'price_asc' | 'price_desc';
  }
  ```
- Added typed `AvailabilityResponse` and `DeletePropertyResponse` interfaces to replace `Promise<any>` return types.

**`air-bnb-web/components/properties/FilterBar.tsx`**

Fully rewritten from static HTML to a controlled component.

New props:
```typescript
{
  filters: GetPropertiesParams;
  onApply: (filters: GetPropertiesParams) => void;
  onReset: () => void;
  mapEnabled: boolean;
  toggleMap: () => void;
}
```

New features:
- **Quick filter pills** — "All stays", "2+ bedrooms", "4+ guests", "Price low-high". Toggle on/off; active pill is highlighted.
- **`Filters (N)` badge** — counts how many filter parameters are currently active.
- **Inline Reset button** — appears when any filter is active, clears all filters.
- **Filter drawer** — slides open with:
  - Keyword text input (`search`)
  - Destination text input (`location`)
  - Price Min / Max number inputs
  - Bedrooms pill buttons (1, 2, 3, 4, 5+)
  - Guests pill buttons (1+, 2+, 3+, 4+, 5+, 6+, 8+)
  - Sort dropdown (Newest first / Price: low–high / Price: high–low)
- **Draft state** — drawer changes are staged; committed only when "Show results" is clicked (drawer close without apply discards).

**`air-bnb-web/components/properties/ResultsList.tsx`**

Converted from self-fetching to a purely presentational component.

Old behaviour: fetched properties internally, no filter awareness.

New props:
```typescript
{
  properties: Property[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}
```

Result count label logic:
- `loading` → "Loading stays..."
- `totalResults === 1` → "1 stay found"
- `totalResults > 1` → "N stays found"

**`air-bnb-web/app/properties/page.tsx`**

Full orchestration rewrite. The page:
1. Reads URL search params on mount to initialise `baseFilters` (`GetPropertiesParams`).
2. Fetches the paginated property list whenever `baseFilters` or `currentPage` changes.
3. Fetches map pins (up to 50) whenever `baseFilters` or `mapEnabled` changes.
4. Passes `baseFilters` and callbacks down to `FilterBar`.
5. Passes result data and pagination down to `ResultsList`.

URL state helpers:
```typescript
toFilterState(searchParams)   // parse URL → GetPropertiesParams
applyFilterParams(params, filters, page) // GetPropertiesParams → URLSearchParams
```

Navigation handlers:
- `handleApplyFilters(f)` — merges new filters, resets page to 1, pushes URL
- `handleResetFilters()` — pushes `/properties` with no params
- `handlePageChange(page)` — pushes same filters with new page number

### Filter ↔ URL Param Mapping

| Filter field | URL param | Example |
|---|---|---|
| Keyword | `search` | `?search=pool` |
| Destination | `location` | `?location=Colombo` |
| Min price | `min_price` | `?min_price=50` |
| Max price | `max_price` | `?max_price=200` |
| Bedrooms | `bedrooms` | `?bedrooms=2` |
| Guests | `guests` | `?guests=4` |
| Sort | `sort` | `?sort=price_asc` |
| Page | `page` | `?page=2` |

Multiple filters combine: `/properties?guests=4&sort=price_asc&page=1`

### Behaviour After Fix

| Action | Before | After |
|---|---|---|
| Click "4+ guests" quick filter | Nothing | URL becomes `?guests=4`, results narrow |
| Open drawer, set price range, click "Show results" | Nothing | URL updates, results refresh |
| Reload page with `?guests=4` in URL | Filters lost | Filter state restored from URL |
| Click Reset | Nothing | URL clears, all properties shown |
| Navigate to page 2 | Not implemented | URL becomes `?page=2`, next batch loads |
| Toggle map | Not filtered | Map pins respect active filters |

---

## 3. Architectural Notes

### WordPress Ownership Enforcement Pattern

The `skip_ownership_enforcement` sentinel is a safer alternative to temporarily removing the `pre_get_posts` hook:

- **Do not** use `remove_action` / `add_action` around a query to bypass the hook — this is not thread-safe in PHP and easy to miss.
- **Do** set `'skip_ownership_enforcement' => true` in the `WP_Query` args for any internal query that must see all records regardless of the current user.

### URL-as-State Pattern (Next.js)

All filter state lives in the URL. This means:
- Filters survive full page reloads.
- Users can share filtered URLs.
- Back/forward navigation works correctly.
- No `localStorage` or session storage is needed.

The page reads `useSearchParams()` on render and derives `baseFilters`; all navigation uses `router.push()` with a fully rebuilt `URLSearchParams` string.

---

## 4. Testing Checklist

### Calendar Unavailability
- [ ] Log in as Traveler A and book property X for dates D1–D3.
- [ ] Log out, log in as Traveler B and open property X booking calendar.
- [ ] Confirm D1–D3 are greyed out and unselectable.
- [ ] Confirm Traveler B cannot submit a booking for D1–D3 (conflict check blocks it).

### Property Filters
- [ ] Open `/properties` — all properties load, no filters active.
- [ ] Click "4+ guests" — results narrow, URL shows `?guests=4`, badge shows "Filters (1)".
- [ ] Reload page — filter persists, same filtered results shown.
- [ ] Open filter drawer, set Min price = 50, click "Show results" — URL adds `?min_price=50`.
- [ ] Click Reset — URL clears, all properties return, badge gone.
- [ ] Navigate to page 2 (if enough results) — URL shows `?page=2`, next batch loads.
- [ ] Toggle map — map pins match the current filtered result set.
