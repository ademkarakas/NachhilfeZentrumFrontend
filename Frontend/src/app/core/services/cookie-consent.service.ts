import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CookieConsent {
  essential: true;
  statistics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'cookie_consent';

const DEFAULT_CONSENT: CookieConsent = {
  essential: true,
  statistics: false,
  marketing: false,
  timestamp: '',
};

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly consent = signal<CookieConsent>(this.loadConsent());
  readonly bannerVisible = signal<boolean>(!this.hasConsented());

  hasConsented(): boolean {
    if (!this.isBrowser) return true; // SSR: assume consented to avoid flash
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  acceptAll(): void {
    this.saveConsent({ essential: true, statistics: true, marketing: true });
  }

  acceptEssentialOnly(): void {
    this.saveConsent({ essential: true, statistics: false, marketing: false });
  }

  savePreferences(statistics: boolean, marketing: boolean): void {
    this.saveConsent({ essential: true, statistics, marketing });
  }

  revokeConsent(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEY);
    this.consent.set(DEFAULT_CONSENT);
    this.bannerVisible.set(true);
  }

  private saveConsent(consent: Omit<CookieConsent, 'timestamp'>): void {
    if (!this.isBrowser) return;
    const full: CookieConsent = { ...consent, timestamp: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    this.consent.set(full);
    this.bannerVisible.set(false);
  }

  private loadConsent(): CookieConsent {
    if (!this.isBrowser) return DEFAULT_CONSENT;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_CONSENT;
    try {
      return JSON.parse(stored) as CookieConsent;
    } catch {
      return DEFAULT_CONSENT;
    }
  }
}
