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
  templateUrl: './contact.component.html',
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
