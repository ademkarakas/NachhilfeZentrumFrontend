import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from '../models/api.models';

const STORAGE_KEY = 'nhz.auth';

/**
 * JWT auth with refresh-token support. The refresh token is held by the backend in an
 * HttpOnly cookie and is never exposed to JavaScript; only the short-lived access token
 * plus profile claims are kept client-side. Tokens persist to localStorage in the
 * browser only (SSR-safe — server renders as anonymous). Expired access tokens are
 * dropped on restore. State is exposed as signals so guards, the header and the
 * interceptor read a single source of truth.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly tokens = signal<AuthTokens | null>(this.restore());

  readonly isAuthenticated = computed(() => this.tokens() !== null);
  readonly email = computed(() => this.tokens()?.email ?? null);
  readonly fullName = computed(() => this.tokens()?.fullName ?? null);
  readonly roles = computed(() => this.tokens()?.roles ?? []);
  readonly isBackOffice = computed(() => this.roles().some((r) => r === 'Admin' || r === 'Editor'));
  readonly initials = computed(() => {
    const name = this.fullName();
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts.at(-1)![0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  });
  readonly primaryRole = computed(() => this.roles()[0] ?? null);

  get accessToken(): string | null {
    return this.tokens()?.accessToken ?? null;
  }

  login(payload: LoginRequest): Observable<AuthTokens> {
    return this.http
      .post<AuthTokens>(`${environment.apiBaseUrl}/auth/login`, payload, { withCredentials: true })
      .pipe(tap((t) => this.persist(t)));
  }

  register(payload: RegisterRequest): Observable<AuthTokens> {
    return this.http
      .post<AuthTokens>(`${environment.apiBaseUrl}/auth/register`, payload, {
        withCredentials: true,
      })
      .pipe(tap((t) => this.persist(t)));
  }

  refresh(): Observable<AuthTokens> {
    // The refresh token travels automatically in the HttpOnly cookie; only the (possibly
    // expired) access token is sent in the body so the server can identify the user.
    return this.http
      .post<AuthTokens>(
        `${environment.apiBaseUrl}/auth/refresh`,
        { accessToken: this.tokens()?.accessToken ?? '' },
        { withCredentials: true },
      )
      .pipe(tap((t) => this.persist(t)));
  }

  updateProfile(payload: UpdateProfileRequest): Observable<AuthTokens> {
    return this.http
      .put<AuthTokens>(`${environment.apiBaseUrl}/auth/profile`, payload, { withCredentials: true })
      .pipe(tap((t) => this.persist(t)));
  }

  logout(): void {
    this.tokens.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEY);
      // Best-effort: ask the backend to clear the HttpOnly refresh cookie.
      this.http
        .post(`${environment.apiBaseUrl}/auth/logout`, {}, { withCredentials: true })
        .subscribe({ error: () => undefined });
    }
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  private persist(tokens: AuthTokens): void {
    this.tokens.set(tokens);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    }
  }

  private restore(): AuthTokens | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      const tokens = JSON.parse(raw) as AuthTokens;
      // Drop a stale session if the access token has already expired. A live refresh
      // cookie still lets the user re-authenticate transparently on the next API call.
      if (this.isAccessTokenExpired(tokens.accessToken)) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return tokens;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  /** Decodes the JWT `exp` claim and reports whether it is in the past. */
  private isAccessTokenExpired(accessToken: string | undefined): boolean {
    if (!accessToken) return true;
    const parts = accessToken.split('.');
    if (parts.length !== 3) return true;
    try {
      const payload = JSON.parse(atob(parts[1].replaceAll('-', '+').replaceAll('_', '/')));
      const exp = typeof payload?.exp === 'number' ? payload.exp : 0;
      return exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
