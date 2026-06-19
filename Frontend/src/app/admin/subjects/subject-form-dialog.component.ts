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
  template: `
    <h2 mat-dialog-title>{{ data ? 'Fach bearbeiten' : 'Neues Fach' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" (blur)="syncSlug()" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Slug</mat-label>
          <input matInput formControlName="slug" />
          <mat-hint>URL-Teil, z. B. „mathematik“</mat-hint>
        </mat-form-field>
        <div class="rte-field">
          <label class="rte-field__label">Beschreibung</label>
          <app-rich-text-editor formControlName="description" [maxLength]="2000" />
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Icon-Schlüssel (optional)</mat-label>
          <input matInput formControlName="iconKey" />
        </mat-form-field>
        <mat-checkbox formControlName="isActive">Aktiv (auf der Website sichtbar)</mat-checkbox>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" [mat-dialog-close]="undefined">Abbrechen</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
          Speichern
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .form {
        display: flex;
        flex-direction: column;
        min-width: min(460px, 80vw);
        padding-top: 0.5rem;
      }
    `,
  ],
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
