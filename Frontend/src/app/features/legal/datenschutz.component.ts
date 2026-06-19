import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-datenschutz',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datenschutz.component.html',
  styleUrl: './datenschutz.component.scss',
})
export class DatenschutzComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly settings = inject(SiteSettingsService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Datenschutzerklärung',
      description:
        'Datenschutzerklärung des Nachhilfezentrums — Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.',
      path: '/datenschutz',
    });
  }
}
