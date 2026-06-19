import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-agb',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agb.component.html',
  styleUrl: './agb.component.scss',
})
export class AgbComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly settings = inject(SiteSettingsService);

  ngOnInit(): void {
    this.seo.update({
      title: 'AGB',
      description:
        'Allgemeine Geschäftsbedingungen des Nachhilfezentrums — Vertragsbedingungen für Nachhilfe und Coaching.',
      path: '/agb',
    });
  }
}
