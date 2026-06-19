import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CoachingProgram } from '../../core/models/api.models';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';
import { ImagePickerComponent } from '../../shared/ui/image-picker.component';
import { slugify } from '../subjects/subject-form-dialog.component';

export interface CoachingFormResult {
  title: string;
  slug: string;
  description: string;
  targetAudience: string;
  outcomes: string;
  ctaText: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-coaching-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    RichTextEditorComponent,
    ImagePickerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coaching-form-dialog.component.html',
  styleUrl: './coaching-form-dialog.component.scss',
})
export class CoachingFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject<CoachingProgram | null>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<CoachingFormDialogComponent, CoachingFormResult>);

  readonly form = this.fb.nonNullable.group({
    title: [this.data?.title ?? '', [Validators.required, Validators.maxLength(150)]],
    slug: [this.data?.slug ?? '', [Validators.required]],
    targetAudience: [this.data?.targetAudience ?? '', [Validators.required]],
    description: [this.data?.description ?? '', [Validators.required, Validators.maxLength(20000)]],
    outcomes: [this.data?.outcomes ?? ''],
    ctaText: [this.data?.ctaText ?? ''],
    ctaLink: [this.data?.ctaLink ?? ''],
    imageUrl: [this.data?.imageUrl ?? ''],
    isActive: [this.data?.isActive ?? true],
  });

  syncSlug(): void {
    const slug = this.form.controls.slug;
    if (!slug.value) {
      slug.setValue(slugify(this.form.controls.title.value));
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const v = this.form.getRawValue();
    this.ref.close({
      title: v.title,
      slug: v.slug,
      description: v.description,
      targetAudience: v.targetAudience,
      outcomes: v.outcomes,
      ctaText: v.ctaText || null,
      ctaLink: v.ctaLink || null,
      imageUrl: v.imageUrl || null,
      isActive: v.isActive,
    });
  }
}
