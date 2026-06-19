import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TeamMember } from '../../core/models/api.models';
import { STAFF_KIND_LABELS, StaffKind } from '../../core/models/enums';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';
import { ImagePickerComponent } from '../../shared/ui/image-picker.component';

export interface TeamFormResult {
  fullName: string;
  kind: StaffKind;
  title: string | null;
  bio: string;
  photoUrl: string | null;
  credentials: string | null;
  subjectsTaught: string | null;
  isPublished: boolean;
}

@Component({
  selector: 'app-team-form-dialog',
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
  templateUrl: './team-form-dialog.component.html',
  styleUrl: './team-form-dialog.component.scss',
})
export class TeamFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject<TeamMember | null>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<TeamFormDialogComponent, TeamFormResult>);
  protected readonly Kind = StaffKind;

  readonly form = this.fb.nonNullable.group({
    fullName: [this.data?.fullName ?? '', [Validators.required, Validators.maxLength(150)]],
    kind: [this.data?.kind ?? StaffKind.Tutor, [Validators.required]],
    title: [this.data?.title ?? ''],
    bio: [this.data?.bio ?? '', [Validators.maxLength(20000)]],
    photoUrl: [this.data?.photoUrl ?? ''],
    credentials: [this.data?.credentials ?? ''],
    subjectsTaught: [this.data?.subjectsTaught ?? ''],
    isPublished: [this.data?.isPublished ?? true],
  });

  kindLabel(k: StaffKind): string {
    return STAFF_KIND_LABELS[k];
  }

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.ref.close({
      fullName: v.fullName,
      kind: v.kind,
      title: v.title || null,
      bio: v.bio,
      photoUrl: v.photoUrl || null,
      credentials: v.credentials || null,
      subjectsTaught: v.subjectsTaught || null,
      isPublished: v.isPublished,
    });
  }
}
