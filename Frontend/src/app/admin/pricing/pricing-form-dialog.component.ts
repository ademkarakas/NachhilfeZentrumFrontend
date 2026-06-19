import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { PricingTier } from '../../core/models/api.models';

export interface PricingFormResult {
  name: string;
  subtitle: string;
  price: string;
  priceUnit: string;
  features: string;
  isHighlighted: boolean;
  isCoachingVariant: boolean;
  ctaText: string | null;
  ctaLink: string | null;
  isPublished: boolean;
}

interface DialogData {
  tier: PricingTier | null;
}

@Component({
  selector: 'app-pricing-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pricing-form-dialog.component.html',
  styleUrl: './pricing-form-dialog.component.scss',
})
export class PricingFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<PricingFormDialogComponent, PricingFormResult>);

  readonly form = this.fb.nonNullable.group({
    name: [this.data.tier?.name ?? '', [Validators.required, Validators.maxLength(150)]],
    subtitle: [this.data.tier?.subtitle ?? ''],
    price: [this.data.tier?.price ?? '', [Validators.required, Validators.maxLength(50)]],
    priceUnit: [this.data.tier?.priceUnit ?? ''],
    features: [this.data.tier?.features ?? ''],
    isHighlighted: [this.data.tier?.isHighlighted ?? false],
    isCoachingVariant: [this.data.tier?.isCoachingVariant ?? false],
    ctaText: [this.data.tier?.ctaText ?? ''],
    ctaLink: [this.data.tier?.ctaLink ?? ''],
    isPublished: [this.data.tier?.isPublished ?? true],
  });

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.ref.close({
      name: v.name,
      subtitle: v.subtitle,
      price: v.price,
      priceUnit: v.priceUnit,
      features: v.features,
      isHighlighted: v.isHighlighted,
      isCoachingVariant: v.isCoachingVariant,
      ctaText: v.ctaText || null,
      ctaLink: v.ctaLink || null,
      isPublished: v.isPublished,
    });
  }
}
