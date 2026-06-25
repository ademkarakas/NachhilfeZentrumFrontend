import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { AuthService } from '../../core/auth/auth.service';
import { MyAttemptListItem } from '../../core/models/api.models';
import { AttemptStatus } from '../../core/models/enums';
import { SeoService } from '../../core/seo/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';

/**
 * "Mein Konto" — the self-service area for registered students/parents. Reached only
 * through the {@link authGuard}. Combines profile editing with the user's own test
 * history ("Meine Ergebnisse"); each result links to the existing attempt-result page.
 */
@Component({
  selector: 'app-account',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    SpinnerComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PublicApiService);
  readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly AttemptStatus = AttemptStatus;

  readonly attempts = signal<MyAttemptListItem[]>([]);
  readonly loadingAttempts = signal(true);
  readonly savingProfile = signal(false);

  readonly hasAttempts = computed(() => this.attempts().length > 0);

  readonly form = this.fb.nonNullable.group({
    fullName: [this.auth.fullName() ?? '', [Validators.required, Validators.maxLength(200)]],
    email: [this.auth.email() ?? '', [Validators.required, Validators.email]],
    currentPassword: [''],
    newPassword: [''],
  });

  ngOnInit(): void {
    this.seo.update({ title: 'Mein Konto', path: '/mein-konto' });
    this.api.getMyAttempts().subscribe({
      next: (a) => {
        this.attempts.set(a);
        this.loadingAttempts.set(false);
      },
      error: () => this.loadingAttempts.set(false),
    });
  }

  saveProfile(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    if (v.newPassword && !v.currentPassword) {
      this.toast.error('Bitte gib dein aktuelles Passwort ein, um ein neues zu setzen.');
      return;
    }

    this.savingProfile.set(true);
    this.auth
      .updateProfile({
        fullName: v.fullName,
        email: v.email || null,
        currentPassword: v.currentPassword || null,
        newPassword: v.newPassword || null,
      })
      .subscribe({
        next: () => {
          this.savingProfile.set(false);
          this.form.patchValue({ currentPassword: '', newPassword: '' });
          this.toast.success('Dein Profil wurde aktualisiert.');
        },
        error: (err) => {
          this.savingProfile.set(false);
          this.toast.error(err?.error?.detail || 'Profil konnte nicht aktualisiert werden.');
        },
      });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  statusTone(status: AttemptStatus): 'success' | 'warning' | 'neutral' {
    if (status === AttemptStatus.PendingReview) return 'warning';
    if (status === AttemptStatus.Completed) return 'success';
    return 'neutral';
  }

  statusLabel(status: AttemptStatus): string {
    switch (status) {
      case AttemptStatus.Completed:
        return 'Ausgewertet';
      case AttemptStatus.PendingReview:
        return 'In Auswertung';
      default:
        return 'In Bearbeitung';
    }
  }
}
