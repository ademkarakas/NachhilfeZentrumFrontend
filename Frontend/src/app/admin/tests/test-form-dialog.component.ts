import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AdminApiService } from '../../core/api/admin-api.service';
import { AssessmentAdminDetail, Subject } from '../../core/models/api.models';
import { AssessmentDifficulty, DIFFICULTY_LABELS } from '../../core/models/enums';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';
import { slugify } from '../subjects/subject-form-dialog.component';

export interface TestFormResult {
  title: string;
  slug: string;
  description: string;
  subjectId: string;
  difficulty: AssessmentDifficulty;
  estimatedDurationMinutes: number;
  requiresMembership: boolean;
}

@Component({
  selector: 'app-test-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    RichTextEditorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data ? 'Test bearbeiten' : 'Neuer Test' }}</h2>
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
        <div class="rte-field">
          <label class="rte-field__label">Beschreibung</label>
          <app-rich-text-editor formControlName="description" [maxLength]="4000" minHeight="6rem" />
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Fach</mat-label>
          <mat-select formControlName="subjectId">
            @for (s of subjects(); track s.id) {
              <mat-option [value]="s.id">{{ s.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <div class="grid">
          <mat-form-field appearance="outline">
            <mat-label>Schwierigkeit</mat-label>
            <mat-select formControlName="difficulty">
              @for (d of difficulties; track d) {
                <mat-option [value]="d">{{ difficultyLabel(d) }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Dauer (Min)</mat-label>
            <input matInput type="number" formControlName="estimatedDurationMinutes" />
          </mat-form-field>
        </div>
        <mat-checkbox formControlName="requiresMembership">
          Pro-Inhalt (Mitgliedschaft erforderlich) — Seam, noch nicht aktiv durchgesetzt
        </mat-checkbox>
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
        min-width: min(520px, 85vw);
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
export class TestFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminApiService);
  readonly data = inject<AssessmentAdminDetail | null>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<TestFormDialogComponent, TestFormResult>);

  readonly subjects = signal<Subject[]>([]);
  readonly difficulties = [
    AssessmentDifficulty.Easy,
    AssessmentDifficulty.Medium,
    AssessmentDifficulty.Hard,
  ];

  readonly form = this.fb.nonNullable.group({
    title: [this.data?.title ?? '', [Validators.required, Validators.maxLength(200)]],
    slug: [this.data?.slug ?? '', [Validators.required]],
    description: [this.data?.description ?? ''],
    subjectId: [this.data?.subjectId ?? '', [Validators.required]],
    difficulty: [this.data?.difficulty ?? AssessmentDifficulty.Easy, [Validators.required]],
    estimatedDurationMinutes: [
      this.data?.estimatedDurationMinutes ?? 15,
      [Validators.required, Validators.min(1)],
    ],
    requiresMembership: [this.data?.visibilityLevel === 1],
  });

  ngOnInit(): void {
    this.api.listSubjects({ page: 1, pageSize: 100 }).subscribe((r) => this.subjects.set(r.items));
  }

  syncSlug(): void {
    const slug = this.form.controls.slug;
    if (!slug.value) {
      slug.setValue(slugify(this.form.controls.title.value));
    }
  }

  difficultyLabel(d: AssessmentDifficulty): string {
    return DIFFICULTY_LABELS[d];
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.ref.close(this.form.getRawValue());
  }
}
