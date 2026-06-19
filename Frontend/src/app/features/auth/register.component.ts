import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ProblemDetails } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonComponent } from '../../shared/ui/button.component';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, RevealDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="auth-page">
      <div class="auth-card" appReveal>
        <div class="auth-header">
          <span class="auth-badge">
            <app-icon name="users" [size]="24" />
          </span>
          <h1>Konto erstellen</h1>
          <p class="hint">Für Schüler:innen und Eltern. Die Registrierung ist kostenlos.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="field">
            <label for="fullName">Name</label>
            <div class="input-group">
              <span class="input-icon"><app-icon name="user" [size]="18" /></span>
              <input
                id="fullName"
                type="text"
                formControlName="fullName"
                autocomplete="name"
                placeholder="Ihr Name"
              />
            </div>
          </div>

          <div class="field">
            <label for="role">Ich bin</label>
            <select id="role" formControlName="role">
              <option value="Student">Schüler:in</option>
              <option value="Parent">Elternteil</option>
            </select>
          </div>

          <div class="field">
            <label for="email">E-Mail</label>
            <div class="input-group">
              <span class="input-icon"><app-icon name="mail" [size]="18" /></span>
              <input
                id="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                placeholder="name@beispiel.de"
              />
            </div>
          </div>

          <div class="field">
            <label for="password">Passwort (min. 8 Zeichen)</label>
            <div class="input-group">
              <span class="input-icon"><app-icon name="lock" [size]="18" /></span>
              <input
                id="password"
                type="password"
                formControlName="password"
                autocomplete="new-password"
                placeholder="••••••••"
              />
            </div>
          </div>

          @if (error()) {
            <div class="err-banner">
              <app-icon name="alert-circle" [size]="16" />
              <span>{{ error() }}</span>
            </div>
          }

          <app-button type="submit" size="lg" [disabled]="submitting()" class="full-width">
            {{ submitting() ? 'Wird erstellt…' : 'Registrieren' }}
          </app-button>
        </form>

        <div class="auth-footer">
          <p class="alt">
            Bereits ein Konto?
            <a routerLink="/login">
              Anmelden
              <app-icon name="arrow-right" [size]="16" />
            </a>
          </p>
        </div>
      </div>
    </section>
  `,
  styleUrl: './auth.scss',
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(150)]],
    role: ['Student', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.seo.update({ title: 'Registrieren', path: '/registrieren' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.success('Willkommen! Dein Konto wurde erstellt.');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.submitting.set(false);
        const problem = err?.error as ProblemDetails | undefined;
        this.error.set(
          problem?.detail ||
            problem?.title ||
            'Registrierung fehlgeschlagen. Bitte prüfe deine Angaben.',
        );
      },
    });
  }
}
