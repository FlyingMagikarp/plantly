// For React Router 7 SSR, import.meta.env.VITE_API_URL can be set at build time for the client,
// and as an environment variable for the server.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";
