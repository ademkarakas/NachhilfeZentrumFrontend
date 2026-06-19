import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { AnswerInput, PublicAssessment } from '../../core/models/api.models';
import { DIFFICULTY_LABELS } from '../../core/models/enums';
import { SeoService } from '../../core/seo/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonComponent } from '../../shared/ui/button.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';
import { QuestionRendererComponent } from './question-renderer.component';

@Component({
  selector: 'app-test-taking',
  imports: [
    RouterLink,
    QuestionRendererComponent,
    ButtonComponent,
    SpinnerComponent,
    RevealDirective,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <app-spinner />
    } @else if (test(); as t) {
      <section class="hero-band">
        <div class="container" appReveal>
          <a routerLink="/tests" class="back">← Alle Tests</a>
          <h1>{{ t.title }}</h1>
          <p class="meta">
            <app-icon name="clock" [size]="15" />
            {{ difficultyLabel(t) }} · {{ t.questions.length }} Fragen ·
            ca. {{ t.estimatedDurationMinutes }} Min · {{ t.totalPoints }} Punkte
          </p>
          @if (t.description) {
            <div class="lead rich-content" [innerHTML]="t.description"></div>
          }
        </div>
      </section>

      <section class="section">
        <div class="container narrow">
          <form (ngSubmit)="submit(t)">
            @for (q of t.questions; track q.id; let i = $index) {
              <app-question-renderer
                appReveal
                [revealIndex]="i"
                [question]="q"
                [index]="i"
                [selectedOptionIds]="selectionFor(q.id)"
                (selectionChange)="setAnswer(q.id, $event)"
              />
            }

            <div class="actions">
              <p class="progress">{{ answeredCount() }} von {{ t.questions.length }} beantwortet</p>
              <app-button type="submit" size="lg" [disabled]="submitting()">
                {{ submitting() ? 'Wird ausgewertet…' : 'Test abgeben' }}
              </app-button>
            </div>
          </form>
        </div>
      </section>
    } @else {
      <div class="container section">
        <p>Dieser Test wurde nicht gefunden.</p>
        <a routerLink="/tests">← Zurück zum Katalog</a>
      </div>
    }
  `,
  styles: [
    `
      .hero-band {
        position: relative;
        overflow: hidden;
        background: var(--grad-hero);
        padding: clamp(var(--space-10), 8vw, var(--space-12)) 0;
        border-bottom: 1px solid var(--color-line);
      }
      .hero-band::before {
        content: '';
        position: absolute;
        width: 420px;
        height: 420px;
        top: -170px;
        right: -120px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--color-primary-100), transparent 70%);
        filter: blur(70px);
        opacity: 0.55;
        pointer-events: none;
      }
      .hero-band .container {
        position: relative;
        z-index: 1;
      }
      .back {
        display: inline-block;
        margin-bottom: var(--space-3);
        font-weight: 600;
      }
      .meta {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        color: var(--color-muted);
        font-weight: 600;
      }
      .lead {
        max-width: 65ch;
      }
      .narrow {
        max-width: 760px;
      }
      .actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--space-4);
        margin-top: var(--space-6);
      }
      .progress {
        margin: 0;
        color: var(--color-muted);
        font-weight: 600;
      }
    `,
  ],
})
export class TestTakingComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly slug = input.required<string>();
  readonly test = signal<PublicAssessment | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  /** questionId → selected option ids. */
  readonly answers = signal<Record<string, string[]>>({});

  ngOnInit(): void {
    this.api.getTest(this.slug()).subscribe({
      next: (t) => {
        this.test.set(t);
        this.loading.set(false);
        this.seo.update({
          title: t.title,
          description: t.description,
          path: `/tests/${t.slug}`,
        });
      },
      error: () => this.loading.set(false),
    });
  }

  selectionFor(questionId: string): string[] {
    return this.answers()[questionId] ?? [];
  }

  setAnswer(questionId: string, optionIds: string[]): void {
    this.answers.update((a) => ({ ...a, [questionId]: optionIds }));
  }

  answeredCount(): number {
    return Object.values(this.answers()).filter((ids) => ids.length > 0).length;
  }

  submit(test: PublicAssessment): void {
    if (this.submitting()) {
      return;
    }
    this.submitting.set(true);
    const answers: AnswerInput[] = test.questions.map((q) => ({
      questionId: q.id,
      selectedOptionIds: this.answers()[q.id] ?? [],
      freeText: null,
    }));

    this.api.submitAttempt(test.id, { answers }).subscribe({
      next: (result) => this.router.navigate(['/attempts', result.attemptId]),
      error: () => {
        this.submitting.set(false);
        this.toast.error('Der Test konnte nicht abgegeben werden. Bitte erneut versuchen.');
      },
    });
  }

  difficultyLabel(t: PublicAssessment): string {
    return DIFFICULTY_LABELS[t.difficulty];
  }
}
