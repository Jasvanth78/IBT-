const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Ensures an image URL is absolute.
 * If the URL is already absolute (starts with http), it's returned as-is.
 * If it's a relative path (starts with /uploads), it's prepended with the backend API URL.
 */
export function getAbsoluteImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // 1. Return absolute URLs (Cloudinary, etc.) as is, unless they are localhost
  if (url.startsWith('http') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    return url;
  }

  // 2. Extract relative path from localhost URLs or use the string as is
  let relativePath = url;
  if (url.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      relativePath = urlObj.pathname;
    } catch (e) {
      // If URL is invalid, treat as relative path anyway
    }
  }
  
  // 3. Ensure path starts with /uploads/
  // Some legacy data might be stored as "members/..." instead of "/uploads/members/..."
  let cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  if (!cleanPath.startsWith('/uploads/')) {
    cleanPath = `/uploads${cleanPath}`;
  }
  
  // 4. Combine with the current API_URL (production or local)
  const base = API_URL.replace(/\/$/, '');
  return `${base}${cleanPath}`;
}
