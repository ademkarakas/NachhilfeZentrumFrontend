import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FaqItem } from '../../core/models/api.models';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';

export interface FaqFormResult {
  question: string;
  answer: string;
  category: string | null;
  isPublished: boolean;
}

interface DialogData {
  faqItem: FaqItem | null;
}

@Component({
  selector: 'app-faq-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    RichTextEditorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq-form-dialog.component.html',
  styleUrl: './faq-form-dialog.component.scss',
})
export class FaqFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<FaqFormDialogComponent, FaqFormResult>);

  readonly form = this.fb.nonNullable.group({
    question: [this.data.faqItem?.question ?? '', [Validators.required, Validators.maxLength(500)]],
    answer: [this.data.faqItem?.answer ?? '', [Validators.required, Validators.maxLength(20000)]],
    category: [this.data.faqItem?.category ?? ''],
    isPublished: [this.data.faqItem?.isPublished ?? true],
  });

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.ref.close({
      question: v.question,
      answer: v.answer,
      category: v.category || null,
      isPublished: v.isPublished,
    });
  }
}
