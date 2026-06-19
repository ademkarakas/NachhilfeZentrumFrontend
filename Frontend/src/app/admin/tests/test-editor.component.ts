import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { AdminApiService } from '../../core/api/admin-api.service';
import { AssessmentAdminDetail, OptionInput } from '../../core/models/api.models';
import { QuestionType, STATUS_LABELS } from '../../core/models/enums';
import { ToastService } from '../../core/services/toast.service';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';
import { StripHtmlPipe } from '../../shared/pipes/strip-html.pipe';
import { ConfirmService } from '../shared/confirm-dialog.component';

/**
 * Question builder. The `[questionType]` select + `@switch` is the admin half of the
 * polymorphic-question seam: MultipleChoice is fully built today; adding a new type
 * later means a new `@case` form variant + the matching backend command — no rework.
 */
@Component({
  selector: 'app-test-editor',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    RichTextEditorComponent,
    StripHtmlPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/admin/tests" class="back">← Alle Tests</a>

    @if (test(); as t) {
      <header class="page-head">
        <div>
          <h1>{{ t.title }}</h1>
          <p class="meta">
            Status: {{ statusLabel(t.status) }} · {{ t.questions.length }} Fragen
          </p>
        </div>
      </header>

      <!-- Existing questions -->
      <section class="questions">
        @if (t.questions.length === 0) {
          <p class="empty">Noch keine Fragen. Füge unten die erste Frage hinzu.</p>
        }
        @for (q of t.questions; track q.id; let i = $index) {
          <mat-card appearance="outlined" class="q">
            <mat-card-content>
              <div class="q__head">
                <strong>{{ i + 1 }}. {{ q.text | stripHtml }}</strong>
                <span class="q__pts">{{ q.points }} P.</span>
                <button mat-button color="warn" (click)="removeQuestion(t, q.id)">Entfernen</button>
              </div>
              <ul class="opts">
                @for (o of q.options; track o.id) {
                  <li [class.correct]="o.isCorrect">
                    {{ o.isCorrect ? '✓' : '○' }} {{ o.text }}
                  </li>
                }
              </ul>
            </mat-card-content>
          </mat-card>
        }
      </section>

      <!-- Add question -->
      <mat-card appearance="outlined" class="builder">
        <mat-card-content>
          <h2>Frage hinzufügen</h2>
          <mat-form-field appearance="outline" class="type-select">
            <mat-label>Fragetyp</mat-label>
            <mat-select [value]="questionType()" (valueChange)="questionType.set($event)">
              <mat-option [value]="QuestionType.MultipleChoice">Multiple Choice</mat-option>
              <mat-option [value]="QuestionType.TrueFalse" disabled>Wahr/Falsch (bald)</mat-option>
              <mat-option [value]="QuestionType.OpenEnded" disabled>Offen (bald)</mat-option>
            </mat-select>
          </mat-form-field>

          @switch (questionType()) {
            @case (QuestionType.MultipleChoice) {
              <form [formGroup]="form" (ngSubmit)="addQuestion(t)">
                <div class="rte-field">
                  <label class="rte-field__label">Fragetext</label>
                  <app-rich-text-editor formControlName="text" [maxLength]="2000" minHeight="5rem" />
                </div>
                <div class="row">
                  <mat-form-field appearance="outline">
                    <mat-label>Punkte</mat-label>
                    <input matInput type="number" formControlName="points" />
                  </mat-form-field>
                  <mat-checkbox formControlName="allowMultiple">Mehrfachauswahl erlauben</mat-checkbox>
                </div>

                <h3>Antwortoptionen</h3>
                <div formArrayName="options">
                  @for (opt of options.controls; track opt; let i = $index) {
                    <div class="opt-row" [formGroupName]="i">
                      <mat-form-field appearance="outline" class="full">
                        <mat-label>Option {{ i + 1 }}</mat-label>
                        <input matInput formControlName="text" />
                      </mat-form-field>
                      <mat-checkbox formControlName="isCorrect">Richtig</mat-checkbox>
                      <button
                        mat-icon-button
                        type="button"
                        (click)="removeOption(i)"
                        [disabled]="options.length <= 2"
                        aria-label="Option entfernen"
                      >
                        ✕
                      </button>
                    </div>
                  }
                </div>
                <button mat-button type="button" (click)="addOption()">+ Option</button>

                <div class="builder__actions">
                  <button
                    mat-flat-button
                    color="primary"
                    type="submit"
                    [disabled]="form.invalid || !hasCorrect()"
                  >
                    Frage speichern
                  </button>
                  @if (!hasCorrect()) {
                    <span class="warn">Mindestens eine richtige Option markieren.</span>
                  }
                </div>
              </form>
            }
            @default {
              <p class="empty">Dieser Fragetyp ist noch nicht verfügbar.</p>
            }
          }
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [
    `
      .back {
        display: inline-block;
        margin-bottom: 1rem;
        font-weight: 600;
      }
      .page-head {
        margin-bottom: 1.5rem;
      }
      .meta {
        color: var(--color-muted);
      }
      .q {
        margin-bottom: 0.75rem;
      }
      .q__head {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .q__pts {
        color: var(--color-muted);
        margin-left: auto;
      }
      .opts {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0;
      }
      .opts li {
        padding: 0.2rem 0;
      }
      .opts li.correct {
        color: var(--color-success);
        font-weight: 600;
      }
      .builder {
        margin-top: 1.5rem;
      }
      .full {
        width: 100%;
      }
      .type-select {
        width: 260px;
        display: block;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .opt-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .builder__actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
      }
      .warn {
        color: var(--color-warning);
        font-size: 0.85rem;
      }
      .empty {
        color: var(--color-muted);
      }
    `,
  ],
})
export class TestEditorComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  readonly id = input.required<string>();
  readonly test = signal<AssessmentAdminDetail | null>(null);
  readonly questionType = signal<QuestionType>(QuestionType.MultipleChoice);
  protected readonly QuestionType = QuestionType;

  readonly form = this.fb.nonNullable.group({
    text: ['', [Validators.required, Validators.maxLength(20000)]],
    points: [1, [Validators.required, Validators.min(1)]],
    allowMultiple: [false],
    options: this.fb.array([this.optionGroup(), this.optionGroup()]),
  });

  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.api.getTest(this.id()).subscribe((t) => this.test.set(t));
  }

  private optionGroup() {
    return this.fb.nonNullable.group({
      text: ['', [Validators.required]],
      isCorrect: [false],
    });
  }

  addOption(): void {
    this.options.push(this.optionGroup());
  }

  removeOption(index: number): void {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    }
  }

  hasCorrect(): boolean {
    return this.options.controls.some((c) => c.get('isCorrect')?.value === true);
  }

  addQuestion(test: AssessmentAdminDetail): void {
    if (this.form.invalid || !this.hasCorrect()) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const options: OptionInput[] = v.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect }));
    this.api
      .addMcQuestion(test.id, {
        text: v.text,
        points: v.points,
        allowMultiple: v.allowMultiple,
        options,
      })
      .subscribe(() => {
        this.toast.success('Frage hinzugefügt.');
        this.form.reset({ points: 1, allowMultiple: false });
        this.options.clear();
        this.options.push(this.optionGroup());
        this.options.push(this.optionGroup());
        this.load();
      });
  }

  removeQuestion(test: AssessmentAdminDetail, questionId: string): void {
    this.confirm
      .ask({
        title: 'Frage entfernen?',
        message: 'Diese Frage wird aus dem Test entfernt.',
        confirmText: 'Entfernen',
        danger: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.api.removeQuestion(test.id, questionId).subscribe(() => {
          this.toast.success('Frage entfernt.');
          this.load();
        });
      });
  }

  statusLabel(s: number): string {
    return STATUS_LABELS[s as keyof typeof STATUS_LABELS];
  }
}
