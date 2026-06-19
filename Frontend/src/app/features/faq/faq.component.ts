import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { FaqItem } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-faq',
  imports: [RouterLink, RevealDirective, CtaSectionComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly api = inject(PublicApiService);

  readonly faqItems = signal<FaqItem[]>([]);

  ngOnInit(): void {
    this.seo.update({
      title: 'FAQ — Häufig gestellte Fragen',
      description:
        'Antworten auf häufige Fragen zu Nachhilfe, Coaching, Preisen und Ablauf im Nachhilfezentrum.',
      path: '/faq',
    });

    this.api.getFaq().subscribe((items) => {
      this.faqItems.set(items);
      this.seo.setStructuredData('faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    });
  }
}
