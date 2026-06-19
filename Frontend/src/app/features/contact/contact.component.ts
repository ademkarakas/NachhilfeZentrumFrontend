import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicApiService } from '../../core/api/public-api.service';
import { SubjectSummary } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonComponent } from '../../shared/ui/button.component';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, ButtonComponent, RevealDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-band">
      <div class="container narrow" appReveal>
        <span class="eyebrow">Kontakt</span>
        <h1>Kostenloses Erstgespräch</h1>
        <p class="lead">
          Erzählen Sie uns kurz, worum es geht — wir melden uns zeitnah mit einem passenden
          Vorschlag für Nachhilfe oder Coaching.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container narrow" appReveal>
        @if (sent()) {
          <div class="success-card" role="status">
            <div class="success-icon">
              <app-icon name="check" [size]="32" />
            </div>
            <h2>Vielen Dank!</h2>
            <p>Ihre Anfrage ist bei uns eingegangen. Wir melden uns so schnell wie möglich.</p>
          </div>
        } @else {
          <div class="contact-layout">
            <!-- Trust sidebar -->
            <aside class="trust-aside">
              <div class="trust-item">
                <span class="trust-icon"><app-icon name="badge-check" [size]="20" /></span>
                <div>
                  <strong>Kostenlos & unverbindlich</strong>
                  <p>Kein Vertrag, kein Risiko</p>
                </div>
              </div>
              <div class="trust-item">
                <span class="trust-icon"><app-icon name="clock" [size]="20" /></span>
                <div>
                  <strong>Antwort innerhalb 24h</strong>
                  <p>Schnelle & persönliche Rückmeldung</p>
                </div>
              </div>
              <div class="trust-item">
                <span class="trust-icon"><app-icon name="shield-check" [size]="20" /></span>
                <div>
                  <strong>Datenschutz garantiert</strong>
                  <p>Ihre Daten sind bei uns sicher</p>
                </div>
              </div>
            </aside>

            <!-- Form card -->
            <div class="contact-card">
              <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
                <span class="form-section-label">Kontaktdaten</span>

                <div class="field">
                  <label for="name">Name *</label>
                  <div class="input-group">
                    <span class="input-icon"><app-icon name="user" [size]="18" /></span>
                    <input
                      id="name"
                      type="text"
                      formControlName="name"
                      autocomplete="name"
                      placeholder="Ihr vollständiger Name"
                    />
                  </div>
                  @if (invalid('name')) {
                    <small class="err">Bitte geben Sie Ihren Namen an.</small>
                  }
                </div>

                <div class="row">
                  <div class="field">
                    <label for="email">E-Mail *</label>
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
                    @if (invalid('email')) {
                      <small class="err">Bitte geben Sie eine gültige E-Mail-Adresse an.</small>
                    }
                  </div>
                  <div class="field">
                    <label for="phone">Telefon</label>
                    <div class="input-group">
                      <span class="input-icon"><app-icon name="phone" [size]="18" /></span>
                      <input
                        id="phone"
                        type="tel"
                        formControlName="phone"
                        autocomplete="tel"
                        placeholder="+49 ..."
                      />
                    </div>
                  </div>
                </div>

                <span class="form-section-label">Ihre Anfrage</span>

                <div class="field">
                  <label for="subject">Interesse an</label>
                  <div class="select-wrapper">
                    <select id="subject" formControlName="subjectOfInterest">
                      <option value="">Bitte wählen (optional)</option>
                      <option value="Coaching / Lerncoaching">Coaching / Lerncoaching</option>
                      @for (s of subjects(); track s.id) {
                        <option [value]="'Nachhilfe: ' + s.name">Nachhilfe: {{ s.name }}</option>
                      }
                    </select>
                    <span class="select-chevron"><app-icon name="chevron-down" [size]="16" /></span>
                  </div>
                </div>

                <div class="field">
                  <label for="message">Ihre Nachricht *</label>
                  <textarea
                    id="message"
                    rows="5"
                    formControlName="message"
                    placeholder="Beschreiben Sie kurz Ihr Anliegen…"
                  ></textarea>
                  @if (invalid('message')) {
                    <small class="err">Bitte beschreiben Sie kurz Ihr Anliegen.</small>
                  }
                </div>

                <app-button type="submit" size="lg" [disabled]="submitting()" class="full-width">
                  @if (submitting()) {
                    Wird gesendet…
                  } @else {
                    Anfrage senden
                    <app-icon name="arrow-right" [size]="18" />
                  }
                </app-button>
              </form>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './contact.scss',
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly subjects = signal<SubjectSummary[]>([]);
  readonly submitting = signal(false);
  readonly sent = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subjectOfInterest: [''],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  ngOnInit(): void {
    this.seo.update({
      title: 'Kontakt & Erstgespräch',
      description: 'Vereinbaren Sie ein kostenloses Erstgespräch für Nachhilfe oder Coaching.',
      path: '/kontakt',
    });
    this.api.getSubjects().subscribe((s) => this.subjects.set(s));
  }

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const v = this.form.getRawValue();
    this.api
      .createLead({
        name: v.name,
        email: v.email,
        phone: v.phone || null,
        subjectOfInterest: v.subjectOfInterest || null,
        message: v.message,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.sent.set(true);
          this.toast.success('Ihre Anfrage wurde gesendet.');
        },
        error: () => {
          this.submitting.set(false);
          this.toast.error('Senden fehlgeschlagen. Bitte versuchen Sie es erneut.');
        },
      });
  }
}
