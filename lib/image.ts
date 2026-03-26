const ABSOLUTE_PROTOCOL_PATTERN = /^(https?:)?\/\//i;

function getApiOrigin(): string | null {
  const rawBase = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!rawBase) {
    return null;
  }

  try {
    const url = new URL(rawBase);

    // Support URLs like https://example.com/wp-json or /index.php?rest_route=/
    const restIndex = url.pathname.indexOf("/wp-json");
    if (restIndex >= 0) {
      url.pathname = url.pathname.slice(0, restIndex) || "/";
      url.search = "";
      url.hash = "";
      return url.origin;
    }

    if (url.searchParams.has("rest_route")) {
      url.pathname = "/";
      url.search = "";
      url.hash = "";
      return url.origin;
    }

    return url.origin;
  } catch {
    return null;
  }
}

export function resolveImageUrl(image: string | null | undefined, fallback: string): string {
  if (!image || typeof image !== "string") {
    return fallback;
  }

  const trimmed = image.trim();

  if (!trimmed) {
    return fallback;
  }

  if (ABSOLUTE_PROTOCOL_PATTERN.test(trimmed)) {
    return trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
  }

  const origin = getApiOrigin();

  if (!origin) {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${origin}${normalizedPath}`;
}
