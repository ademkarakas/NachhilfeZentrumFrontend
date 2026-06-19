import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PublicApiService } from '../../core/api/public-api.service';
import { PricingTier } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
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

  readonly tiers = signal<PricingTier[]>([]);

  readonly benefits: { icon: IconName; title: string; text: string }[] = [
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
  ];

  readonly steps: { icon: IconName; title: string; text: string }[] = [
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
  ];

  readonly faqs: { question: string; answer: string }[] = [
    {
      question: 'Gibt es eine kostenlose Probestunde?',
      answer:
        'Ja! Die erste Stunde ist immer kostenlos und unverbindlich. So können Sie und Ihr Kind uns kennenlernen.',
    },
    {
      question: 'Kann ich monatlich kündigen?',
      answer:
        'Ja, bei uns gibt es keine Mindestvertragslaufzeit. Sie können jederzeit zum Monatsende kündigen.',
    },
    {
      question: 'Was passiert, wenn mein Kind einen Termin absagen muss?',
      answer: 'Termine können bis zu 24 Stunden vorher kostenlos abgesagt oder verschoben werden.',
    },
    {
      question: 'Variieren die Preise je nach Fach?',
      answer:
        'Die Grundpreise sind fachübergreifend gleich. Bei speziellem Bedarf (z. B. Abiturvorbereitung) beraten wir Sie individuell.',
    },
    {
      question: 'Sind Materialien im Preis enthalten?',
      answer:
        'Ja, alle Übungsmaterialien, Arbeitsblätter und digitale Ressourcen sind im Preis inklusive.',
    },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: 'Preise — Nachhilfe & Coaching',
      description:
        'Transparente Preise für Einzelnachhilfe, Gruppenunterricht und Lerncoaching. Ab 19 € pro Stunde. Gratis Probestunde inklusive.',
      path: '/preise',
    });

    this.api.getPricing().subscribe((tiers) => this.tiers.set(tiers));
  }

  getFeatures(tier: PricingTier): string[] {
    return tier.features ? tier.features.split('\n').filter((f) => f.trim()) : [];
  }
}
