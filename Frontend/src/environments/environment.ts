/**
 * Runtime configuration. `membershipGatingEnabled` is a stub flag for the
 * Pro/membership extensibility seam — locked-content UI exists today, but no
 * content is actually gated until this flips and the backend enforces it.
 */
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5009/api/v1',
  // Dev API base is already absolute, so no SSR rewrite is needed.
  ssrApiOrigin: '',
  membershipGatingEnabled: false,
};
