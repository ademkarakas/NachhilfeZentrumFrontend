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
  templateUrl: './test-taking.component.html',
  styleUrl: './test-taking.component.scss',
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
