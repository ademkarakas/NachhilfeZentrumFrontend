export const environment = {
  production: true,
  // Same-origin in the browser; the reverse proxy forwards /api to the backend.
  apiBaseUrl: '/api/v1',
  // Absolute origin the SSR server uses to reach the API directly (it can't call a
  // relative URL through itself). Supply it at runtime via the SSR_API_ORIGIN environment
  // variable (must be HTTPS in production) — the SSR interceptor reads that first and
  // falls back to this value. Left empty so a missing/insecure config fails fast rather
  // than silently calling a plaintext localhost endpoint.
  ssrApiOrigin: '',
  membershipGatingEnabled: false,
};
