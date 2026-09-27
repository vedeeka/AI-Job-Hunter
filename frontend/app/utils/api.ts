/**
 * Helper to get the correct API endpoint URL whether running locally,
 * on Vercel with serverless Next.js API routes, or connected to a remote FastAPI backend.
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If user configured a remote backend URL (e.g. Railway, Render, etc.)
  const customBackendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (customBackendUrl) {
    const base = customBackendUrl.replace(/\/+$/, '');
    return `${base}${cleanPath}`;
  }

  // When deployed on Vercel or in standard web environments without explicit backend URL,
  // route through Next.js serverless API routes (/api/...)
  if (typeof window !== 'undefined') {
    // We are on the browser. Route to internal Next.js API handler
    return `/api${cleanPath}`;
  }

  // Server-side fallback during Next.js SSR / build
  return `/api${cleanPath}`;
}
