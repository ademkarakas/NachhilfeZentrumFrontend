import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Subject, Testimonial } from '../../core/models/api.models';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';
import { ImagePickerComponent } from '../../shared/ui/image-picker.component';

export interface TestimonialFormResult {
  authorName: string;
  authorRole: string | null;
  quote: string;
  photoUrl: string | null;
  subjectId: string | null;
  isPublished: boolean;
}

interface DialogData {
  testimonial: Testimonial | null;
  subjects: Subject[];
}

@Component({
  selector: 'app-testimonial-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    RichTextEditorComponent,
    ImagePickerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testimonial-form-dialog.component.html',
  styleUrl: './testimonial-form-dialog.component.scss',
})
export class TestimonialFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(
    MatDialogRef<TestimonialFormDialogComponent, TestimonialFormResult>,
  );

  readonly form = this.fb.nonNullable.group({
    authorName: [this.data.testimonial?.authorName ?? '', [Validators.required]],
    authorRole: [this.data.testimonial?.authorRole ?? ''],
    quote: [this.data.testimonial?.quote ?? '', [Validators.required, Validators.maxLength(20000)]],
    photoUrl: [this.data.testimonial?.photoUrl ?? ''],
    subjectId: [this.data.testimonial?.subjectId ?? (null as string | null)],
    isPublished: [this.data.testimonial?.isPublished ?? true],
  });

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.ref.close({
      authorName: v.authorName,
      authorRole: v.authorRole || null,
      quote: v.quote,
      photoUrl: v.photoUrl || null,
      subjectId: v.subjectId || null,
      isPublished: v.isPublished,
    });
  }
}
