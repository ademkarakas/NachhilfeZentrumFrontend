import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-impressum',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss',
})
export class ImpressumComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly settings = inject(SiteSettingsService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Impressum',
      description: 'Impressum und rechtliche Angaben des Nachhilfezentrums gemäß § 5 TMG.',
      path: '/impressum',
    });
  }
}
