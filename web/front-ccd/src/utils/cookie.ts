/**
 * Set a cookie with a given name, value, and expiration in days.
 */
export function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Get a cookie value by name. Returns null if not found.
 */
export function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  // match[1] can be undefined if the group didn't match, so we provide an empty string fallback
  // to avoid 'string | undefined' to 'string' assignment error in decodeURIComponent.
  return match ? decodeURIComponent(match[1] ?? "") : null;
}
