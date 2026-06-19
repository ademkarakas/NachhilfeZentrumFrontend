import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProblemDetails } from '../models/api.models';
import { ToastService } from '../services/toast.service';
import { AuthService } from './auth.service';

let refreshing = false;

/**
 * Attaches the JWT to API calls, transparently refreshes once on a 401, and surfaces
 * unexpected failures as a toast. Auth endpoints are skipped for the token attach so a
 * stale token never blocks login/refresh.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  const isApi = req.url.startsWith(environment.apiBaseUrl);
  const isAuthCall = req.url.includes('/auth/');

  const token = auth.accessToken;
  const authReq =
    isApi && token && !isAuthCall ? withBearer(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && isApi && !isAuthCall && auth.isAuthenticated() && !refreshing) {
        refreshing = true;
        return auth.refresh().pipe(
          switchMap((tokens) => {
            refreshing = false;
            return next(withBearer(req, tokens.accessToken));
          }),
          catchError((refreshError) => {
            refreshing = false;
            auth.logout();
            return throwError(() => refreshError);
          }),
        );
      }

      reportError(error, toast, isAuthCall);
      return throwError(() => error);
    }),
  );
};

function withBearer(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function reportError(error: HttpErrorResponse, toast: ToastService, isAuthCall: boolean): void {
  // Validation (400) and auth-call failures are handled inline by forms; don't double-toast.
  if (error.status === 400 || error.status === 0 || isAuthCall) {
    if (error.status === 0) {
      toast.error('Verbindung zum Server fehlgeschlagen.');
    }
    return;
  }
  const problem = error.error as ProblemDetails | null;
  const message =
    problem?.detail || problem?.title || 'Ein unerwarteter Fehler ist aufgetreten.';
  toast.error(message);
}
