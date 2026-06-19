import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PublicApiService } from '../../core/api/public-api.service';
import { FaqItem, PricingTier } from '../../core/models/api.models';
import { cardsFromBlocks } from '../../shared/content-blocks.util';
import { SeoService } from '../../core/seo/seo.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent, IconName } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-pricing',
  imports: [RevealDirective, ButtonComponent, CtaSectionComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly api = inject(PublicApiService);
  readonly settings = inject(SiteSettingsService);

  readonly tiers = signal<PricingTier[]>([]);
  readonly faqs = signal<FaqItem[]>([]);

  readonly benefits = signal<{ icon: IconName; title: string; text: string }[]>([
    {
      icon: 'check',
      title: 'Kostenlose Probestunde',
      text: 'Lernen Sie uns unverbindlich kennen — ohne Risiko.',
    },
    {
      icon: 'book-open',
      title: 'Individueller Lernplan',
      text: 'Maßgeschneiderte Förderung basierend auf Lernstandsanalyse.',
    },
    {
      icon: 'target',
      title: 'Fortschrittsberichte',
      text: 'Regelmäßiges Feedback an Eltern über den Lernfortschritt.',
    },
    {
      icon: 'clock',
      title: 'Flexible Terminplanung',
      text: 'Unterrichtszeiten, die zu Ihrem Alltag passen.',
    },
    {
      icon: 'shield',
      title: 'Keine Mindestlaufzeit',
      text: 'Monatlich kündbar — keine langfristigen Verpflichtungen.',
    },
    {
      icon: 'sparkles',
      title: 'Eigenes Lernmaterial',
      text: 'Hochwertige Unterlagen und Übungen inklusive.',
    },
  ]);

  readonly steps = signal<{ icon: IconName; title: string; text: string }[]>([
    {
      icon: 'phone',
      title: 'Beratungsgespräch',
      text: 'Kontaktieren Sie uns — wir besprechen die Situation und finden das passende Paket.',
    },
    {
      icon: 'users',
      title: 'Probestunde',
      text: 'Ihr Kind lernt die Lehrkraft kennen — kostenlos und unverbindlich.',
    },
    {
      icon: 'sparkles',
      title: 'Paket wählen',
      text: 'Entscheiden Sie sich für das Angebot, das am besten passt.',
    },
    {
      icon: 'badge-check',
      title: 'Unterricht starten',
      text: 'Der regelmäßige Unterricht beginnt — mit messbaren Fortschritten.',
    },
  ]);

  ngOnInit(): void {
    this.seo.update({
      title: 'Preise — Nachhilfe & Coaching',
      description:
        'Transparente Preise für Einzelnachhilfe, Gruppenunterricht und Lerncoaching. Ab 39 € pro Stunde. Gratis Probestunde inklusive.',
      path: '/preise',
    });

    this.api.getPricing().subscribe((tiers) => this.tiers.set(tiers));
    this.api
      .getFaq()
      .subscribe((f) => this.faqs.set(f.filter((faq) => faq.category?.toLowerCase() === 'preise')));
    this.api.getContentBlocks('pricing').subscribe((blocks) => {
      const bn = cardsFromBlocks(blocks, 'benefits');
      if (bn.length) this.benefits.set(bn);
      const st = cardsFromBlocks(blocks, 'process-steps');
      if (st.length) this.steps.set(st);
    });
  }

  getFeatures(tier: PricingTier): string[] {
    return tier.features ? tier.features.split('\n').filter((f) => f.trim()) : [];
  }
}
