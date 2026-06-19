import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';

interface ProfileDialogData {
  fullName: string | null;
  email: string | null;
}

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-profile-dialog.component.html',
  styleUrl: './edit-profile-dialog.component.scss',
})
export class EditProfileDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditProfileDialogComponent>);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly data: ProfileDialogData = inject(MAT_DIALOG_DATA);

  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    fullName: [this.data.fullName ?? '', [Validators.required, Validators.maxLength(200)]],
    email: [this.data.email ?? '', [Validators.required, Validators.email]],
    currentPassword: [''],
    newPassword: [''],
  });

  save(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    if (v.newPassword && !v.currentPassword) {
      this.toast.error('Bitte aktuelles Passwort eingeben.');
      return;
    }

    this.saving.set(true);
    this.auth
      .updateProfile({
        fullName: v.fullName,
        email: v.email || null,
        currentPassword: v.currentPassword || null,
        newPassword: v.newPassword || null,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.saving.set(false);
          this.toast.error(err?.error?.detail || 'Fehler beim Aktualisieren.');
        },
      });
  }
}
