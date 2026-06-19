import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description?: string;
  /** Path used to build canonical/og:url, e.g. '/coaching'. */
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}

const SITE_NAME = 'Nachhilfezentrum';
const DEFAULT_DESC =
  'Professionelle Nachhilfe und Coaching — individuelle Förderung in allen Fächern sowie Lerncoaching für Motivation, Lernstrategien und Prüfungsangst.';
const ORIGIN = 'https://www.nachhilfezentrum.de';

/**
 * Centralises Title/Meta and JSON-LD structured data so every public route ships
 * SSR-rendered SEO tags. Keeps the marketing site discoverable for a local business.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly platformId = inject(PLATFORM_ID);

  constructor(@Inject(DOCUMENT) private readonly doc: Document) {}

  update(config: SeoConfig): void {
    const fullTitle = `${config.title} | ${SITE_NAME}`;
    const description = config.description ?? DEFAULT_DESC;
    const url = config.path ? `${ORIGIN}${config.path}` : ORIGIN;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: config.type ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.setCanonical(url);
  }

  /** Injects (or replaces) a JSON-LD <script> block for Schema.org structured data. */
  setStructuredData(id: string, data: Record<string, unknown>): void {
    const head = this.doc.head;
    const existing = head.querySelector(`script[data-jsonld="${id}"]`);
    if (existing) {
      existing.remove();
    }
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-jsonld', id);
    script.text = JSON.stringify(data);
    head.appendChild(script);
  }

  /** Schema.org EducationalOrganization — emitted on the home/landing route. */
  organizationSchema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: SITE_NAME,
      url: ORIGIN,
      description: DEFAULT_DESC,
      areaServed: 'DE',
    };
  }

  private setCanonical(url: string): void {
    // On the server the head is serialised, so this lands in page source for crawlers.
    const head = this.doc.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
    // Touch platform check so server renders eagerly without warnings.
    void isPlatformServer(this.platformId);
  }
}
