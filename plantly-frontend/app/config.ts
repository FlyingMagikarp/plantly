const isBrowser = typeof window !== "undefined";

// For React Router 7 SSR, import.meta.env.VITE_API_URL can be set at build time for the client,
// and as an environment variable for the server.
const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";

// In Docker Compose, the internal URL (http://backend:8081) is not accessible from the browser.
// If we are in the browser and the API URL is the internal one, we fallback to a known external address.
// We also check for localhost to allow local development to work.
export const API_BASE_URL = isBrowser && (rawApiUrl.includes("backend:8081") || rawApiUrl.includes("localhost:8081"))
  ? `http://${window.location.hostname}:8081` 
  : rawApiUrl;
