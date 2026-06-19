import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * During SSR, relative API URLs (e.g. "/api/v1/...") cannot be resolved — the server
 * would route them back through itself and hang. This interceptor rewrites relative
 * API calls to an absolute origin (`environment.ssrApiOrigin`) while rendering on the
 * server. In the browser the URL is left relative (same-origin), so nothing changes
 * there. Must run before the auth interceptor.
 */
export const ssrBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId) && req.url.startsWith('/') && environment.ssrApiOrigin) {
    return next(req.clone({ url: `${environment.ssrApiOrigin}${req.url}` }));
  }
  return next(req);
};
