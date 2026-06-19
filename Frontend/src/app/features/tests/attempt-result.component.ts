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
  template: `
    <section class="section">
      <div class="container narrow">
        @if (loading()) {
          <app-spinner label="Ergebnis wird geladen…" />
        } @else if (result(); as r) {
          <div class="result-card" appReveal="scale">
            @if (r.status === AttemptStatus.PendingReview) {
              <app-badge tone="warning">Manuelle Auswertung ausstehend</app-badge>
              <h1>Danke — dein Test wird ausgewertet</h1>
              <p>
                Einige Antworten müssen von einer Lehrkraft geprüft werden. Dein vorläufiges
                Ergebnis siehst du unten.
              </p>
            } @else {
              <span class="eyebrow">Ergebnis</span>
              <h1>Du hast {{ r.score }} von {{ r.maxScore }} Punkten erreicht</h1>
            }

            <div class="score" [class.score--good]="percent() >= 60">
              <div class="score__ring">{{ percent() }}%</div>
            </div>

            <p class="summary">
              {{ correctCount() }} von {{ r.answers.length }} Fragen richtig beantwortet.
            </p>

            <div class="actions">
              <app-button link="/tests">Weitere Tests</app-button>
              <app-button link="/kontakt" variant="outline">Nachhilfe anfragen</app-button>
            </div>
          </div>
        } @else {
          <p>Dieses Ergebnis wurde nicht gefunden.</p>
          <a routerLink="/tests">← Zum Test-Katalog</a>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .narrow {
        max-width: 640px;
      }
      .result-card {
        text-align: center;
        background: var(--color-surface);
        border: 1px solid var(--color-line);
        border-radius: var(--radius-lg);
        padding: var(--space-8) var(--space-6);
        box-shadow: var(--shadow);
      }
      .score {
        margin: var(--space-5) 0;
      }
      .score__ring {
        width: 140px;
        height: 140px;
        border-radius: var(--radius-full);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: var(--fs-2xl);
        font-weight: 800;
        color: var(--color-danger);
        border: 8px solid currentColor;
      }
      .score--good .score__ring {
        color: var(--color-success);
      }
      .summary {
        font-size: var(--fs-lg);
        color: var(--color-body);
      }
      .actions {
        display: flex;
        gap: var(--space-3);
        justify-content: center;
        flex-wrap: wrap;
        margin-top: var(--space-5);
      }
    `,
  ],
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
