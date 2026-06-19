import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonComponent } from '../../shared/ui/button.component';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, RevealDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="auth-page">
      <div class="auth-card" appReveal>
        <div class="auth-header">
          <span class="auth-badge">
            <app-icon name="lock" [size]="24" />
          </span>
          <h1>Anmelden</h1>
          <p class="hint">
            Du kannst Tests auch ohne Konto absolvieren — ein Login ist nur für persönliche Inhalte
            nötig.
          </p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="field">
            <label for="email">E-Mail</label>
            <div class="input-group">
              <span class="input-icon">
                <app-icon name="mail" [size]="18" />
              </span>
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
            <label for="password">Passwort</label>
            <div class="input-group">
              <span class="input-icon">
                <app-icon name="lock" [size]="18" />
              </span>
              <input
                id="password"
                type="password"
                formControlName="password"
                autocomplete="current-password"
                placeholder="••••••••"
              />
            </div>
            <a class="forgot-link" href="javascript:void(0)">Passwort vergessen?</a>
          </div>

          @if (error()) {
            <div class="err-banner">
              <app-icon name="alert-circle" [size]="16" />
              <span>{{ error() }}</span>
            </div>
          }

          <app-button type="submit" size="lg" [disabled]="submitting()" class="full-width">
            {{ submitting() ? 'Anmelden…' : 'Anmelden' }}
          </app-button>
        </form>

        <div class="auth-footer">
          <p class="alt">
            Noch kein Konto?
            <a routerLink="/registrieren">
              Jetzt registrieren
              <app-icon name="arrow-right" [size]="16" />
            </a>
          </p>
        </div>
      </div>
    </section>
  `,
  styleUrl: './auth.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.seo.update({ title: 'Anmelden', path: '/login' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('E-Mail oder Passwort ist nicht korrekt.');
      },
    });
  }
}
