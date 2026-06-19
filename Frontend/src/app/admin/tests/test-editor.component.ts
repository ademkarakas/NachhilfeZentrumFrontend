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
  templateUrl: './test-editor.component.html',
  styleUrl: './test-editor.component.scss',
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
