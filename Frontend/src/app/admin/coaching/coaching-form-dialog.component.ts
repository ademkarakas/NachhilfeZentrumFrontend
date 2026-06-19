import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CoachingProgram } from '../../core/models/api.models';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data ? 'Programm bearbeiten' : 'Neues Coaching-Programm' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="form">
        <mat-form-field appearance="outline">
          <mat-label>Titel</mat-label>
          <input matInput formControlName="title" (blur)="syncSlug()" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Slug</mat-label>
          <input matInput formControlName="slug" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Zielgruppe</mat-label>
          <input matInput formControlName="targetAudience" />
        </mat-form-field>
        <div class="rte-field">
          <label class="rte-field__label">Beschreibung</label>
          <app-rich-text-editor formControlName="description" [maxLength]="4000" />
        </div>
        <div class="rte-field">
          <label class="rte-field__label">Ergebnisse / Outcomes</label>
          <app-rich-text-editor
            formControlName="outcomes"
            [maxLength]="2000"
            placeholder="z. B. eine Liste der erreichbaren Ziele"
          />
        </div>
        <div class="grid">
          <mat-form-field appearance="outline">
            <mat-label>CTA-Text (optional)</mat-label>
            <input matInput formControlName="ctaText" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>CTA-Link (optional)</mat-label>
            <input matInput formControlName="ctaLink" />
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Bild-URL (optional)</mat-label>
          <input matInput formControlName="imageUrl" />
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
        min-width: min(560px, 85vw);
        padding-top: 0.5rem;
      }
      .grid {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: 1fr 1fr;
      }
    `,
  ],
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
