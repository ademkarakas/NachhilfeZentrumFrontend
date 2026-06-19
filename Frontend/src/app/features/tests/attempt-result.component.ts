import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { AttemptResult } from '../../core/models/api.models';
import { AttemptStatus } from '../../core/models/enums';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';

@Component({
  selector: 'app-attempt-result',
  imports: [RouterLink, BadgeComponent, ButtonComponent, SpinnerComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './attempt-result.component.html',
  styleUrl: './attempt-result.component.scss',
})
export class AttemptResultComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly attemptId = input.required<string>();
  readonly result = signal<AttemptResult | null>(null);
  readonly loading = signal(true);
  protected readonly AttemptStatus = AttemptStatus;

  readonly percent = computed(() => Math.round(this.result()?.scorePercentage ?? 0));
  readonly correctCount = computed(
    () => this.result()?.answers.filter((a) => a.isCorrect === true).length ?? 0,
  );

  ngOnInit(): void {
    this.seo.update({ title: 'Testergebnis', path: `/attempts/${this.attemptId()}` });
    this.api.getAttemptResult(this.attemptId()).subscribe({
      next: (r) => {
        this.result.set(r);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
