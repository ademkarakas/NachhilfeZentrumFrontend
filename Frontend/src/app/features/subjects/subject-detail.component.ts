import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { AssessmentListItem, Subject } from '../../core/models/api.models';
import { DIFFICULTY_LABELS, VisibilityLevel } from '../../core/models/enums';
import { SeoService } from '../../core/seo/seo.service';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { LockIndicatorComponent } from '../../shared/ui/lock-indicator.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-subject-detail',
  imports: [
    RouterLink,
    CardComponent,
    BadgeComponent,
    IconComponent,
    LockIndicatorComponent,
    SpinnerComponent,
    CtaSectionComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subject-detail.component.html',
  styleUrl: './subject-detail.component.scss',
})
export class SubjectDetailComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  /** Bound from the route param via withComponentInputBinding. */
  readonly slug = input.required<string>();

  readonly subject = signal<Subject | null>(null);
  readonly tests = signal<AssessmentListItem[]>([]);
  readonly loading = signal(true);
  protected readonly Visibility = VisibilityLevel;

  ngOnInit(): void {
    this.api.getSubject(this.slug()).subscribe({
      next: (s) => {
        this.subject.set(s);
        this.loading.set(false);
        this.seo.update({
          title: `Nachhilfe ${s.name}`,
          description: s.description,
          path: `/nachhilfe/${s.slug}`,
        });
        this.api.getTestsBySubject(s.id).subscribe((t) => this.tests.set(t));
      },
      error: () => this.loading.set(false),
    });
  }

  difficultyLabel(test: AssessmentListItem): string {
    return DIFFICULTY_LABELS[test.difficulty];
  }
}
