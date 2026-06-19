export const environment = {
  production: true,
  // Same-origin in the browser; the reverse proxy forwards /api to the backend.
  apiBaseUrl: '/api/v1',
  // Absolute origin the SSR server uses to reach the API directly (it can't call a
  // relative URL through itself). Override per deployment — point it at the backend's
  // internal address. Defaults to the local backend for `npm run serve:ssr`.
  ssrApiOrigin: 'http://localhost:5009',
  membershipGatingEnabled: false,
};
