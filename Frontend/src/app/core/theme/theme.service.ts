import { DOCUMENT, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'nz-theme';

/**
 * Dark-mode controller. SSR-safe: on the server it stays on the default theme and
 * touches no browser APIs. In the browser it mirrors the `data-theme` attribute that
 * the no-FOUC inline script (see index.html) already applied before first paint.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly _preference = signal<ThemePreference>(this.readStoredPreference());
  /** The user's choice: light, dark, or follow the OS. */
  readonly preference = this._preference.asReadonly();

  private readonly _systemDark = signal<boolean>(this.readSystemDark());

  /** The concrete theme currently applied (system resolved to light/dark). */
  readonly resolved = computed<ResolvedTheme>(() => {
    const pref = this._preference();
    if (pref === 'system') return this._systemDark() ? 'dark' : 'light';
    return pref;
  });

  constructor() {
    if (!this.isBrowser) return;

    const media = this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)');
    media?.addEventListener('change', (e) => this._systemDark.set(e.matches));

    // Keep the <html data-theme> attribute and theme-color in sync with state.
    this.apply(this.resolved());
  }

  /** Cycle light → dark → system → light. */
  cycle(): void {
    const next: Record<ThemePreference, ThemePreference> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    this.set(next[this._preference()]);
  }

  set(pref: ThemePreference): void {
    this._preference.set(pref);
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      /* storage may be unavailable (private mode) — ignore */
    }
    this.apply(this.resolved());
  }

  private apply(theme: ResolvedTheme): void {
    const root = this.doc.documentElement;
    root.setAttribute('data-theme', theme);
    const meta = this.doc.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
    if (meta) meta.content = theme === 'dark' ? '#14110e' : '#157f5c';
  }

  private readStoredPreference(): ThemePreference {
    if (!isPlatformBrowser(this.platformId)) return 'system';
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'light' || v === 'dark' || v === 'system') return v;
    } catch {
      /* ignore */
    }
    return 'system';
  }

  private readSystemDark(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ?? false;
  }
}
