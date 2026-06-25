import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * During SSR, relative API URLs (e.g. "/api/v1/...") cannot be resolved — the server
 * would route them back through itself and hang. This interceptor rewrites relative
 * API calls to an absolute origin while rendering on the server. The origin is taken
 * from the `SSR_API_ORIGIN` environment variable first (per-deployment), falling back
 * to `environment.ssrApiOrigin`. In production the origin must be HTTPS. In the browser
 * the URL is left relative (same-origin), so nothing changes there. Must run before the
 * auth interceptor.
 */
export const ssrBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId) && req.url.startsWith('/')) {
    const origin = resolveSsrOrigin();
    if (origin) {
      return next(req.clone({ url: `${origin}${req.url}` }));
    }
  }
  return next(req);
};

function resolveSsrOrigin(): string {
  const fromEnv =
    typeof process === 'undefined' ? undefined : process.env?.['SSR_API_ORIGIN']?.trim();
  const origin = fromEnv || environment.ssrApiOrigin;
  if (!origin) {
    return '';
  }
  // Never let the SSR server fetch the API over plaintext HTTP in production.
  if (environment.production && !origin.startsWith('https://')) {
    throw new Error(
      'SSR_API_ORIGIN must be an https:// URL in production. Configure it per deployment.',
    );
  }
  return origin;
}
