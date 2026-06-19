import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from '../../core/models/api.models';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';

export interface SubjectFormResult {
  name: string;
  slug: string;
  description: string;
  iconKey: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-subject-form-dialog',
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
  templateUrl: './subject-form-dialog.component.html',
  styleUrl: './subject-form-dialog.component.scss',
})
export class SubjectFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject<Subject | null>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<SubjectFormDialogComponent, SubjectFormResult>);

  readonly form = this.fb.nonNullable.group({
    name: [this.data?.name ?? '', [Validators.required, Validators.maxLength(100)]],
    slug: [this.data?.slug ?? '', [Validators.required, Validators.maxLength(120)]],
    description: [this.data?.description ?? '', [Validators.maxLength(20000)]],
    iconKey: [this.data?.iconKey ?? ''],
    isActive: [this.data?.isActive ?? true],
  });

  syncSlug(): void {
    const slug = this.form.controls.slug;
    if (!slug.value) {
      slug.setValue(slugify(this.form.controls.name.value));
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const v = this.form.getRawValue();
    this.ref.close({
      name: v.name,
      slug: v.slug,
      description: v.description,
      iconKey: v.iconKey || null,
      isActive: v.isActive,
    });
  }
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
