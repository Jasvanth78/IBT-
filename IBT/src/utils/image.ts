export function resolveImageUrl(url: string | null | undefined): string {
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
  let cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  if (!cleanPath.startsWith('/uploads/')) {
    cleanPath = `/uploads${cleanPath}`;
  }
  
  // 4. Combine with the current API_URL (production or local)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  const base = baseUrl.replace(/\/$/, '');
  return `${base}${cleanPath}`;
}
