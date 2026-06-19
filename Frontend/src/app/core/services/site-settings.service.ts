import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PublicApiService } from '../api/public-api.service';
import { SiteSettings } from '../models/api.models';

/**
 * Loads all site settings once on first access and exposes individual values as signals.
 * Public-facing components read from here instead of hardcoding contact details, hero copy, etc.
 * Falls back to empty strings — the template should provide sensible defaults via `||`.
 */
@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private readonly api = inject(PublicApiService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly settings = signal<SiteSettings>({});
  private loaded = false;

  // ── Derived signals ───────────────────────────────────────────────────────
  readonly siteName = computed(() => this.settings()['site.name'] || '');
  readonly siteTagline = computed(() => this.settings()['site.tagline'] || '');

  readonly contactEmail = computed(() => this.settings()['contact.email'] || '');
  readonly contactPhone = computed(() => this.settings()['contact.phone'] || '');
  readonly contactAddress = computed(() => this.settings()['contact.address'] || '');
  readonly openingHours = computed(() => this.settings()['contact.openingHours'] || '');

  readonly socialInstagram = computed(() => this.settings()['social.instagram'] || '');
  readonly socialFacebook = computed(() => this.settings()['social.facebook'] || '');

  readonly heroTitle = computed(() => this.settings()['hero.title'] || '');
  readonly heroSubtitle = computed(() => this.settings()['hero.subtitle'] || '');

  readonly announcementBanner = computed(() => this.settings()['announcement.banner'] || '');

  // Stats (home page)
  readonly statsStudents = computed(() => this.settings()['stats.students'] || '');
  readonly statsSubjects = computed(() => this.settings()['stats.subjects'] || '');
  readonly statsReferralRate = computed(() => this.settings()['stats.referralRate'] || '');
  readonly statsYearsExperience = computed(() => this.settings()['stats.yearsExperience'] || '');

  // About page
  readonly aboutMission = computed(() => this.settings()['about.mission'] || '');
  readonly aboutValue1Title = computed(() => this.settings()['about.value1.title'] || '');
  readonly aboutValue1Desc = computed(() => this.settings()['about.value1.description'] || '');
  readonly aboutValue2Title = computed(() => this.settings()['about.value2.title'] || '');
  readonly aboutValue2Desc = computed(() => this.settings()['about.value2.description'] || '');
  readonly aboutValue3Title = computed(() => this.settings()['about.value3.title'] || '');
  readonly aboutValue3Desc = computed(() => this.settings()['about.value3.description'] || '');

  // Legal pages
  readonly legalImpressum = computed(() => this.settings()['legal.impressum'] || '');
  readonly legalDatenschutz = computed(() => this.settings()['legal.datenschutz'] || '');
  readonly legalAgb = computed(() => this.settings()['legal.agb'] || '');

  /** Load settings from the API (called once, guarded against duplicates). */
  load(): void {
    if (this.loaded || !isPlatformBrowser(this.platformId)) return;
    this.loaded = true;
    this.api.getSiteSettings().subscribe((s) => this.settings.set(s));
  }

  /** Get an arbitrary setting value by key. */
  get(key: string): string {
    return this.settings()[key] || '';
  }
}
