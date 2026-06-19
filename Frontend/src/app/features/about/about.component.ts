import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PublicApiService } from '../../core/api/public-api.service';
import { Testimonial } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { TestimonialCardComponent } from '../../shared/ui/testimonial-card.component';

@Component({
  selector: 'app-about',
  imports: [TestimonialCardComponent, CtaSectionComponent, RevealDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);
  readonly settings = inject(SiteSettingsService);

  readonly testimonials = signal<Testimonial[]>([]);

  ngOnInit(): void {
    this.seo.update({
      title: 'Über uns',
      description:
        'Das Nachhilfezentrum verbindet fachliche Nachhilfe mit professionellem Lerncoaching.',
      path: '/ueber-uns',
    });
    this.api.getTestimonials().subscribe((t) => this.testimonials.set(t));
  }
}
